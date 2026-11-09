/**
 * Addison-specific pricing. This does not modify marketplace pricing.
 * All monetary amounts are integer USD cents. Time is America/New_York.
 * Evening threshold is configurable; the proposed default is 5 PM.
 */
export type AddisonLocation = "massage_room" | "apartment";
export type AddisonRequestStatus =
  | "pending_betty"
  | "needs_clarification"
  | "declined"
  | "awaiting_client_acceptance"
  | "awaiting_payment"
  | "confirmed";

export const ADDISON_ZONE = "America/New_York";
export const ADDISON_EVENING_HOUR = 17;
export const ADDISON_DEPOSIT_CENTS = 2500;

/**
 * The $25 booking deposit is a credit toward the service total, not an added fee.
 * Same-day means the local calendar date of the appointment in America/New_York.
 * Earlier cancellations refund the deposit; same-day cancellations forfeit it.
 * No-show and exceptional circumstances require a separate written policy.
 */
export function addisonDepositBreakdown(totalCents: number) {
  const depositCents = Math.min(totalCents, ADDISON_DEPOSIT_CENTS);
  return { depositCents, remainingCents: totalCents - depositCents, totalCents };
}

export function isAddisonSameDayCancellation(appointmentIso: string, cancellationIso: string): boolean {
  const localDate = (iso: string) => new Intl.DateTimeFormat("en-CA", {
    timeZone: ADDISON_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(iso));
  const appointment = new Date(appointmentIso);
  const cancellation = new Date(cancellationIso);
  if (!Number.isFinite(appointment.getTime()) || !Number.isFinite(cancellation.getTime())) {
    throw new Error("Invalid cancellation or appointment date");
  }
  return localDate(appointmentIso) === localDate(cancellationIso);
}


export function addisonLocalParts(iso: string) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) throw new Error("Invalid appointment date");
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ADDISON_ZONE,
    weekday: "short", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return { weekday: get("weekday"), hour: Number(get("hour")) };
}

export function quoteAddison(input: {
  appointmentIso: string;
  durationMinutes: 60 | 90 | 120;
  location: AddisonLocation;
}): { rateCents: number; totalCents: number; peak: boolean; label: string } {
  const { weekday, hour } = addisonLocalParts(input.appointmentIso);
  const peak = weekday === "Sat" || weekday === "Sun" || hour >= ADDISON_EVENING_HOUR;
  const rateCents = input.location === "massage_room" ? (peak ? 12000 : 10000) : (peak ? 15000 : 12000);
  return {
    rateCents,
    totalCents: Math.round((rateCents * input.durationMinutes) / 60),
    peak,
    label: input.location === "massage_room" ? (peak ? "Addison Resident Massage Room · evening / weekend" : "Addison Resident Massage Room · weekday") : (peak ? "In-apartment · evening / weekend" : "In-apartment · weekday"),
  };
}

/** Natural-language replies must be uniquely matched to one pending request before applying. */
export function classifyBettyReply(reply: string):
  | { kind: "approved" }
  | { kind: "declined" }
  | { kind: "review"; detail: string } {
  const text = reply.trim();
  if (!text) return { kind: "review", detail: "Empty reply" };
  // Do not silently approve messages with restrictions, alternative times or ambiguity.
  if (/^(yes|y|yep|yeah|sure|ok|okay|approved)[.! ]*$/i.test(text)) return { kind: "approved" };
  if (/^(no|n|nope|declined|unavailable)[.! ]*$/i.test(text)) return { kind: "declined" };
  return { kind: "review", detail: text };
}

export const ADDISON_PAYMENT_OPTIONS = [
  { id: "square", label: "Square", mode: "checkout_integration_required" },
  { id: "zelle", label: "Zelle", mode: "manual_verification" },
  { id: "venmo", label: "Venmo", mode: "manual_verification" },
  { id: "crypto", label: "Crypto wallet", mode: "wallet_and_chain_verification_required" },
] as const;
