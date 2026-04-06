"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { loadDemoBookings } from "@/lib/demo/booking-storage";
import { formatUsd } from "@/lib/format/currency";
import type { Booking } from "@/types/booking";

export function BookingsMergedList({ dbBookings }: { dbBookings: Booking[] }) {
  const [demoBookings, setDemoBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setDemoBookings(loadDemoBookings());
  }, []);

  const merged = useMemo(() => {
    const ids = new Set(dbBookings.map((b) => b.id));
    const demoOnly = demoBookings.filter((b) => !ids.has(b.id));
    return [...dbBookings, ...demoOnly];
  }, [dbBookings, demoBookings]);

  if (merged.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-pom-sm text-muted-foreground">
          <p>No requests yet.</p>
          <Link href="/discover" className="mt-4 inline-block font-medium text-primary hover:underline">
            Discover therapists
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {merged.map((b) => (
        <li key={b.id}>
          <Link href={`/bookings/${b.id}`}>
            <Card className="transition-shadow duration-pom hover:shadow-pom-2">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-foreground">{b.serviceName}</p>
                  <p className="text-pom-xs uppercase tracking-wide text-muted-foreground">
                    {b.status.replace(/_/g, " ")}
                  </p>
                </div>
                <p className="tabular-nums text-pom-sm font-medium">{formatUsd(b.total)}</p>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
