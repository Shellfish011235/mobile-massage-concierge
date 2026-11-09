"use client";

import { useState } from "react";
import Link from "next/link";
import { Flower2, ShieldCheck } from "lucide-react";
import { AddisonPaymentChoices } from "@/components/addison/payment-choices";
import { AddisonBookingExtras } from "@/components/addison/booking-extras";
import { ADDISON_VENUE_ID, ADDISON_ROOM_RESOURCE_ID, chooseBookingApprovalRoute } from "@/lib/booking/approval-routing";
import {
  bettyRoomRequestMessage,
  clientDeclinedMessage,
  clientRequestReceivedMessage,
  chooseNotificationChannel,
  type AddisonNotificationChannel,
} from "@/lib/addison/notifications";
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
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notificationChannel, setNotificationChannel] = useState<AddisonNotificationChannel>("email");
  const [smsConsent, setSmsConsent] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [bettyReply, setBettyReply] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState<AddisonRequestStatus | null>(null);
  const [approvedTime, setApprovedTime] = useState("");
  const date = dateTime ? new Date(dateTime) : null;
  const validDate = !!date && !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
  const quote = validDate ? quoteAddison({ appointmentIso: date!.toISOString(), durationMinutes: duration, location }) : null;
  const deposit = quote ? addisonDepositBreakdown(quote.totalCents) : null;
  const canContact = notificationChannel === "email"
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())
    : smsConsent && /^\+?1?\d{10}$/.test(clientPhone.replace(/[\s().-]/g, ""));
  const readyToPreview = !!quote && !!client.trim() && canContact && policyAccepted;
  const demoBooking = quote && validDate ? {
    reference: "DEMO-ONLY", appointmentIso: date!.toISOString(), durationMinutes: duration,
    location, totalCents: quote.totalCents, clientFirstName: client.trim().split(" ")[0] || "Client",
  } : null;
  const demoChannel = demoBooking && canContact ? chooseNotificationChannel({
    email: clientEmail.trim(), phone: clientPhone.trim(), smsConsent, preference: notificationChannel,
  }) : null;
  // Optional guidance only: 73 × 30 inch table and 30 inches of working clearance on each side.
  const lengthIn = Number(clearLengthFt) * 12;
  const widthIn = Number(clearWidthFt) * 12;
  const validSpace = clearLengthFt.trim() !== "" && clearWidthFt.trim() !== "" &&
    Number.isFinite(lengthIn) && Number.isFinite(widthIn) && lengthIn > 0 && widthIn > 0;
  const spaceFits = validSpace && ((lengthIn >= 133 && widthIn >= 90) || (widthIn >= 133 && lengthIn >= 90));

  function request() {
    if (!readyToPreview) return;
    const route = chooseBookingApprovalRoute({
      venueId: ADDISON_VENUE_ID,
      resourceId: location === "massage_room" ? ADDISON_ROOM_RESOURCE_ID : null,
    });
    setStatus(route === "addison_betty_room_approval" ? "pending_betty" : "awaiting_payment");
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
    <main className="addison-shell space-y-7">
      <Link href="/" className="addison-home underline underline-offset-4">← Home</Link>
      <header>
        <div className="addison-brand">
          <div className="addison-brand-inner">
            <div className="addison-insignia" aria-hidden="true"><Flower2 size={25} strokeWidth={1.6}/></div>
            <p className="addison-overline">ANAM BEO · THE ADDISON</p>
            <h1 className="addison-heading">Massage Concierge</h1>
            <p className="addison-credential">Florida Licensed Massage Therapist</p>
            <p className="addison-credential-small">License MA-28774</p>
            <p className="addison-insured"><ShieldCheck size={16} strokeWidth={1.6}/><span>Insured since 1999</span></p>
          </div>
        </div>
        <p className="addison-intro">
          Private resident massage appointments at The Addison condominium on A1A in Boca Raton,
          provided by Anam Beo Bodywork. Shared massage room requests require Betty’s approval;
          private apartment visits are coordinated directly with your therapist.
        </p>
        <p className="addison-intro addison-status">
          Booking preview only — no text messages, payments, or calendar invitations are sent.
        </p>
      </header>
      <div className="addison-panel space-y-4">
        <h2 className="text-xl font-medium">1. Client request</h2>
        <label className="block space-y-1">
          <span className="text-sm">Client name (demo only)</span>
          <input className="w-full rounded border bg-background p-3" value={client}
            onChange={(e) => setClient(e.target.value)} placeholder="Example client" />
        </label>
        <section className="space-y-3 rounded-lg border p-4" aria-label="Client confirmation preferences">
          <h3 className="text-sm font-semibold">Where should we send your booking updates?</h3>
          <p className="text-xs text-muted-foreground">Choose email or text. We only send a final confirmation once your booking is approved and the $25 deposit is verified.</p>
          <div className="flex gap-5 text-sm">
            <label className="flex items-center gap-2"><input type="radio" name="notification-channel" checked={notificationChannel === "email"} onChange={() => setNotificationChannel("email")} />Email</label>
            <label className="flex items-center gap-2"><input type="radio" name="notification-channel" checked={notificationChannel === "sms"} onChange={() => setNotificationChannel("sms")} />Text message</label>
          </div>
          {notificationChannel === "email" ? (
            <label className="block space-y-1 text-sm"><span>Client email address</span>
              <input type="email" autoComplete="email" className="w-full rounded border bg-background p-3" value={clientEmail}
                onChange={event => setClientEmail(event.target.value)} placeholder="client@example.com" />
            </label>
          ) : (
            <>
              <label className="block space-y-1 text-sm"><span>Client mobile number</span>
                <input type="tel" autoComplete="tel" className="w-full rounded border bg-background p-3" value={clientPhone}
                  onChange={event => setClientPhone(event.target.value)} placeholder="(555) 555-1234" />
              </label>
              <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1"
                checked={smsConsent} onChange={event => setSmsConsent(event.target.checked)} />
                <span>I agree to receive appointment-related text messages from Anam Beo Bodywork. Message/data rates may apply; reply STOP to opt out. Consent is not required to purchase; email is available instead.</span>
              </label>
            </>
          )}
        </section>
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
        <AddisonBookingExtras location={location} />
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={policyAccepted} onChange={event => setPolicyAccepted(event.target.checked)} className="mt-1" />
          <span>I understand the $25 deposit is credited toward the service total; cancellations before the appointment date are eligible for a refund, and cancellations on the appointment date forfeit the deposit, subject to the written policy and law. The remaining balance is paid after service, with an optional tip.</span>
        </label>
        <button disabled={!readyToPreview} onClick={request}
          className="rounded bg-primary px-5 py-3 text-primary-foreground disabled:opacity-40">Preview booking request (no messages sent)</button>
      </div>

      {status && (
        <section className="addison-panel space-y-4">
          <h2 className="text-xl font-medium">2. Approval status</h2>
          <p className="font-semibold">{status.replaceAll("_", " ")}</p>
          {demoBooking && (
            <div className="rounded bg-muted p-3 text-sm space-y-2" aria-live="polite">
              <p><strong>Client update via {demoChannel} (preview only):</strong> {clientRequestReceivedMessage(demoBooking)}</p>
              {status === "declined" && <p><strong>Not available:</strong> {clientDeclinedMessage(demoBooking)}</p>}
              {status === "awaiting_payment" && (
                <p><strong>Next step:</strong> The client would receive a secure Square deposit link only after availability is approved. After verified payment and calendar creation, they would receive a confirmed booking with the balance, optional tip and cancellation terms.</p>
              )}
            </div>
          )}
          {status === "pending_betty" || status === "needs_clarification" ? (
            <>
              <p className="text-sm text-muted-foreground">
                Betty's calendar remains authoritative. The production workflow will text her first,
                wait for an authenticated YES or NO reply associated with this booking, and notify Michele.
                No automatic approval is inferred from silence or conditional replies.
              </p>
              {demoBooking && <p className="rounded bg-muted p-3 text-sm"><strong>Text to Betty (preview only):</strong> {bettyRoomRequestMessage(demoBooking)}</p>}
              <label className="block space-y-1">
                <span className="text-sm">Try a sample Betty reply (demo only)</span>
                <textarea className="w-full rounded border bg-background p-3" value={bettyReply}
                  onChange={(e) => setBettyReply(e.target.value)} placeholder="Yes / No / Yes, but only until 3" />
              </label>
              <button onClick={handleBettyReply} className="rounded border px-4 py-2">Preview response handling</button>
            </>
          ) : null}
          {detail && <p className="rounded bg-muted p-3 text-sm">{detail}</p>}
          {status === "needs_clarification" && (
            <p className="text-sm">A human must verify restrictions or a changed time. The client is not confirmed.</p>
          )}
          {status === "declined" && <button onClick={() => setStatus(null)} className="rounded border px-4 py-2">Choose another time</button>}
          {status === "awaiting_payment" && (
            <div className="space-y-3">
              <p>Availability is approved in this simulation only. A real client will receive a secure $25 deposit request after Betty approves; the appointment is not confirmed until payment is verified and the calendar event is created.</p>
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
      <p className="addison-intro text-xs">
        Prototype only. No customer data is persisted here. Actual SMS, payment verification,
        calendar sync, consent and legal review remain inactive.
      </p>
    </main>
  );
}
