import type { BookingStatus, TherapistBookingAction } from "@/types/booking";

const transitions: Record<BookingStatus, Partial<Record<TherapistBookingAction, BookingStatus>>> = {
  requested: {
    accept: "accepted",
    decline: "cancelled",
  },
  accepted: {
    start_preparing: "therapist_preparing",
    start_route: "en_route",
    decline: "cancelled",
  },
  therapist_preparing: {
    start_route: "en_route",
  },
  en_route: {
    mark_arriving_soon: "arriving_soon",
    mark_arrived: "arrived",
  },
  arriving_soon: {
    mark_arrived: "arrived",
  },
  arrived: {
    start_session: "in_session",
  },
  in_session: {
    complete_session: "completed",
  },
  completed: {},
  cancelled: {},
};

export function nextBookingStatus(
  current: BookingStatus,
  action: TherapistBookingAction,
): BookingStatus | null {
  const next = transitions[current]?.[action];
  return next ?? null;
}

export function isTerminalStatus(status: BookingStatus): boolean {
  return status === "completed" || status === "cancelled";
}
