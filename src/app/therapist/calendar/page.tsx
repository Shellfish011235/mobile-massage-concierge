"use client";

import Link from "next/link";
import { TravelBookingSimulator } from "@/components/therapist/travel-booking-simulator";
import { useState } from "react";
import { travelArrivalBlock, privateBusyCalendarEvent } from "@/lib/booking/travel-buffers";

function localDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium", timeStyle: "short",
  }).format(new Date(iso));
}

export default function TherapistCalendarPage() {
  const [start, setStart] = useState("");
  const [travel, setTravel] = useState("30");
  const [setup, setSetup] = useState("15");
  const [navigation, setNavigation] = useState<"google" | "waze">("google");
  const [destination, setDestination] = useState("");
  const [showLink, setShowLink] = useState(false);

  let result: ReturnType<typeof privateBusyCalendarEvent> | null = null;
  let error = "";
  try {
    if (start) {
      const date = new Date(start);
      if (!Number.isFinite(date.getTime())) throw new Error("Choose a valid appointment start");
      const travelMinutes = Number(travel);
      const setupMinutes = Number(setup);
      const block = travelArrivalBlock({
        appointmentStartIso: date.toISOString(), travelMinutes, setupMinutes,
      });
      result = privateBusyCalendarEvent(block);
    }
  } catch (issue) {
    error = issue instanceof Error ? issue.message : "Invalid buffer";
  }

  // Navigation links are only opened by an explicit click. Destination is not
  // submitted to our server. Never use these URLs for clinical details.
  const navigationUrl = showLink && destination.trim()
    ? navigation === "waze"
      ? "https://waze.com/ul?q=" + encodeURIComponent(destination.trim()) + "&navigate=yes"
      : "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destination.trim())
    : null;

  return (
    <main className="space-y-6 px-gutter-x pb-6 pt-[max(3rem,env(safe-area-inset-top,0px))]">
      <div>
        <h1 className="font-serif text-2xl font-normal text-foreground">Calendar & travel</h1>
        <p className="mt-2 text-pom-sm text-muted-foreground">
          Protect travel and setup time between mobile massage appointments. This
          preview does not write to a calendar or check real traffic.
        </p>
      </div>
      <section className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h2 className="font-medium">Plan arrival time</h2>
        <label className="block space-y-1 text-sm">
          <span>Next appointment starts</span>
          <input type="datetime-local" className="w-full rounded border bg-background p-3"
            value={start} onChange={event => setStart(event.target.value)}/>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1 text-sm">
            <span>Estimated driving (min)</span>
            <input type="number" min="0" max="480" step="1" className="w-full rounded border bg-background p-3"
              value={travel} onChange={event => setTravel(event.target.value)}/>
          </label>
          <label className="block space-y-1 text-sm">
            <span>Parking / unloading / setup (min)</span>
            <input type="number" min="0" max="480" step="1" className="w-full rounded border bg-background p-3"
              value={setup} onChange={event => setSetup(event.target.value)}/>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter a conservative travel estimate. Allow time for traffic, parking,
          elevator access and setting up the massage table. Future provider-specific
          routing will calculate travel from the previous booking.
        </p>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {result && (
          <div aria-live="polite" className="space-y-2 rounded-lg bg-muted p-3 text-sm">
            <strong>Protected time window</strong>
            <p>{localDateTime(result.start.dateTime)} – {localDateTime(result.end.dateTime)}</p>
            <p>Would be marked <strong>Busy · Private</strong> in the connected calendar.</p>
            <p className="text-xs text-muted-foreground">
              Preview only: there is no saved calendar block and no automatic
              double-booking protection yet.
            </p>
          </div>
        )}
      </section>
      <section className="space-y-3 rounded-lg border border-border bg-card p-4">
        <h2 className="font-medium">Navigation preferences</h2>
        <fieldset className="flex flex-wrap gap-4 text-sm">
          <legend className="mb-2 text-sm text-muted-foreground">Open directions with</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="nav" checked={navigation === "google"}
              onChange={() => setNavigation("google")}/> Google Maps
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="nav" checked={navigation === "waze"}
              onChange={() => setNavigation("waze")}/> Waze
          </label>
        </fieldset>
        <label className="block space-y-1 text-sm">
          <span>Destination address (optional; stays in this browser until opened)</span>
          <input className="w-full rounded border bg-background p-3"
            placeholder="Enter appointment destination" autoComplete="off"
            value={destination} onChange={event => { setDestination(event.target.value); setShowLink(false); }}/>
        </label>
        <label className="flex items-start gap-2 text-xs">
          <input type="checkbox" className="mt-0.5" checked={showLink}
            onChange={event => setShowLink(event.target.checked)}/>
          <span>I understand the destination will be shared with {navigation === "waze" ? "Waze" : "Google Maps"} when I open directions.</span>
        </label>
        {navigationUrl && <a href={navigationUrl} rel="noopener noreferrer" target="_blank"
          className="inline-block rounded bg-primary px-4 py-2 text-sm text-primary-foreground">
          Open directions in {navigation === "waze" ? "Waze" : "Google Maps"}
        </a>}
        <p className="text-xs text-muted-foreground">
          Opening directions does not supply a travel estimate to this app.
          Automatic traffic-aware routing requires a separate authorized API,
          budget limits and privacy review.
        </p>
      </section>
      <TravelBookingSimulator />
      <Link href="/therapist" className="inline-block text-sm font-medium text-primary underline">
        Back to therapist home
      </Link>
    </main>
  );
}
