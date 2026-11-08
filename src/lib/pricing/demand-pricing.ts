/**
 * Transparent, capped, Uber-inspired pricing for mobile massage.
 * All prices are in integer cents. Appointment input is a LOCAL wall-clock
 * datetime (YYYY-MM-DDTHH:mm), not a UTC timestamp.
 *
 * Preview is indicative. Server re-quotes from a trusted clock at creation.
 * No live supply surcharge is applied until trusted availability is available.
 */
export type DemandLevel = "normal" | "busy" | "very_busy";
export interface DemandPricingInput {
  appointmentDateTime?: string;
  /** Trusted booking clock; inject for deterministic testing. */
  now?: Date;
  /** Verified supply signal from a server-side availability service ONLY. */
  verifiedDemandLevel?: DemandLevel;
  /** IANA timezone where the massage occurs; MVP defaults to US Eastern. */
  timeZone?: string;
}
export interface DemandPricingAdjustment {
  percent: number;
  bookingWindowPercent: number;
  peakPercent: number;
  demandPercent: number;
  label: string;
}
export const DEMAND_PRICING = {
  advanceBookingHours: 48,
  shortNoticeHours: 24,
  urgentHours: 4,
  shortNoticePercent: 10,
  urgentPercent: 20,
  peakPercent: 10,
  busyPercent: 10,
  veryBusyPercent: 20,
  maxPercent: 35,
} as const;

export function computeDemandAdjustment(input: DemandPricingInput): DemandPricingAdjustment {
  const standard: DemandPricingAdjustment = {
    percent: 0, bookingWindowPercent: 0, peakPercent: 0, demandPercent: 0,
    label: "Advance / standard rate",
  };
  if (!input.appointmentDateTime) return standard;
  // Reject dates with offsets: peak windows must use the appointment's local time.
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(input.appointmentDateTime);
  if (!match) return standard;
  const [, y, m, d, h, min] = match;
  const year = Number(y), month = Number(m), day = Number(d);
  const hour = Number(h), minute = Number(min);
  const calendarDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  if (calendarDate.getUTCFullYear() !== year || calendarDate.getUTCMonth() !== month - 1 ||
      calendarDate.getUTCDate() !== day || calendarDate.getUTCHours() !== hour ||
      calendarDate.getUTCMinutes() !== minute) return standard;
  // Resolve the wall-clock appointment in a fixed business timezone so a
  // deployment in UTC and a customer's browser produce the same quote.
  const zone = input.timeZone ?? "America/New_York";
  const desired = Date.UTC(year, month - 1, day, hour, minute);
  const partsFor = (timestamp: number) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date(timestamp));
    const values = Object.fromEntries(parts.map((p) => [p.type, Number(p.value)]));
    return Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute);
  };
  let instant = desired;
  // Offset iteration also handles the usual daylight-saving transitions.
  for (let i = 0; i < 3; i += 1) instant += desired - partsFor(instant);
  if (partsFor(instant) !== desired) return standard; // Nonexistent DST time.
  const hoursOut = (instant - (input.now ?? new Date()).getTime()) / 3600000;
  if (hoursOut < 0) return standard; // Validation rejects past appointments separately.
  // Advance appointments remain standard even for anticipated peak days.
  if (hoursOut >= DEMAND_PRICING.advanceBookingHours) return standard;
  const bookingWindowPercent = hoursOut < DEMAND_PRICING.urgentHours
    ? DEMAND_PRICING.urgentPercent
    : hoursOut < DEMAND_PRICING.shortNoticeHours
      ? DEMAND_PRICING.shortNoticePercent : 0;
  // Illustrative, published local peak windows. Not live demand telemetry.
  const weekday = calendarDate.getUTCDay();
  const peak = (weekday === 5 && hour >= 17 && hour < 21) ||
    (weekday === 6 && hour >= 10 && hour < 18) ||
    (weekday === 0 && hour >= 10 && hour < 16);
  const peakPercent = peak ? DEMAND_PRICING.peakPercent : 0;
  const demandPercent = input.verifiedDemandLevel === "very_busy"
    ? DEMAND_PRICING.veryBusyPercent
    : input.verifiedDemandLevel === "busy" ? DEMAND_PRICING.busyPercent : 0;
  const percent = Math.min(DEMAND_PRICING.maxPercent,
    bookingWindowPercent + peakPercent + demandPercent);
  return {
    percent, bookingWindowPercent, peakPercent, demandPercent,
    label: percent === 0 ? "Standard rate" : "Busy / short-notice adjustment",
  };
}
