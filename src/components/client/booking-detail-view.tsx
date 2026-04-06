import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatUsd } from "@/lib/format/currency";
import { getTherapistById } from "@/data/mock-therapists";
import type { Booking, BookingStatus } from "@/types/booking";

const timeline: { status: BookingStatus; label: string }[] = [
  { status: "requested", label: "Requested" },
  { status: "accepted", label: "Confirmed" },
  { status: "therapist_preparing", label: "Preparing" },
  { status: "en_route", label: "En route" },
  { status: "arriving_soon", label: "Arriving soon" },
  { status: "arrived", label: "Arrived" },
  { status: "in_session", label: "In session" },
  { status: "completed", label: "Completed" },
];

function statusIndex(status: BookingStatus): number {
  if (status === "cancelled") return -1;
  const i = timeline.findIndex((t) => t.status === status);
  return i >= 0 ? i : 0;
}

export function BookingDetailView({
  booking,
  source = "demo",
}: {
  booking: Booking;
  source?: "database" | "demo";
}) {
  const therapist = getTherapistById(booking.therapistId);
  const idx = statusIndex(booking.status);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/bookings" className="text-pom-sm text-muted-foreground hover:text-foreground">
          Bookings
        </Link>
        <h1 className="pom-display mt-4 text-pom-3xl text-foreground">Session request</h1>
        <p className="mt-2 text-pom-sm text-muted-foreground">
          With {therapist?.displayName ?? "your therapist"}
        </p>
        {source === "database" ? (
          <p className="mt-1 text-pom-xs uppercase tracking-wide text-pom-success">Saved to your account</p>
        ) : (
          <p className="mt-1 text-pom-xs uppercase tracking-wide text-muted-foreground">
            Demo — this device only
          </p>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Status</CardTitle>
          <Badge variant={booking.status === "cancelled" ? "destructive" : "secondary"} className="normal-case">
            {booking.status.replace(/_/g, " ")}
          </Badge>
        </CardHeader>
        <CardContent>
          {booking.status === "cancelled" ? (
            <p className="text-pom-sm text-muted-foreground">This booking was cancelled.</p>
          ) : (
            <ol className="space-y-3">
              {timeline.map((t, i) => (
                <li key={t.status} className="flex items-center gap-3">
                  <span className={`size-2.5 rounded-pom-pill ${i <= idx ? "bg-primary" : "bg-muted"}`} />
                  <span className={i <= idx ? "text-foreground" : "text-muted-foreground"}>{t.label}</span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-pom-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">When</span>
            <span className="text-right text-foreground">{booking.appointmentDateTime}</span>
          </div>
          <Separator />
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Where</span>
            <span className="text-right text-foreground">
              {booking.address}, {booking.city} {booking.state}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Duration</span>
            <span className="text-foreground">{booking.durationMinutes} minutes</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-pom-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Session and add-ons</span>
            <span className="tabular-nums">{formatUsd(booking.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Travel</span>
            <span className="tabular-nums">{formatUsd(booking.travelFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valet coordination</span>
            <span className="tabular-nums">{formatUsd(booking.valetFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform fee</span>
            <span className="tabular-nums">{formatUsd(booking.platformFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="tabular-nums">{formatUsd(booking.total)}</span>
          </div>
          <p className="pt-2 text-pom-xs text-muted-foreground">
            Therapist estimated payout (before tax): {formatUsd(booking.therapistPayout)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
