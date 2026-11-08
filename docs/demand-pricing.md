# Mobile massage: transparent demand-based pricing (experimental)

This branch implements a configurable policy, **not a live surge-pricing service**. It is intended for review in demo mode. It does not activate Stripe payments, add a live supply feed, or change the project's operating boundaries.

## Policy (all multipliers apply to the session price only)

- **48 or more hours ahead:** always standard service rate, even during expected busy windows.
- **24–48 hours ahead:** standard rate in normal windows; +10% on published peak windows.
- **4–24 hours ahead:** +10% short-notice adjustment; add +10% on published peak windows.
- **Under 4 hours ahead:** +20% urgent adjustment; add +10% on published peak windows.
- **Published peak windows, local time:** Friday 5–9 p.m.; Saturday 10 a.m.–6 p.m.; Sunday 10 a.m.–4 p.m. These are suggested defaults, not observed demand.
- **Verified market pressure (future integration only):** +10% when busy, +20% when very busy. Never claim this comes from real-time supply without verified provider availability.
- **Hard cap:** 35% combined session surcharge. Never surcharge add-ons, hotel/valet costs, or travel.
- **Price acceptance:** the server recalculates a booking quote and refuses a price above the client's accepted amount. Database bookings store the final monetary snapshot. Prices do not update on existing bookings.

An appointment uses the configured `America/New_York` business timezone by default. A multi-region rollout must supply the destination's IANA timezone server-side, and handle daylight-saving duplicate times explicitly.

## Integration points

- `src/lib/pricing/demand-pricing.ts`: pricing policy.
- `src/lib/pricing/compute-quote.ts`: adds visible surcharge line item, recalculates platform fee on the adjusted sum.
- `src/components/client/booking-wizard.tsx`: preview and approval.
- `src/lib/demo/create-booking.ts` and `src/actions/booking-actions.ts`: persistent booking price snapshots and server-side ceiling check.

## Before production

Implement trusted therapist schedules and geospatial supply/demand ratios, validated inventory and conflict checks, timezone-aware appointment normalization, quote IDs/expiry and atomic reservation, complete refund/cancellation rules, audit trails, configurable local pricing thresholds, robust automated tests, and genuine Stripe payment amounts (the existing Stripe Checkout endpoint remains a placeholder). Confirm appropriate business/legal review under `PROJECT-BOUNDARIES.md`. No app deployment or live payments are enabled by this change.
