/**
 * In-app + future push pipeline. Keep types stable for queue/webhook expansion.
 */

export type NotificationEventType =
  | "booking_requested"
  | "booking_accepted"
  | "booking_declined"
  | "therapist_preparing"
  | "therapist_en_route"
  | "therapist_arriving_soon"
  | "therapist_arrived"
  | "session_started"
  | "session_completed"
  | "booking_cancelled"
  | "review_requested"
  | "verification_approved"
  | "verification_rejected";

export interface NotificationEvent {
  id: string;
  bookingId: string | null;
  type: NotificationEventType;
  title: string;
  body: string;
  recipientUserId: string;
  read: boolean;
  /** Optional deep link or payload key for client routing */
  data: Record<string, string | number | boolean | null> | null;
  createdAt: string;
}
