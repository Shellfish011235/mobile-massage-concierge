import { computePriceQuote, DEFAULT_PLATFORM } from "@/lib/pricing/compute-quote";
import type { Booking } from "@/types/booking";
import type { BookingRequestInput } from "@/lib/validations/booking";
import type { TherapistProfile } from "@/types/therapist-profile";

function isoNow() {
  return new Date().toISOString();
}

export function buildBookingFromRequest(
  input: BookingRequestInput,
  therapist: TherapistProfile,
): Booking {
  const offering = therapist.services.find((s) => s.id === input.serviceId);
  if (!offering) throw new Error("Invalid service");

  const travelFee =
    input.locationType === "hotel" ? 3500 : input.locationType === "office" ? 2500 : 1500;
  const valetFee = input.valetRequired === "yes" ? 2000 : 0;

  const quote = computePriceQuote({
    offering,
    durationMinutes: input.durationMinutes,
    selectedAddOnIds: input.selectedAddOnIds,
    appointmentDateTime: input.appointmentDateTime,
    travelFee,
    valetFee,
    ...DEFAULT_PLATFORM,
  });

  const id = `bk_${crypto.randomUUID().slice(0, 12)}`;

  return {
    id,
    clientId: "demo_client",
    therapistId: therapist.id,
    serviceName: offering.name,
    durationMinutes: input.durationMinutes,
    appointmentDateTime: input.appointmentDateTime,
    locationType: input.locationType,
    address: input.address,
    city: input.city,
    state: input.state,
    hotelName: input.hotelName ?? null,
    parkingNotes: input.parkingNotes ?? null,
    valetRequired: input.valetRequired,
    clientNotes: input.clientNotes ?? null,
    environmentConfirmed: true,
    spaceConfirmed: true,
    petsSecuredConfirmed: true,
    quietSettingConfirmed: true,
    cleanSurfaceConfirmed: true,
    status: "requested",
    subtotal: quote.subtotal + quote.addOnsTotal + quote.demandAdjustment,
    travelFee: quote.travelFee,
    valetFee: quote.valetFee,
    platformFee: quote.platformFee,
    total: quote.total,
    therapistPayout: quote.therapistPayout,
    estimatedArrivalAt: null,
    cancelledAt: null,
    cancelReason: null,
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
}
