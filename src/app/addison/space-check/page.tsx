"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_TABLE_LENGTH_IN = 73;
const DEFAULT_TABLE_WIDTH_IN = 30;
const DEFAULT_CLEARANCE_IN = 30;

export function roomFit(input: {
  openLengthIn: number;
  openWidthIn: number;
  tableLengthIn: number;
  tableWidthIn: number;
  clearanceIn: number;
}) {
  const requiredLengthIn = input.tableLengthIn + 2 * input.clearanceIn;
  const requiredWidthIn = input.tableWidthIn + 2 * input.clearanceIn;
  const fitsNormal = input.openLengthIn >= requiredLengthIn && input.openWidthIn >= requiredWidthIn;
  const fitsRotated = input.openWidthIn >= requiredLengthIn && input.openLengthIn >= requiredWidthIn;
  return { fits: fitsNormal || fitsRotated, rotated: !fitsNormal && fitsRotated, requiredLengthIn, requiredWidthIn };
}

export default function AddisonSpaceCheck() {
  const [lengthFt,setLengthFt] = useState("12");
  const [widthFt,setWidthFt] = useState("9");
  const [tableLength,setTableLength] = useState(String(DEFAULT_TABLE_LENGTH_IN));
  const [tableWidth,setTableWidth] = useState(String(DEFAULT_TABLE_WIDTH_IN));
  const [clearance,setClearance] = useState(String(DEFAULT_CLEARANCE_IN));
  const [photo,setPhoto] = useState<string | null>(null);
  const [consent,setConsent] = useState(false);
  useEffect(() => () => { if(photo) URL.revokeObjectURL(photo); },[photo]);

  const numeric = [lengthFt,widthFt,tableLength,tableWidth,clearance].map(Number);
  const valid = numeric.every(Number.isFinite) && numeric.every(n=>n>0) && numeric[4]<=60;
  const fit = useMemo(() => valid ? roomFit({
    openLengthIn:numeric[0]*12,openWidthIn:numeric[1]*12,
    tableLengthIn:numeric[2],tableWidthIn:numeric[3],clearanceIn:numeric[4],
  }) : null,[lengthFt,widthFt,tableLength,tableWidth,clearance,valid]);

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-5 py-12">
      <Link className="text-sm underline" href="/addison">← Back to Addison Massage Concierge</Link>
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Anam Beo · The Addison</p>
        <h1 className="font-serif text-3xl">In-Apartment Space Check</h1>
        <p className="text-muted-foreground">
          Make sure there is room for the massage table and a therapist to work safely around it.
          Check the usable, unobstructed floor area — not the full room size.
        </p>
      </header>
      <section className="rounded-lg border p-5 space-y-4">
        <h2 className="text-xl font-medium">1. Show us your planned space</h2>
        <p className="text-sm text-muted-foreground">
          Optional photo preview stays on this device. It is not uploaded, saved, or analyzed.
          Keep faces, documents, valuables and other private information out of the frame.
        </p>
        <label className="block space-y-2 text-sm">
          <span>Take or choose a photo (optional)</span>
          <input aria-label="Choose an apartment area photo" type="file" accept="image/*" capture="environment"
            className="block w-full text-sm" onChange={e=>{
              const file=e.target.files?.[0];
              if(photo) URL.revokeObjectURL(photo);
              setPhoto(file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
            }} />
        </label>
        {photo && <div className="space-y-2"><img src={photo} alt="Your selected room preview" className="max-h-64 w-full rounded object-contain" />
          <button className="text-sm underline" onClick={()=>setPhoto(null)}>Remove photo preview</button></div>}
        <div className="rounded bg-muted p-3 text-sm">
          Future upgrade: guided multi-angle scanning, LiDAR measurements on supported devices,
          and optional Gaussian-splat 3D visualization. A photo by itself cannot confirm measured clearance.
        </div>
      </section>
      <section className="rounded-lg border p-5 space-y-4">
        <h2 className="text-xl font-medium">2. Measure usable floor space</h2>
        <p className="text-sm text-muted-foreground">
          Measure a clear rectangle after allowing for couches, rugs, doors, walkways, and other obstacles.
          The table and working clearance must fit entirely inside it.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1 text-sm">Clear length (feet)
            <input type="number" min="1" max="100" step="0.5" value={lengthFt} onChange={e=>setLengthFt(e.target.value)} className="w-full rounded border bg-background p-3" />
          </label>
          <label className="space-y-1 text-sm">Clear width (feet)
            <input type="number" min="1" max="100" step="0.5" value={widthFt} onChange={e=>setWidthFt(e.target.value)} className="w-full rounded border bg-background p-3" />
          </label>
          <label className="space-y-1 text-sm">Table length (inches)
            <input type="number" min="1" max="120" value={tableLength} onChange={e=>setTableLength(e.target.value)} className="w-full rounded border bg-background p-3" />
          </label>
          <label className="space-y-1 text-sm">Table width (inches)
            <input type="number" min="1" max="60" value={tableWidth} onChange={e=>setTableWidth(e.target.value)} className="w-full rounded border bg-background p-3" />
          </label>
        </div>
        <label className="block space-y-1 text-sm">Working clearance per side (inches)
          <input type="number" min="1" max="60" value={clearance} onChange={e=>setClearance(e.target.value)} className="w-full rounded border bg-background p-3" />
        </label>
        <p className="text-xs text-muted-foreground">Defaults are provisional examples: 73 × 30 inch table, plus 30 inches of clearance on every side. Confirm actual table dimensions and your working-space preference before using this as a booking requirement.</p>
        {fit ? (
          <div className="rounded bg-muted p-4 space-y-2" aria-live="polite">
            <p className="font-semibold">{fit.fits ? "Measured rectangle meets the configured minimum" : "Not enough clear floor space with these measurements"}</p>
            <p className="text-sm">Required unobstructed rectangle: {(fit.requiredLengthIn/12).toFixed(1)} ft × {(fit.requiredWidthIn/12).toFixed(1)} ft{fit.rotated ? " (rotate table 90°)" : ""}.</p>
            <p className="text-sm">Provided clear area: {Number(lengthFt).toFixed(1)} ft × {Number(widthFt).toFixed(1)} ft.</p>
            <p className="text-xs text-muted-foreground">Preliminary check only. This does not account for moving furniture, doors, uneven surfaces, therapist technique, or hidden obstacles. Your therapist must make the final decision.</p>
          </div>
        ) : <p role="alert" className="text-sm">Enter valid positive dimensions to calculate room fit.</p>}
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
          <span>I understand this is only a preliminary measurement check and the therapist must confirm the setup.</span>
        </label>
        <button disabled={!fit || !fit.fits || !consent} className="rounded bg-primary px-4 py-3 text-primary-foreground disabled:opacity-40">
          {fit?.fits && consent ? "Preliminary space check complete" : "Complete the space check"}
        </button>
        <p className="text-xs text-muted-foreground">Demo only. Results aren't recorded against a booking. No camera scan, LiDAR analysis or Gaussian splat is running.</p>
      </section>
    </main>
  );
}
