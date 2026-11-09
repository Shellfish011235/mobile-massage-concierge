/**
 * Shared, provider-neutral scheduling math for mobile travel and setup buffers.
 * This module does not access GPS, maps, addresses, health data or calendars.
 * Production callers MUST validate tenant ownership, persist reservations,
 * recheck availability under a DB transaction and separately sync calendars.
 */
export type BusyBlock = {
  startIso: string;
  endIso: string;
  kind: "travel" | "appointment" | "setup" | "personal";
};

function timestamp(value: string): number {
  const milliseconds = new Date(value).getTime();
  if (!Number.isFinite(milliseconds)) throw new Error("Invalid date/time");
  return milliseconds;
}

function validMinutes(minutes: number): number {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 480) {
    throw new Error("Travel or setup minutes must be an integer from 0 to 480");
  }
  return minutes;
}

/** Block before a future appointment, plus optional setup/unloading time. */
export function travelArrivalBlock(input: {
  appointmentStartIso: string;
  travelMinutes: number;
  setupMinutes: number;
}): BusyBlock {
  const appointmentStart = timestamp(input.appointmentStartIso);
  const total = validMinutes(input.travelMinutes) + validMinutes(input.setupMinutes);
  if (!total) throw new Error("Travel and setup duration cannot both be zero");
  return {
    kind: "travel",
    startIso: new Date(appointmentStart - total * 60_000).toISOString(),
    endIso: new Date(appointmentStart).toISOString(),
  };
}

/** Block the trip departing a completed appointment, with teardown buffer. */
export function travelDepartureBlock(input: {
  appointmentEndIso: string;
  travelMinutes: number;
  teardownMinutes: number;
}): BusyBlock {
  const appointmentEnd = timestamp(input.appointmentEndIso);
  const total = validMinutes(input.travelMinutes) + validMinutes(input.teardownMinutes);
  if (!total) throw new Error("Travel and teardown duration cannot both be zero");
  return {
    kind: "travel",
    startIso: new Date(appointmentEnd).toISOString(),
    endIso: new Date(appointmentEnd + total * 60_000).toISOString(),
  };
}

/** Half-open intervals: adjacent appointments are allowed, overlaps are not. */
export function overlapsBusyBlock(candidate: BusyBlock, existing: BusyBlock): boolean {
  const a = timestamp(candidate.startIso), b = timestamp(candidate.endIso);
  const c = timestamp(existing.startIso), d = timestamp(existing.endIso);
  if (b <= a || d <= c) throw new Error("Busy block end must follow start");
  return a < d && c < b;
}

export function canReserveInterval(candidate: BusyBlock, existing: BusyBlock[]): boolean {
  return !existing.some(block => overlapsBusyBlock(candidate, block));
}

/**
 * Fail closed if a trip has no verified travel estimate: the caller must
 * request a manually entered buffer or a separately verified maps estimate.
 * Never assume a zero-minute trip between unknown destinations.
 */
export function requireTravelMinutes(estimateMinutes: number | null): number {
  if (estimateMinutes === null) throw new Error("Travel time is required before reserving a mobile appointment");
  return validMinutes(estimateMinutes);
}

/** Template for Google Calendar API; a real calendar writer is NOT connected. */
export function privateBusyCalendarEvent(block: BusyBlock) {
  timestamp(block.startIso);
  timestamp(block.endIso);
  if (timestamp(block.endIso) <= timestamp(block.startIso)) throw new Error("Invalid busy block");
  return {
    summary: "Travel / appointment buffer",
    start: { dateTime: block.startIso },
    end: { dateTime: block.endIso },
    transparency: "opaque" as const,
    visibility: "private" as const,
    description: "Private scheduling buffer. No client names, addresses or medical information.",
  };
}
