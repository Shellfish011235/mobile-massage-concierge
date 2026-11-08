"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createBookingAction } from "@/actions/booking-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appendDemoBooking } from "@/lib/demo/booking-storage";
import { buildBookingFromRequest } from "@/lib/demo/create-booking";
import { formatUsd } from "@/lib/format/currency";
import { computePriceQuote, DEFAULT_PLATFORM } from "@/lib/pricing/compute-quote";
import { bookingRequestSchema } from "@/lib/validations/booking";
import type { LocationType, ValetPreference } from "@/types/booking";
import type { TherapistProfile } from "@/types/therapist-profile";

const steps = ["Service", "Location", "Space", "Confirm"] as const;

type Props = { therapist: TherapistProfile };

export function BookingWizard({ therapist }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const primary = therapist.services[0];
  const [serviceId, setServiceId] = useState(primary.id);
  const offering = therapist.services.find((s) => s.id === serviceId) ?? primary;
  const [durationMinutes, setDurationMinutes] = useState(offering.durationOptions[0]);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);

  const [locationType, setLocationType] = useState<LocationType>("home");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Miami");
  const [state, setState] = useState("FL");
  const [hotelName, setHotelName] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [parkingNotes, setParkingNotes] = useState("");
  const [valetRequired, setValetRequired] = useState<ValetPreference>("not_sure");
  const [clientNotes, setClientNotes] = useState("");

  const [envOk, setEnvOk] = useState({
    space: false,
    pets: false,
    quiet: false,
    clean: false,
  });

  const travelPreview = useMemo(() => {
    const travelFee =
      locationType === "hotel" ? 3500 : locationType === "office" ? 2500 : 1500;
    const valetFee = valetRequired === "yes" ? 2000 : 0;
    return computePriceQuote({
      offering,
      durationMinutes,
      selectedAddOnIds: addOnIds,
      appointmentDateTime,
      travelFee,
      valetFee,
      ...DEFAULT_PLATFORM,
    });
  }, [addOnIds, appointmentDateTime, durationMinutes, locationType, offering, valetRequired]);

  function toggleAddOn(id: string) {
    setAddOnIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function next() {
    setError(null);
    if (step === 1) {
      if (!address.trim() || !appointmentDateTime) {
        setError("Address and appointment time are required.");
        return;
      }
      if (locationType === "hotel" && !hotelName.trim()) {
        setError("Hotel name is required for hotel visits.");
        return;
      }
    }
    if (step === 2) {
      if (!envOk.space || !envOk.pets || !envOk.quiet || !envOk.clean) {
        setError("Please confirm each environment item to continue.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setError(null);
    const raw = {
      therapistProfileId: therapist.id,
      serviceId: offering.id,
      durationMinutes,
      appointmentDateTime,
      locationType,
      address: address.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase().slice(0, 2),
      hotelName: locationType === "hotel" ? hotelName.trim() : undefined,
      parkingNotes: parkingNotes.trim() || undefined,
      valetRequired,
      clientNotes: clientNotes.trim() || undefined,
      environmentConfirmed: true as const,
      spaceConfirmed: true as const,
      petsSecuredConfirmed: true as const,
      quietSettingConfirmed: true as const,
      cleanSurfaceConfirmed: true as const,
      selectedAddOnIds: addOnIds,
    };

    const parsed = bookingRequestSchema.safeParse(raw);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid form.");
      return;
    }

    setSubmitting(true);
    const result = await createBookingAction(parsed.data, therapist.id);
    setSubmitting(false);

    if (result.ok && result.source === "database") {
      router.push(`/bookings/${result.booking.id}`);
      router.refresh();
      return;
    }

    if (result.ok && result.useClientDemo) {
      try {
        const booking = buildBookingFromRequest(parsed.data, therapist);
        appendDemoBooking(booking);
        router.push(`/bookings/${booking.id}`);
      } catch {
        setError("Could not create booking.");
      }
      return;
    }

    if (!result.ok && "needAuth" in result && result.needAuth) {
      setError("Sign in to save this booking to your account.");
      return;
    }

    if (!result.ok && "error" in result) {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`h-1 flex-1 rounded-pom-pill ${i <= step ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>

      {error ? (
        <p className="rounded-pom-md border border-pom-danger-border bg-pom-danger-subtle px-3 py-2 text-pom-sm text-pom-danger">
          {error}
        </p>
      ) : null}

      {step === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Massage type</Label>
              <select
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-pom-base shadow-sm"
                value={serviceId}
                onChange={(e) => {
                  const s = therapist.services.find((x) => x.id === e.target.value);
                  if (!s) return;
                  setServiceId(s.id);
                  setDurationMinutes(s.durationOptions[0]);
                  setAddOnIds([]);
                }}
              >
                {therapist.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="flex flex-wrap gap-2">
                {offering.durationOptions.map((m) => (
                  <Button
                    key={m}
                    type="button"
                    variant={durationMinutes === m ? "default" : "outline"}
                    className="rounded-pom-pill"
                    onClick={() => setDurationMinutes(m)}
                  >
                    {m} min
                  </Button>
                ))}
              </div>
            </div>
            {offering.addOns.filter((a) => a.active).length > 0 ? (
              <div className="space-y-2">
                <Label>Add-ons</Label>
                <div className="space-y-2">
                  {offering.addOns
                    .filter((a) => a.active)
                    .map((a) => (
                      <label
                        key={a.id}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-pom-lg border border-border px-3 py-2"
                      >
                        <span className="text-pom-sm">
                          {a.name}{" "}
                          <span className="text-muted-foreground">({formatUsd(a.price)})</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={addOnIds.includes(a.id)}
                          onChange={() => toggleAddOn(a.id)}
                          className="size-4 accent-primary"
                        />
                      </label>
                    ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Location and time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Location type</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["home", "Residence"],
                    ["hotel", "Hotel"],
                    ["office", "Office"],
                    ["event", "Event"],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={locationType === value ? "default" : "outline"}
                    className="rounded-pom-pill"
                    onClick={() => setLocationType(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            {locationType === "hotel" ? (
              <div className="space-y-2">
                <Label htmlFor="hotel">Hotel name</Label>
                <Input id="hotel" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="when">Appointment</Label>
              <Input
                id="when"
                type="datetime-local"
                value={appointmentDateTime}
                onChange={(e) => setAppointmentDateTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Valet</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["yes", "Yes"],
                    ["no", "No"],
                    ["not_sure", "Not sure"],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={valetRequired === value ? "default" : "outline"}
                    className="rounded-pom-pill"
                    onClick={() => setValetRequired(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking">Parking / access notes</Label>
              <Textarea id="parking" value={parkingNotes} onChange={(e) => setParkingNotes(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes for your therapist</Label>
              <Textarea id="notes" value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card>
          <CardHeader>
            <CardTitle>Environment readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-pom-sm text-muted-foreground">
            <p>
              Confirm your space is ready for a professional massage table and a quiet treatment.
            </p>
            {(
              [
                ["space", "Enough clear floor space for a massage table"],
                ["pets", "Pets secured in another room"],
                ["quiet", "Quiet, private setting available"],
                ["clean", "Clean floor area and safe access path"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-start gap-3 rounded-pom-lg border border-border p-3">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-primary"
                  checked={envOk[key]}
                  onChange={(e) => setEnvOk((o) => ({ ...o, [key]: e.target.checked }))}
                />
                <span>{label}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-pom-sm text-muted-foreground">
              {appointmentDateTime ? `${travelPreview.demandLabel}${travelPreview.demandPercent ? ` (+${travelPreview.demandPercent}% on session)` : ""}. Final price shown before submitting.` : "Choose a date and time to see applicable pricing."}
            </p>
            <ul className="space-y-2 text-pom-sm">
              {travelPreview.lineItems.map((line) => (
                <li key={line.key} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{line.label}</span>
                  <span className="tabular-nums text-foreground">{formatUsd(line.amount)}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-border pt-3 font-medium">
                <span>Total due</span>
                <span className="tabular-nums">{formatUsd(travelPreview.total)}</span>
              </li>
            </ul>
            <p className="text-pom-xs leading-relaxed text-muted-foreground">
              Palm Concierge is a marketplace. Your therapist is an independent professional.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-between gap-3">
        <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={() => void submit()} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit request"}
          </Button>
        )}
      </div>
    </div>
  );
}
