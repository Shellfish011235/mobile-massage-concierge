import { type BusyBlock, overlapsBusyBlock, privateBusyCalendarEvent } from "./travel-buffers";

/**
 * Deterministic, in-memory scheduling policy. No DB, SMS, maps, GPS, clinical
 * information, Google Calendar or paid requests. Tenant/provider IDs must be
 * authenticated and checked again by the eventual server-side transaction.
 */
export type MobileVisit = {
  id: string;
  tenantId: string;
  therapistId: string;
  startIso: string;
  endIso: string;
  travelBeforeMinutes: number;
  setupMinutes: number;
  teardownMinutes: number;
  travelAfterMinutes: number;
};

export type Reservation = BusyBlock & {
  id: string;
  visitId: string;
  tenantId: string;
  therapistId: string;
};

type UpdateResult =
  | { ok: true; visits: MobileVisit[]; reservations: Reservation[] }
  | { ok: false; error: string; conflictingVisitId?: string };

const millis = (iso: string): number => {
  const value = new Date(iso).getTime();
  if (!Number.isFinite(value)) throw new Error("Invalid visit timestamp");
  return value;
};

const minutes = (value: number): number => {
  if (!Number.isInteger(value) || value < 0 || value > 480)
    throw new Error("Buffers must be whole minutes between 0 and 480");
  return value;
};

export function reservationsForVisit(visit: MobileVisit): Reservation[] {
  if (!visit.id || !visit.tenantId || !visit.therapistId) throw new Error("Missing visit scope");
  const start = millis(visit.startIso), end = millis(visit.endIso);
  if (end <= start) throw new Error("Visit must end after it starts");
  const before = minutes(visit.travelBeforeMinutes) + minutes(visit.setupMinutes);
  const after = minutes(visit.teardownMinutes) + minutes(visit.travelAfterMinutes);
  const make = (suffix: string, kind: BusyBlock["kind"], a: number, b: number): Reservation => ({
    id: visit.id + ":" + suffix, visitId: visit.id, tenantId: visit.tenantId,
    therapistId: visit.therapistId, kind,
    startIso: new Date(a).toISOString(), endIso: new Date(b).toISOString(),
  });
  return [
    ...(before > 0 ? [make("arrival", "travel", start - before * 60000, start)] : []),
    make("service", "appointment", start, end),
    ...(after > 0 ? [make("departure", "travel", end, end + after * 60000)] : []),
  ];
}

/** A move regenerates the identical deterministic reservation IDs. */
export function reservationCalendarEvents(visits: MobileVisit[]) {
  return visits.flatMap(visit => reservationsForVisit(visit).map(block => ({
    reservationId: block.id,
    providerId: block.therapistId,
    event: privateBusyCalendarEvent(block),
  })));
}

/**
 * Fail closed for overlapping blocked intervals belonging to the same therapist.
 * Do not compare separate therapists; same person under multiple businesses
 * requires a distinct verified cross-tenant availability mechanism.
 */
export function reconcileMobileVisit(
  visits: MobileVisit[],
  action: { type: "accept" | "move"; visit: MobileVisit } | { type: "cancel"; visitId: string; tenantId: string; therapistId: string },
): UpdateResult {
  try {
    if (action.type === "cancel") {
      const found = visits.find(v => v.id === action.visitId && v.tenantId === action.tenantId &&
        v.therapistId === action.therapistId);
      if (!found) return { ok: false, error: "Visit not found in the specified tenant and therapist scope" };
      const next = visits.filter(v => v !== found);
      return { ok: true, visits: next, reservations: next.flatMap(reservationsForVisit) };
    }

    const visit = action.visit;
    if (!visit.id || !visit.tenantId || !visit.therapistId)
      return { ok: false, error: "Visit identity and scope required" };
    const existing = visits.find(v => v.id === visit.id);
    if (action.type === "accept" && existing)
      return { ok: false, error: "Booking ID already exists; duplicate acceptance rejected" };
    if (action.type === "move" && !existing)
      return { ok: false, error: "Cannot move an unknown booking" };
    if (existing && (existing.tenantId !== visit.tenantId || existing.therapistId !== visit.therapistId))
      return { ok: false, error: "Cannot change visit ownership during move" };

    const candidate = reservationsForVisit(visit);
    const remaining = visits.filter(v => v.id !== visit.id);
    for (const other of remaining) {
      if (other.tenantId !== visit.tenantId || other.therapistId !== visit.therapistId) continue;
      const blocked = reservationsForVisit(other);
      for (const proposed of candidate) for (const occupied of blocked) {
        if (overlapsBusyBlock(proposed, occupied)) {
          return { ok: false, error: "Travel, setup or service time conflicts with an existing visit", conflictingVisitId: other.id };
        }
      }
    }
    const next = [...remaining, visit].sort((a, b) => millis(a.startIso) - millis(b.startIso));
    return { ok: true, visits: next, reservations: next.flatMap(reservationsForVisit) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid scheduling input" };
  }
}
