"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ADDISON_PAYMENT_OPTIONS,
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
  const [duration, setDuration] = useState<60 | 90 | 120>(60);
  const [dateTime, setDateTime] = useState("");
  const [client, setClient] = useState("");
  const [bettyReply, setBettyReply] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState<AddisonRequestStatus | null>(null);
  const [approvedTime, setApprovedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const date = dateTime ? new Date(dateTime) : null;
  const validDate = !!date && !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
  const quote = validDate ? quoteAddison({ appointmentIso: date!.toISOString(), durationMinutes: duration, location }) : null;

  function request() {
    if (!validDate || !client.trim()) return;
    setStatus(location === "massage_room" ? "pending_betty" : "awaiting_payment");
    setBettyReply("");
    setDetail("");
    setPaymentMethod("");
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
            {([["massage_room", "Addison massage room"], ["apartment", "Resident apartment"]] as const).map(([value, label]) => (
              <button key={value} className={`rounded border px-3 py-2 ${location === value ? "border-primary font-semibold" : ""}`}
                onClick={() => {setLocation(value); setStatus(null);}}>{label}</button>
            ))}
          </div>
        </div>
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
              <p className="text-xs text-muted-foreground">Proposed service price, before optional tip/fees. Final price is shown before payment.</p></>
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
              <div className="flex flex-wrap gap-2">
                {ADDISON_PAYMENT_OPTIONS.map((method) => (
                  <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                    className={`rounded border px-3 py-2 ${paymentMethod === method.id ? "border-primary font-semibold" : ""}`}>
                    {method.label}
                  </button>
                ))}
              </div>
              {paymentMethod && <p className="rounded bg-muted p-3 text-sm">
                {paymentMethod === "square"
                  ? "Square Checkout integration requires server-side pricing, verified payment webhooks, and configured credentials."
                  : paymentMethod === "crypto"
                  ? "Crypto requires a configured receiving wallet, locked quote, chain verification, and receipts."
                  : "Business payment instructions and manual verification are required before confirming payment."}
              </p>}
              <p className="text-sm text-muted-foreground">
                The real app must verify payment and create the Google Calendar event before issuing a final confirmation.
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
