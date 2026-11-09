"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RAILS, evaluateBusinessCase, makeDemoReceipt, type BusinessCase, type PaymentRail,
} from "@/lib/poc/shellfish-business-demo";

const defaults: BusinessCase = {
  businessId:"DEMO-MASSAGE-STUDIO", providerId:"DEMO-THERAPIST",
  customerAlias:"Example Guest",service:"60-minute massage",mode:"mobile",
  durationMinutes:60,priceCents:12000,depositCents:2500,
  travelMinutes:30,setupMinutes:15,availabilityVerified:true,
  credentialsVerified:true,customerConsent:true,humanApproval:false,rail:"square",
};
const usd=(n:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n/100);
const presets=[
  {label:"Mobile massage",businessId:"DEMO-MASSAGE-STUDIO",service:"60-minute mobile massage",mode:"mobile" as const,priceCents:12000,travelMinutes:30},
  {label:"Wellness studio",businessId:"DEMO-WELLNESS-STUDIO",service:"90-minute wellness appointment",mode:"venue" as const,priceCents:15000,travelMinutes:null},
  {label:"On-site services",businessId:"DEMO-ON-SITE",service:"60-minute professional appointment",mode:"mobile" as const,priceCents:9500,travelMinutes:20},
];

export default function BusinessProofOfConcept() {
  const [input,setInput]=useState<BusinessCase>(defaults);
  const [receipt,setReceipt]=useState<ReturnType<typeof makeDemoReceipt> | null>(null);
  const [sequence,setSequence]=useState(1);
  const decision=evaluateBusinessCase(input);
  const change=<K extends keyof BusinessCase>(key:K,value:BusinessCase[K])=>{
    setInput(old=>({...old,[key]:value}));setReceipt(null);
  };
  const proof=()=>{
    setReceipt(makeDemoReceipt(input,decision,
      "DEMO-"+String(sequence).padStart(4,"0"),new Date().toISOString()));
    setSequence(old=>old+1);
  };
  return <main className="mx-auto max-w-4xl space-y-6 px-5 py-10">
    <Link href="/" className="text-sm text-primary underline">Home</Link>
    <header className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Shellfish Agent Control · Public-facing concept, protected staging</p>
      <h1 className="font-serif text-4xl">Business Automation Proof of Concept</h1>
      <p className="text-muted-foreground">
        Change a sample business, evaluate a booking, inspect payment rail choices,
        and produce an illustrative agent decision receipt. No real funds, customer
        records, private wallets, AI credentials or network messages are used.
      </p>
      <p className="rounded border border-amber-600/40 bg-amber-50 p-3 text-sm text-amber-950">
        INTERACTIVE SIMULATION ONLY — this is a deterministic policy demo, not a live AI agent,
        compliance certification, settled transaction, or verified cryptographic receipt.
      </p>
    </header>
    <section className="rounded-xl border p-5 space-y-4">
      <h2 className="font-serif text-2xl">1. Choose a business</h2>
      <div className="flex flex-wrap gap-2">
        {presets.map(p=><button key={p.businessId} type="button"
          className={`rounded-lg border px-3 py-2 text-sm ${input.businessId===p.businessId?"bg-primary text-primary-foreground":""}`}
          onClick={()=>{setInput(old=>({...old,...p,travelMinutes:p.travelMinutes,customerAlias:"Example Guest",humanApproval:false}));setReceipt(null);}}>
          {p.label}
        </button>)}
      </div>
      <p className="text-sm text-muted-foreground">Sample records only. Real businesses require their own verified accounts, licenses, jurisdictions and approval policies.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">Service<input value={input.service} onChange={e=>change("service",e.target.value)}
          className="block w-full rounded border bg-background p-3"/></label>
        <label className="space-y-1 text-sm">Service price (USD)<input type="number" min="1" step=".01" value={(input.priceCents/100).toFixed(2)}
          onChange={e=>change("priceCents",Math.round(Number(e.target.value)*100))}
          className="block w-full rounded border bg-background p-3"/></label>
        <label className="space-y-1 text-sm">Deposit (USD)<input type="number" min="0" step=".01" value={(input.depositCents/100).toFixed(2)}
          onChange={e=>change("depositCents",Math.round(Number(e.target.value)*100))}
          className="block w-full rounded border bg-background p-3"/></label>
        <label className="space-y-1 text-sm">Duration (minutes)<input type="number" min="15" max="240" step="15" value={input.durationMinutes}
          onChange={e=>change("durationMinutes",Number(e.target.value))}
          className="block w-full rounded border bg-background p-3"/></label>
        {input.mode==="mobile"&&<label className="space-y-1 text-sm">Travel buffer (minutes)<input type="number" min="0" max="480" step="1" value={input.travelMinutes??""}
          onChange={e=>change("travelMinutes",e.target.value===""?null:Number(e.target.value))}
          className="block w-full rounded border bg-background p-3"/></label>}
        <label className="space-y-1 text-sm">Setup buffer (minutes)<input type="number" min="0" max="480" step="1" value={input.setupMinutes}
          onChange={e=>change("setupMinutes",Number(e.target.value))}
          className="block w-full rounded border bg-background p-3"/></label>
      </div>
    </section>
    <section className="rounded-xl border p-5 space-y-3">
      <h2 className="font-serif text-2xl">2. Agent authority and checks</h2>
      {([
        ["credentialsVerified","Therapist credentials verified"],
        ["availabilityVerified","Calendar and availability verified"],
        ["customerConsent","Client agreed to price and terms"],
        ["humanApproval","Human operator approved proposal"],
      ] as const).map(([k,label])=><label className="flex items-center gap-3 text-sm" key={k}>
        <input type="checkbox" checked={input[k]} onChange={e=>change(k,e.target.checked)}/>{label}
      </label>)}
      <div role="status" className="rounded-lg bg-muted p-4 space-y-2">
        <strong>{decision.status==="blocked"?"BLOCKED":decision.status==="needs_human"?"HUMAN APPROVAL REQUIRED":"ELIGIBLE FOR REVIEW ONLY"}</strong>
        <p className="text-sm">{decision.reason}</p>
        <p className="text-xs">Actual execution permission: <strong>DENIED</strong> in this POC.</p>
      </div>
    </section>
    <section className="rounded-xl border p-5 space-y-4">
      <h2 className="font-serif text-2xl">3. Payment and messaging rails</h2>
      <p className="text-sm text-muted-foreground">Payment methods shown for architecture comparison, all disabled for real execution.</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {(Object.keys(RAILS) as PaymentRail[]).map(rail=><button key={rail} type="button"
          onClick={()=>change("rail",rail)} aria-pressed={input.rail===rail}
          className={`space-y-1 rounded-lg border p-3 text-left ${input.rail===rail?"border-primary bg-muted":""}`}>
          <strong className="text-sm">{RAILS[rail].label}</strong>
          <p className="text-xs text-muted-foreground">{RAILS[rail].detail}</p>
        </button>)}
      </div>
      <p className="text-sm">Price: <strong>{Number.isFinite(input.priceCents)?usd(input.priceCents):"Invalid"}</strong> · Deposit: <strong>{Number.isFinite(input.depositCents)?usd(input.depositCents):"Invalid"}</strong></p>
      <p className="text-xs text-muted-foreground">
        XRP channels are distinct from issued-currency RLUSD payments. Dassie is a prospective
        optional communication adapter, not proof of settlement. No payment transaction is signed or submitted.
      </p>
    </section>
    <section className="rounded-xl border p-5 space-y-4">
      <h2 className="font-serif text-2xl">4. Illustrative decision receipt</h2>
      <button type="button" onClick={proof} className="rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground">
        Generate simulated receipt
      </button>
      {receipt&&<>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-muted p-3 text-xs">{JSON.stringify(receipt,null,2)}</pre>
        <button type="button" className="rounded border px-3 py-2 text-sm"
          onClick={()=>navigator.clipboard?.writeText(JSON.stringify(receipt,null,2))}>Copy receipt JSON</button>
      </>}
      <p className="text-xs text-muted-foreground">
        Real receipts require signed authority, durable replay protection, server-side evidence, settlement verification,
        and the proven Shellfish engine. This example provides none of those guarantees.
      </p>
    </section>
    <footer className="text-xs text-muted-foreground">
      Demo intentionally isolated from the Addison booking backend. Betty approval applies only to The Addison shared massage room.
      Medical intake and SOAP notes remain with independently selected external vendors.
    </footer>
  </main>;
}
