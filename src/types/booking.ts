/**
 * Booking lifecycle, location, and pricing snapshot fields.
 */

export type BookingStatus =
  | "requested"
  | "accepted"
  | "therapist_preparing"
  | "en_route"
  | "arriving_soon"
  | "arrived"
  | "in_session"
  | "completed"
  | "cancelled";

export type LocationType = "home" | "hotel" | "office" | "event";

export type ValetPreference = "yes" | "no" | "not_sure";

export interface Booking {
  id: string;
  clientId: string;
  therapistId: string;
  serviceName: string;
  durationMinutes: number;
  appointmentDateTime: string;
  locationType: LocationType;
  address: string;
  city: string;
  state: string;
  hotelName: string | null;
  parkingNotes: string | null;
  valetRequired: ValetPreference;
  clientNotes: string | null;
  environmentConfirmed: boolean;
  spaceConfirmed: boolean;
  petsSecuredConfirmed: boolean;
  quietSettingConfirmed: boolean;
  cleanSurfaceConfirmed: boolean;
  status: BookingStatus;
  /** Snapshot at booking time — currency units consistent with ServiceOffering */
  subtotal: number;
  travelFee: number;
  valetFee: number;
  platformFee: number;
  total: number;
  therapistPayout: number;
  /** Optional ETA for arrival notifications / future map layer */
  estimatedArrivalAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Allowed therapist-driven transitions — validate in state-machine utility */
export type TherapistBookingAction =
  | "accept"
  | "decline"
  | "start_preparing"
  | "start_route"
  | "mark_arriving_soon"
  | "mark_arrived"
  | "start_session"
  | "complete_session";
