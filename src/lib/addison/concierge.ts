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
  const rateCents = peak ? 15000 : input.location === "massage_room" ? 10000 : 12000;
  return {
    rateCents,
    totalCents: Math.round((rateCents * input.durationMinutes) / 60),
    peak,
    label: peak ? "Evening / weekend" : input.location === "massage_room" ? "Massage room" : "In-apartment",
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
