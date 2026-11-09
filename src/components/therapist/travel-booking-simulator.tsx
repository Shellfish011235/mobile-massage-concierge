"use client";

import { useState } from "react";
import {
  reconcileMobileVisit, reservationsForVisit, type MobileVisit,
} from "@/lib/booking/travel-schedule";

const SCOPE = { tenantId: "LOCAL-PREVIEW", therapistId: "PREVIEW-THERAPIST" } as const;
const stamp = (date: string): string => {
  const t = new Date(date);
  if (!Number.isFinite(t.getTime())) throw new Error("Enter a valid date and time");
  return t.toISOString();
};

function fmt(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export function TravelBookingSimulator() {
  const [visits, setVisits] = useState<MobileVisit[]>([]);
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [travelBefore, setTravelBefore] = useState("30");
  const [setup, setSetup] = useState("15");
  const [teardown, setTeardown] = useState("15");
  const [travelAfter, setTravelAfter] = useState("30");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<string>("new");

  function run(type: "accept" | "move") {
    try {
      const startIso = stamp(time);
      const endIso = new Date(new Date(startIso).getTime() + Number(duration) * 60_000).toISOString();
      if (!Number.isInteger(Number(duration)) || Number(duration) < 15 || Number(duration) > 480)
        throw new Error("Session duration must be 15–480 minutes");
      const visit: MobileVisit = {
        ...SCOPE,
        id: type === "move" ? selected : "PREVIEW-" + (visits.length + 1),
        startIso, endIso,
        travelBeforeMinutes: Number(travelBefore), setupMinutes: Number(setup),
        teardownMinutes: Number(teardown), travelAfterMinutes: Number(travelAfter),
      };
      const result = reconcileMobileVisit(visits, { type, visit });
      if (!result.ok) { setMessage("Not added: " + result.error); return; }
      setVisits(result.visits);
      setSelected("new");
      setMessage(type === "move"
        ? "Moved in this browser preview. Travel blocks recalculated."
        : "Added in this browser preview. Travel blocks reserved locally.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid input");
    }
  }

  function cancel(visitId: string) {
    const result = reconcileMobileVisit(visits, { type: "cancel", visitId, ...SCOPE });
    if (!result.ok) { setMessage(result.error); return; }
    setVisits(result.visits);
    setSelected("new");
    setMessage("Preview booking cancelled. Its local travel blocks were removed.");
  }

  const selectedVisit = visits.find(v => v.id === selected);
  const inputs = [
    { name: "Massage duration", value: duration, set: setDuration },
    { name: "Travel before", value: travelBefore, set: setTravelBefore },
    { name: "Parking / setup", value: setup, set: setSetup },
    { name: "Teardown", value: teardown, set: setTeardown },
    { name: "Travel after", value: travelAfter, set: setTravelAfter },
  ];
  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-4" aria-label="Local booking and travel simulation">
      <h2 className="font-medium">Test booking and travel conflicts</h2>
      <p className="text-xs text-muted-foreground">
        Demo data only. No customers, Google Calendar events, messages or payments are created.
        This checks the combined service, arrival and departure time windows.
      </p>
      <label className="block space-y-1 text-sm">
        <span>Action</span>
        <select value={selected} className="w-full rounded border bg-background p-2"
          onChange={event => {
            const id = event.target.value;
            setSelected(id);
            const visit = visits.find(v => v.id === id);
            if (visit) {
              // The move form uses this visit's current parameters.
              const date = new Date(visit.startIso);
              const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
              setTime(shifted.toISOString().slice(0, 16));
              setDuration(String((new Date(visit.endIso).getTime() - date.getTime()) / 60000));
              setTravelBefore(String(visit.travelBeforeMinutes));
              setSetup(String(visit.setupMinutes));
              setTeardown(String(visit.teardownMinutes));
              setTravelAfter(String(visit.travelAfterMinutes));
            }
          }}>
          <option value="new">Accept a new preview booking</option>
          {visits.map(v => <option key={v.id} value={v.id}>Move {v.id}</option>)}
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span>Appointment start (your device's time zone)</span>
        <input type="datetime-local" value={time} onChange={e => setTime(e.target.value)}
          className="w-full rounded border bg-background p-2"/>
      </label>
      <div className="grid grid-cols-2 gap-2">
        {inputs.map(field => (
          <label key={field.name} className="space-y-1 text-xs">
            <span>{field.name} (minutes)</span>
            <input type="number" min="0" max="480" step="1" value={field.value}
              onChange={e => field.set(e.target.value)}
              className="w-full rounded border bg-background p-2"/>
          </label>
        ))}
      </div>
      <button type="button" onClick={() => run(selectedVisit ? "move" : "accept")}
        className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground">
        {selectedVisit ? "Move preview booking" : "Accept preview booking"}
      </button>
      {message && <p role="status" className="rounded bg-muted p-2 text-sm">{message}</p>}
      <div className="space-y-3">
        <h3 className="font-medium">Local schedule · {visits.length} bookings</h3>
        {visits.length === 0 && <p className="text-xs text-muted-foreground">Add a future sample booking to see its reserved travel blocks.</p>}
        {visits.map(visit => (
          <div key={visit.id} className="space-y-1 rounded border p-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <strong>{visit.id} · {fmt(visit.startIso)}</strong>
              <button type="button" onClick={() => cancel(visit.id)} className="text-primary underline">Cancel demo</button>
            </div>
            {reservationsForVisit(visit).map(block => (
              <p key={block.id} className="text-muted-foreground">
                {block.kind === "appointment" ? "Massage" : block.id.endsWith("arrival") ? "Travel / setup" : "Teardown / travel"}:
                {" "}{fmt(block.startIso)} – {fmt(block.endIso)}
              </p>
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        This preview has no storage or server-side lock. Production bookings must recheck conflicts
        under a database transaction, authenticate therapist ownership, and reconcile private
        calendar events idempotently. Unknown driving time cannot be treated as zero.
      </p>
    </section>
  );
}
