import type { Booking, BookingStatus, LocationType, ValetPreference } from "@/types/booking";

/** Row shape from public.bookings (snake_case). */
export type BookingRowDb = {
  id: string;
  client_id: string;
  therapist_id: string;
  service_name: string;
  duration_minutes: number;
  appointment_at: string;
  location_type: LocationType;
  address_line: string;
  city: string;
  state: string;
  hotel_name: string | null;
  parking_notes: string | null;
  valet_required: ValetPreference;
  client_notes: string | null;
  environment_confirmed: boolean;
  space_confirmed: boolean;
  pets_secured_confirmed: boolean;
  quiet_setting_confirmed: boolean;
  clean_surface_confirmed: boolean;
  status: BookingStatus;
  subtotal: number;
  travel_fee: number;
  valet_fee: number;
  platform_fee: number;
  total: number;
  therapist_payout: number;
  estimated_arrival_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
};

export function mapBookingRowToBooking(
  row: BookingRowDb,
  therapistPublicId: string,
): Booking {
  return {
    id: row.id,
    clientId: row.client_id,
    therapistId: therapistPublicId,
    serviceName: row.service_name,
    durationMinutes: row.duration_minutes,
    appointmentDateTime: row.appointment_at,
    locationType: row.location_type,
    address: row.address_line,
    city: row.city,
    state: row.state,
    hotelName: row.hotel_name,
    parkingNotes: row.parking_notes,
    valetRequired: row.valet_required,
    clientNotes: row.client_notes,
    environmentConfirmed: row.environment_confirmed,
    spaceConfirmed: row.space_confirmed,
    petsSecuredConfirmed: row.pets_secured_confirmed,
    quietSettingConfirmed: row.quiet_setting_confirmed,
    cleanSurfaceConfirmed: row.clean_surface_confirmed,
    status: row.status,
    subtotal: row.subtotal,
    travelFee: row.travel_fee,
    valetFee: row.valet_fee,
    platformFee: row.platform_fee,
    total: row.total,
    therapistPayout: row.therapist_payout,
    estimatedArrivalAt: row.estimated_arrival_at,
    cancelledAt: row.cancelled_at,
    cancelReason: row.cancel_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
