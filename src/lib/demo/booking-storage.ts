"use client";

import type { Booking } from "@/types/booking";

const KEY = "pom_demo_bookings_v1";

export function loadDemoBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Booking[];
  } catch {
    return [];
  }
}

export function saveDemoBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(bookings));
}

export function appendDemoBooking(booking: Booking) {
  const all = loadDemoBookings();
  saveDemoBookings([booking, ...all]);
}
