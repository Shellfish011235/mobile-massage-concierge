import { NextResponse } from "next/server";

/**
 * The legacy placeholder charged a hard-coded $100, unrelated to the booking.
 * Fail closed until a proper provider, immutable booking quote, permissions and
 * webhook verification are implemented. Never use this for Addison deposits.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Legacy demo checkout disabled. No payment was created." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
