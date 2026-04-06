import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Creates a Checkout Session for a booking (placeholder).
 * Body: { bookingId: string, successUrl?: string, cancelUrl?: string }
 * Requires STRIPE_SECRET_KEY and a real price / line items in production.
 */
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 503 });
  }

  let body: { bookingId?: string; successUrl?: string; cancelUrl?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.bookingId) {
    return NextResponse.json({ error: "bookingId required" }, { status: 400 });
  }

  const stripe = new Stripe(key);
  const origin =
    request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: body.successUrl ?? `${origin}/bookings/${body.bookingId}?paid=1`,
      cancel_url: body.cancelUrl ?? `${origin}/bookings/${body.bookingId}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Massage session (placeholder)" },
            unit_amount: 10000,
          },
          quantity: 1,
        },
      ],
      metadata: { booking_id: body.bookingId },
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
