/**
 * Message content only; these helpers do NOT send messages or confirm bookings.
 * All timestamps are ISO instants. Render dates in the Addison local time zone.
 * Do not put real phone numbers, API keys or client contact information in Git.
 */
import { ADDISON_ZONE, addisonDepositBreakdown, type AddisonLocation } from "./concierge";

export type AddisonNotificationBooking = {
  reference: string;
  appointmentIso: string;
  durationMinutes: 60 | 90 | 120;
  location: AddisonLocation;
  totalCents: number;
  clientFirstName: string;
};

export type AddisonNotificationChannel = "sms" | "email";

const money = (cents: number) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD",
}).format(cents / 100);

export function addisonAppointmentLabel(iso: string): string {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) throw new Error("Invalid appointment time");
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ADDISON_ZONE,
    weekday: "short", month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }).format(date);
}

export const ADDISON_CANCELLATION_COPY =
  "Cancel before the appointment date (Addison local time) for a deposit refund. " +
  "Cancellations on the appointment date forfeit the $25 deposit, subject to applicable law and written policy. " +
  "If we cancel, the deposit is refunded.";

export function bettyRoomRequestMessage(booking: AddisonNotificationBooking): string {
  if (booking.location !== "massage_room") throw new Error("Betty approval is for the massage room only");
  return "The Addison Massage Concierge room request " + booking.reference + ": " +
    addisonAppointmentLabel(booking.appointmentIso) + ", " +
    booking.durationMinutes + " min. Reply YES " + booking.reference +
    " or NO " + booking.reference + ". Any changes can be sent as a normal reply for manual review.";
}

export function bettyReplyInstruction(reference: string): string {
  return "Reply YES " + reference + " or NO " + reference + ". Other replies go to Michele for review.";
}

export function ownerRoomStatusMessage(reference: string, status: "approved" | "declined" | "review"): string {
  return "Addison room request " + reference + ": Betty reply " +
    (status === "approved" ? "YES" : status === "declined" ? "NO" : "requires manual review") + ".";
}

export function clientRequestReceivedMessage(booking: AddisonNotificationBooking): string {
  return "The Addison Massage Concierge (Anam Beo Bodywork): We received your request for " + addisonAppointmentLabel(booking.appointmentIso) +
    ". This is NOT a confirmed appointment. We will contact you after availability is checked.";
}

export function clientDeclinedMessage(booking: AddisonNotificationBooking): string {
  return "The Addison Massage Concierge (Anam Beo Bodywork): Unfortunately " + addisonAppointmentLabel(booking.appointmentIso) +
    " is unavailable. No deposit is due. Please request another time.";
}

export function clientDepositRequestMessage(booking: AddisonNotificationBooking, verifiedHostedCheckoutUrl: string): string {
  const { depositCents, remainingCents } = addisonDepositBreakdown(booking.totalCents);
  if (!/^https:\/\//i.test(verifiedHostedCheckoutUrl)) throw new Error("Hosted checkout must use HTTPS");
  return "The Addison Massage Concierge (Anam Beo Bodywork): Your requested " + addisonAppointmentLabel(booking.appointmentIso) +
    " time is available but NOT yet booked. Pay the " + money(depositCents) +
    " deposit to complete booking: " + verifiedHostedCheckoutUrl +
    ". The deposit is credited toward your " + money(booking.totalCents) +
    " massage; " + money(remainingCents) +
    " is due at the end of service, with an optional tip. " + ADDISON_CANCELLATION_COPY;
}

/** Use ONLY after verified deposit receipt, authoritative schedule hold and calendar write. */
export function clientConfirmedMessage(booking: AddisonNotificationBooking): string {
  const { depositCents, remainingCents } = addisonDepositBreakdown(booking.totalCents);
  return "The Addison Massage Concierge (Anam Beo Bodywork): CONFIRMED " + booking.reference + " for " +
    addisonAppointmentLabel(booking.appointmentIso) + " (" +
    (booking.location === "massage_room" ? "Addison massage room" : "in-apartment") +
    "). " + money(depositCents) + " deposit received and credited to " +
    money(booking.totalCents) + " total. Balance " + money(remainingCents) +
    " is due after the service; an optional tip may be added. " + ADDISON_CANCELLATION_COPY;
}

/**
 * A consented client's SMS or email is selected by the server, not inferred
 * from a number's presence. Never send customer notifications to Betty.
 */
export function chooseNotificationChannel(input: {
  email?: string; phone?: string; smsConsent: boolean; preference: AddisonNotificationChannel;
}): AddisonNotificationChannel {
  if (input.preference === "sms") {
    if (!input.smsConsent || !input.phone) throw new Error("SMS requires explicit consent and a phone");
    return "sms";
  }
  if (!input.email) throw new Error("Email requires an address");
  return "email";
}
