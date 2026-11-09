"use client";

import { useState } from "react";
import type { AddisonLocation } from "@/lib/addison/concierge";

/**
 * Local-only booking convenience and visit-preparation UI.
 * No server storage, waitlist enrollment, message, review or safety guarantee.
 */
export function AddisonBookingExtras({ location }: { location: AddisonLocation }) {
  const [waitlist, setWaitlist] = useState(false);
  const [preferredWindow, setPreferredWindow] = useState("flexible");
  const [repeatVisit, setRepeatVisit] = useState(false);
  const [prepOpen, setPrepOpen] = useState(false);
  const [arrival, setArrival] = useState(false);
  const [pets, setPets] = useState(false);
  const [clearSpace, setClearSpace] = useState(false);
  return (
    <section className="space-y-4 rounded-lg border p-4" aria-label="Booking convenience and visit preparation">
      <h3 className="font-serif text-xl">Booking preferences</h3>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1" checked={repeatVisit}
          onChange={event => setRepeatVisit(event.target.checked)} />
        <span><strong>Returning client</strong><span className="block text-muted-foreground">
          A repeat booking can use your established visit setup; no new profile or treatment details are requested here.
        </span></span>
      </label>
      <div className="space-y-2 border-t pt-3">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1" checked={waitlist}
            onChange={event => setWaitlist(event.target.checked)} />
          <span><strong>Interested in another opening if my preferred time is unavailable</strong>
            <span className="block text-muted-foreground">Optional cancellation waitlist preference.</span>
          </span>
        </label>
        {waitlist && <div className="space-y-1 pl-6 text-sm">
          <label htmlFor="addison-window" className="block">Preferred alternative time</label>
          <select id="addison-window" value={preferredWindow}
            onChange={event => setPreferredWindow(event.target.value)}
            className="w-full rounded border bg-background p-3">
            <option value="flexible">Flexible — any available opening</option>
            <option value="weekday-day">Weekdays before 5 PM</option>
            <option value="evenings">Weekday evenings</option>
            <option value="weekends">Weekends</option>
          </select>
          <p className="text-xs text-muted-foreground">Preview only. This preference is not saved or sent. A production waitlist will require confirmed contact permission and availability checks.</p>
        </div>}
      </div>
      {location === "apartment" && <div className="space-y-3 border-t pt-3">
        <button type="button" className="text-left text-sm font-semibold underline"
          aria-expanded={prepOpen} aria-controls="addison-visit-prep"
          onClick={() => setPrepOpen(value => !value)}>
          {prepOpen ? "Hide" : "Show"} optional in-apartment arrival checklist
        </button>
        {prepOpen && <div id="addison-visit-prep" className="space-y-3 text-sm">
          <p className="text-muted-foreground">A few things that help your therapist arrive and work safely. No medical or treatment information is requested.</p>
          <label className="flex items-start gap-2"><input type="checkbox" checked={arrival} onChange={event => setArrival(event.target.checked)} className="mt-1" />Access, parking, entrance and building instructions can be confirmed with the therapist.</label>
          <label className="flex items-start gap-2"><input type="checkbox" checked={pets} onChange={event => setPets(event.target.checked)} className="mt-1" />Any pets or other people at the location will be disclosed before arrival, and pets can be secured.</label>
          <label className="flex items-start gap-2"><input type="checkbox" checked={clearSpace} onChange={event => setClearSpace(event.target.checked)} className="mt-1" />A clear and safe setup area will be ready before arrival.</label>
          <p className="text-xs text-muted-foreground">These are optional preparation prompts, not verification. The therapist can decline or leave an unsafe environment. Nothing is saved or transmitted in this demo.</p>
        </div>}
      </div>}
    </section>
  );
}
