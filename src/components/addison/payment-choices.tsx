"use client";

import { useState } from "react";
import { ADDISON_PAYMENT_OPTIONS } from "@/lib/addison/concierge";

type Method = (typeof ADDISON_PAYMENT_OPTIONS)[number]["id"];
const money = (cents: number) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" }).format(cents/100);

/** Payment-selection UI only. Never marks a payment paid or exposes unverifiable transfer links. */
export function AddisonPaymentChoices({ depositCents, remainingCents }: {
  depositCents: number;
  remainingCents: number;
}) {
  const [method,setMethod] = useState<Method>("square");
  const [accepted,setAccepted] = useState(false);

  const descriptions: Record<Method,string> = {
    square: "Pay securely by card through Square once the business account, Checkout integration, and verified payment webhook are configured.",
    zelle: "Pay by bank transfer using the business's confirmed Zelle details. The appointment remains awaiting payment until the owner verifies receipt.",
    venmo: "Pay through the confirmed Venmo business profile. The appointment remains awaiting payment until the owner verifies receipt.",
    crypto: "Pay to a dedicated business receiving wallet after an exact asset/network quote and expiry are provided. The transaction must be confirmed on-chain before payment is recorded.",
  };
  const nextSteps: Record<Method,string> = {
    square: "Square checkout is not yet connected. Do not enter card details here.",
    zelle: "Zelle business recipient details have not been configured. Do not send funds based on an unverified address.",
    venmo: "Venmo business profile has not been configured. No transfer link is currently active.",
    crypto: "No receiving wallet or exchange-rate quote is configured. Do not send cryptocurrency.",
  };

  return <section className="space-y-4 rounded-lg border p-4" aria-label="Payment method selection">
    <div className="space-y-1">
      <h3 className="font-serif text-xl">Choose your payment method</h3>
      <p className="text-sm text-muted-foreground">
        A {money(depositCents)} deposit will be credited toward your massage. The remaining
        { " "}{money(remainingCents)} is due separately.
      </p>
    </div>
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">Preferred way to pay the deposit</legend>
      {ADDISON_PAYMENT_OPTIONS.map(option => <label key={option.id}
        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${method===option.id?"border-primary bg-muted/40":""}`}>
        <input type="radio" name="addison-payment-method" value={option.id}
          checked={method===option.id} onChange={()=>setMethod(option.id)} className="mt-1" />
        <span className="space-y-1">
          <span className="block font-medium">{option.id==="square"?"Credit/debit card · Square":option.id==="crypto"?"Cryptocurrency":option.label}</span>
          <span className="block text-xs text-muted-foreground">{descriptions[option.id]}</span>
        </span>
      </label>)}
    </fieldset>
    <div className="rounded-lg bg-muted p-3 text-sm space-y-2">
      <p><strong>Deposit: {money(depositCents)}</strong> · Remaining balance: {money(remainingCents)}</p>
      <p>{nextSteps[method]}</p>
    </div>
    <label className="flex items-start gap-2 text-sm">
      <input type="checkbox" className="mt-1" checked={accepted} onChange={event=>setAccepted(event.target.checked)} />
      <span>I understand that the deposit is credited to my massage, and that cancellations on the appointment date forfeit the $25 deposit. Earlier cancellations are eligible for a deposit refund.</span>
    </label>
    <p className="text-xs text-muted-foreground">
      {accepted ? "Cancellation terms acknowledged in this preview only. " : "Please review the terms before payment. "}
      No payment is collected, tracked, or verified by this preview. A final reservation cannot be issued until payment and schedule approval are independently confirmed.
    </p>
  </section>;
}
