"use client";

import { useState } from "react";
import Link from "next/link";
import { AddisonPaymentChoices } from "@/components/addison/payment-choices";
import {
  addisonDepositBreakdown,
  classifyBettyReply,
  quoteAddison,
  type AddisonLocation,
  type AddisonRequestStatus,
} from "@/lib/addison/concierge";

const usd = (cents: number) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD",
}).format(cents / 100);

/**
 * Safe, local-only workflow demonstration.
 * Not connected to real clients, Betty SMS, payments or Google Calendar.
 */
export default function AddisonConciergePage() {
  const [location, setLocation] = useState<AddisonLocation>("massage_room");
  const [checkApartmentSpace, setCheckApartmentSpace] = useState(false);
  const [clearLengthFt, setClearLengthFt] = useState("12");
  const [clearWidthFt, setClearWidthFt] = useState("9");
  const [duration, setDuration] = useState<60 | 90 | 120>(60);
  const [dateTime, setDateTime] = useState("");
  const [client, setClient] = useState("");
  const [bettyReply, setBettyReply] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState<AddisonRequestStatus | null>(null);
  const [approvedTime, setApprovedTime] = useState("");
  const date = dateTime ? new Date(dateTime) : null;
  const validDate = !!date && !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
  const quote = validDate ? quoteAddison({ appointmentIso: date!.toISOString(), durationMinutes: duration, location }) : null;
  const deposit = quote ? addisonDepositBreakdown(quote.totalCents) : null;
  // Optional guidance only: 73 × 30 inch table and 30 inches of working clearance on each side.
  const lengthIn = Number(clearLengthFt) * 12;
  const widthIn = Number(clearWidthFt) * 12;
  const validSpace = clearLengthFt.trim() !== "" && clearWidthFt.trim() !== "" &&
    Number.isFinite(lengthIn) && Number.isFinite(widthIn) && lengthIn > 0 && widthIn > 0;
  const spaceFits = validSpace && ((lengthIn >= 133 && widthIn >= 90) || (widthIn >= 133 && lengthIn >= 90));

  function request() {
    if (!validDate || !client.trim()) return;
    setStatus(location === "massage_room" ? "pending_betty" : "awaiting_payment");
    setBettyReply("");
    setDetail("");
    setApprovedTime(dateTime);
  }

  function handleBettyReply() {
    if (status !== "pending_betty" && status !== "needs_clarification") return;
    const result = classifyBettyReply(bettyReply);
    if (result.kind === "approved") {
      setStatus("awaiting_payment");
      setDetail("Betty approved the requested room time.");
    } else if (result.kind === "declined") {
      setStatus("declined");
      setDetail("Room unavailable. Offer a new time and request approval again.");
    } else {
      setStatus("needs_clarification");
      setDetail(result.detail);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-5 py-12">
      <Link href="/" className="text-sm underline">Home</Link>
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Anam Beo · Addison</p>
        <h1 className="font-serif text-3xl">Massage Concierge</h1>
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm space-y-1" aria-label="Massage therapist credentials">
          <p className="font-semibold">Florida Licensed Massage Therapist</p>
          <p>License MA-28774 <span aria-hidden="true">·</span> Insured since 1999</p>
        </div>
        <p className="text-muted-foreground">
          Preview the resident booking process. Massage room requests require Betty's approval.
          No booking, text, payment, or calendar invitation is sent from this demonstration.
        </p>
      </header>
      <div className="rounded-lg border p-5 space-y-4">
        <h2 className="text-xl font-medium">1. Client request</h2>
        <label className="block space-y-1">
          <span className="text-sm">Client name (demo only)</span>
          <input className="w-full rounded border bg-background p-3" value={client}
            onChange={(e) => setClient(e.target.value)} placeholder="Example client" />
        </label>
        <div className="space-y-2">
          <p className="text-sm">Massage location</p>
          <div className="flex flex-wrap gap-2">
            {([["massage_room", "Addison Resident Massage Room"], ["apartment", "Resident apartment"]] as const).map(([value, label]) => (
              <button key={value} className={`rounded border px-3 py-2 ${location === value ? "border-primary font-semibold" : ""}`}
                onClick={() => {setLocation(value); setStatus(null);}}>{label}</button>
            ))}
          </div>
        </div>
        {location === "apartment" && (
          <section className="space-y-3 rounded-lg border bg-muted/30 p-4" aria-label="Optional apartment space check">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={checkApartmentSpace}
                onChange={(event) => setCheckApartmentSpace(event.target.checked)}
                aria-controls="apartment-space-check"
              />
              <span>
                <span className="block text-sm font-semibold">Check if there's enough room for the massage table (optional)</span>
                <span className="block text-sm text-muted-foreground">
                  Already had an in-apartment massage? You can skip this check.
                </span>
              </span>
            </label>
            {checkApartmentSpace && (
              <div id="apartment-space-check" className="space-y-3 border-t pt-3">
                <p className="text-sm text-muted-foreground">
                  Measure the usable floor area without furniture or other obstacles.
                  Enter your approximate clear space:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1 text-sm">
                    <span className="block">Clear length (feet)</span>
                    <input type="number" min="1" max="100" step="0.5" value={clearLengthFt}
                      onChange={event => setClearLengthFt(event.target.value)}
                      className="w-full rounded border bg-background p-3" />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="block">Clear width (feet)</span>
                    <input type="number" min="1" max="100" step="0.5" value={clearWidthFt}
                      onChange={event => setClearWidthFt(event.target.value)}
                      className="w-full rounded border bg-background p-3" />
                  </label>
                </div>
                {validSpace ? (
                  <p aria-live="polite" className="rounded bg-muted p-3 text-sm">
                    {spaceFits
                      ? "Based on these measurements, the table and working clearance should fit."
                      : "This may not leave enough working room. Please ask your therapist before booking."}
                  </p>
                ) : <p role="alert" className="text-sm">Enter positive measurements for both sides.</p>}
                <p className="text-xs text-muted-foreground">
                  Estimated minimum: 11.1 × 7.5 ft of unobstructed space, including working clearance.
                  This is a guide, not a safety guarantee; your therapist makes the final decision.
                </p>
                <Link href="/addison/space-check" className="inline-block text-sm font-medium text-primary underline">
                  Open detailed space check (optional photo and table dimensions) →
                </Link>
              </div>
            )}
          </section>
        )}
        <label className="block space-y-1">
          <span className="text-sm">Date and time (Addison local time)</span>
          <input type="datetime-local" className="w-full rounded border bg-background p-3" value={dateTime}
            onChange={(e) => {setDateTime(e.target.value); setStatus(null);}} />
        </label>
        <div className="space-y-2">
          <p className="text-sm">Duration</p>
          <div className="flex gap-2">
            {([60, 90, 120] as const).map((minutes) => (
              <button key={minutes} className={`rounded border px-4 py-2 ${duration === minutes ? "border-primary font-semibold" : ""}`}
                onClick={() => {setDuration(minutes); setStatus(null);}}>{minutes} min</button>
            ))}
          </div>
        </div>
        <div className="rounded bg-muted p-4">
          {quote ? (
            <><p className="text-sm">{quote.label} · {usd(quote.rateCents)}/hour</p>
              <p className="text-2xl font-semibold">{usd(quote.totalCents)}</p>
              <p className="text-xs text-muted-foreground">Proposed service price, before optional tip/fees. Final price is shown before payment.</p>
              {deposit && (
                <div className="mt-3 border-t pt-3 text-sm space-y-1">
                  <p>Booking deposit: <strong>{usd(deposit.depositCents)}</strong> (credited toward massage)</p>
                  <p>Remaining service balance: <strong>{usd(deposit.remainingCents)}</strong></p>
                  <p className="text-xs text-muted-foreground">
                    Cancel before the appointment date for a deposit refund.
                    Same-day cancellations forfeit the $25 deposit.
                  </p>
                </div>
              )}</>
          ) : <p className="text-sm">Choose a future date for the price preview.</p>}
        </div>
        <button disabled={!quote || !client.trim()} onClick={request}
          className="rounded bg-primary px-5 py-3 text-primary-foreground disabled:opacity-40">Simulate booking request</button>
      </div>

      {status && (
        <section className="rounded-lg border p-5 space-y-4">
          <h2 className="text-xl font-medium">2. Approval status</h2>
          <p className="font-semibold">{status.replaceAll("_", " ")}</p>
          {status === "pending_betty" || status === "needs_clarification" ? (
            <>
              <p className="text-sm text-muted-foreground">
                Betty's calendar remains authoritative. An SMS integration would request the room
                for {approvedTime}, {duration} minutes. Betty can reply normally.
              </p>
              <label className="block space-y-1">
                <span className="text-sm">Simulate Betty's reply</span>
                <textarea className="w-full rounded border bg-background p-3" value={bettyReply}
                  onChange={(e) => setBettyReply(e.target.value)} placeholder="Yes / No / Yes, but only until 3" />
              </label>
              <button onClick={handleBettyReply} className="rounded border px-4 py-2">Interpret reply</button>
            </>
          ) : null}
          {detail && <p className="rounded bg-muted p-3 text-sm">{detail}</p>}
          {status === "needs_clarification" && (
            <p className="text-sm">A human must verify restrictions or a changed time. The client is not confirmed.</p>
          )}
          {status === "declined" && <button onClick={() => setStatus(null)} className="rounded border px-4 py-2">Choose another time</button>}
          {status === "awaiting_payment" && (
            <div className="space-y-3">
              <p>Room approval is recorded in the demo; select a payment method to preview the next step.</p>
              {deposit && <AddisonPaymentChoices
                depositCents={deposit.depositCents}
                remainingCents={deposit.remainingCents}
              />}
              <p className="text-sm text-muted-foreground">
                Same-day cancellations forfeit the $25 deposit. The real app must verify payment
                and create the Google Calendar event before issuing a final confirmation.
              </p>
            </div>
          )}
        </section>
      )}
      <p className="text-xs text-muted-foreground">
        Prototype only. No customer data is persisted here. Actual SMS, payment verification,
        calendar sync, consent and legal review remain inactive.
      </p>
    </main>
  );
}
