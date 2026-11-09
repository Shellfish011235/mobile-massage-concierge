/**
 * Booking routing is scoped by a verified venue ID, not by a city, street name,
 * free-form address, apartment location, or a therapist's account.
 * IMPORTANT: this pure policy helper is NOT authorization for sending messages.
 * The eventual server must obtain venueId and resourceId from trusted DB records
 * and validate tenant permissions, not from client-supplied parameters.
 */
export const ADDISON_VENUE_ID = "addison-boca-a1a" as const;
export const ADDISON_ROOM_RESOURCE_ID = "addison-resident-massage-room" as const;

export type BookingRouteInput = {
  venueId: string | null;
  resourceId: string | null;
  providerApprovalRequired?: boolean;
};

export type BookingApprovalRoute =
  | "addison_betty_room_approval"
  | "therapist_approval"
  | "provider_approval";

export function chooseBookingApprovalRoute(input: BookingRouteInput): BookingApprovalRoute {
  // Only the Addison's dedicated *shared massage room* uses Betty.
  if (
    input.venueId === ADDISON_VENUE_ID &&
    input.resourceId === ADDISON_ROOM_RESOURCE_ID
  ) return "addison_betty_room_approval";
  // Addison resident apartment visits and all external appointments
  // use therapist/owner approval; never route those messages to Betty.
  return input.providerApprovalRequired ? "provider_approval" : "therapist_approval";
}

export function assertBettyAuthorizedRoute(input: BookingRouteInput): void {
  if (chooseBookingApprovalRoute(input) !== "addison_betty_room_approval") {
    throw new Error("Betty approval is restricted to Addison shared-room reservations");
  }
}
