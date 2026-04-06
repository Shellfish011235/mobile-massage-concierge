"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BookingDetailView } from "@/components/client/booking-detail-view";
import { loadDemoBookings } from "@/lib/demo/booking-storage";
import type { Booking } from "@/types/booking";

export function DemoBookingDetail({ id }: { id: string }) {
  const [booking, setBooking] = useState<Booking | null | "loading">("loading");

  useEffect(() => {
    const list = loadDemoBookings();
    setBooking(list.find((b) => b.id === id) ?? null);
  }, [id]);

  if (booking === "loading") {
    return <p className="text-pom-sm text-muted-foreground">Loading…</p>;
  }

  if (!booking) {
    return (
      <div className="space-y-4">
        <p className="text-pom-sm text-muted-foreground">Booking not found in this session.</p>
        <Link href="/bookings" className="font-medium text-primary hover:underline">
          All bookings
        </Link>
      </div>
    );
  }

  return <BookingDetailView booking={booking} source="demo" />;
}
