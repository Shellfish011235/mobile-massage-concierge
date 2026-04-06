"use server";

import { buildBookingFromRequest } from "@/lib/demo/create-booking";
import { mapBookingRowToBooking, type BookingRowDb } from "@/lib/supabase/booking-map";
import { tryCreateSupabaseServerClient } from "@/lib/supabase/server-client";
import { bookingRequestSchema, type BookingRequestInput } from "@/lib/validations/booking";
import { getTherapistById } from "@/data/mock-therapists";
import type { Booking } from "@/types/booking";

export type CreateBookingResult =
  | { ok: true; source: "database"; booking: Booking }
  | { ok: true; source: "demo"; useClientDemo: true }
  | { ok: false; needAuth: true }
  | { ok: false; error: string };

export async function createBookingAction(
  input: BookingRequestInput,
  therapistPublicId: string,
): Promise<CreateBookingResult> {
  const parsed = bookingRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const therapist = getTherapistById(therapistPublicId);
  if (!therapist) {
    return { ok: false, error: "Therapist not found" };
  }

  const supabase = await tryCreateSupabaseServerClient();
  if (!supabase) {
    return { ok: true, source: "demo", useClientDemo: true };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, needAuth: true };
  }

  const { data: tp, error: tpError } = await supabase
    .from("therapist_profiles")
    .select("id, public_id")
    .eq("public_id", therapistPublicId)
    .maybeSingle();

  if (tpError || !tp?.id) {
    return {
      ok: false,
      error:
        "This therapist is not available for live booking yet. Use demo mode (sign out / disable Supabase) or add a therapist row with matching public_id.",
    };
  }

  const snapshot = buildBookingFromRequest(parsed.data, therapist);
  snapshot.clientId = user.id;

  const appointmentAt = new Date(snapshot.appointmentDateTime);
  if (Number.isNaN(appointmentAt.getTime())) {
    return { ok: false, error: "Invalid appointment time" };
  }

  const insertPayload = {
    client_id: user.id,
    therapist_id: tp.id,
    service_name: snapshot.serviceName,
    duration_minutes: snapshot.durationMinutes,
    appointment_at: appointmentAt.toISOString(),
    location_type: snapshot.locationType,
    address_line: snapshot.address,
    city: snapshot.city,
    state: snapshot.state,
    hotel_name: snapshot.hotelName,
    parking_notes: snapshot.parkingNotes,
    valet_required: snapshot.valetRequired,
    client_notes: snapshot.clientNotes,
    environment_confirmed: snapshot.environmentConfirmed,
    space_confirmed: snapshot.spaceConfirmed,
    pets_secured_confirmed: snapshot.petsSecuredConfirmed,
    quiet_setting_confirmed: snapshot.quietSettingConfirmed,
    clean_surface_confirmed: snapshot.cleanSurfaceConfirmed,
    status: snapshot.status,
    subtotal: snapshot.subtotal,
    travel_fee: snapshot.travelFee,
    valet_fee: snapshot.valetFee,
    platform_fee: snapshot.platformFee,
    total: snapshot.total,
    therapist_payout: snapshot.therapistPayout,
    estimated_arrival_at: snapshot.estimatedArrivalAt,
    cancelled_at: snapshot.cancelledAt,
    cancel_reason: snapshot.cancelReason,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("bookings")
    .insert(insertPayload)
    .select("*")
    .single();

  if (insertError || !inserted) {
    return { ok: false, error: insertError?.message ?? "Could not save booking" };
  }

  const row = inserted as BookingRowDb;
  const publicId = tp.public_id ?? therapistPublicId;
  const booking = mapBookingRowToBooking(row, publicId);

  return { ok: true, source: "database", booking };
}

export async function listMyBookingsAction(): Promise<Booking[]> {
  const supabase = await tryCreateSupabaseServerClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: rows, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !rows?.length) return [];

  const typedRows = rows as BookingRowDb[];
  const therapistIds = [...new Set(typedRows.map((r) => r.therapist_id))];
  const { data: tps } = await supabase
    .from("therapist_profiles")
    .select("id, public_id")
    .in("id", therapistIds);

  const idToPublic = new Map<string, string>();
  for (const t of tps ?? []) {
    if (t.public_id) idToPublic.set(t.id as string, t.public_id as string);
  }

  return typedRows.map((row) => {
    const pid = idToPublic.get(row.therapist_id) ?? row.therapist_id;
    return mapBookingRowToBooking(row, pid);
  });
}

export async function getMyBookingByIdAction(id: string): Promise<Booking | null> {
  const supabase = await tryCreateSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .eq("client_id", user.id)
    .maybeSingle();

  if (error || !row) return null;

  const r = row as BookingRowDb;
  const { data: tp } = await supabase
    .from("therapist_profiles")
    .select("public_id")
    .eq("id", r.therapist_id)
    .maybeSingle();

  const pid = (tp?.public_id as string | undefined) ?? r.therapist_id;
  return mapBookingRowToBooking(r, pid);
}
