# Anam Beo / Addison launch checklist

**Selected setup:** existing domain, existing Square business account, new dedicated business SMS number, installable mobile web app (PWA).

**Status:** development only. Do not publish as a live booking/payment system yet.

## First deployment
1. Confirm the exact domain name and DNS provider, plus which subdomain should host bookings. Never ask for domain-account passwords.
2. Link the existing `Shellfish011235/mobile-massage-concierge` GitHub repository to a staging project in Vercel. Deploy feature PR to a preview environment first; do not merge or point public DNS until testing passes.
3. Configure HTTPS and a verified custom domain through the hosting provider. Set strict staging access, then conduct independent privacy/accessibility checks.
4. Verify `/addison`, `/addison/space-check` and `/manifest.webmanifest` on desktop/mobile. Installability depends on browser support and may require raster icons for best cross-device behavior.
5. Existing general marketplace paths remain experimental. Ensure no fake professional verification, dummy payments, or placeholder bookings are exposed in the public launch experience.

## Backend: before client bookings
- Apply reviewed Supabase migrations, enable restrictive RLS, verify separate therapist/client roles.
- Create a persistent Addison booking-request state machine, locking/uniqueness to prevent conflicting appointments, event audit log, and unique Betty approval correlation IDs.
- Validate quotes server-side (not by trusting client input), store immutable deposit snapshot, and set clear cancellation/refund terms with consent timestamp.
- Integrate a dedicated Google Calendar with OAuth, check busy times, and reconcile failures without duplicate events.
- Implement secure client confirmation + owner dashboard; only send SMS with consent. Betty's response must match an unambiguous pending request.

## Square payments
- In Square Developer Dashboard, create/connect a business application and select the business location; begin in **Sandbox**.
- Store `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, and `SQUARE_WEBHOOK_SIGNATURE_KEY` in hosting secrets only. Never commit them or expose them with NEXT_PUBLIC_ prefixes.
- Create a Square-hosted `CreatePaymentLink` on the server **only from a persisted, approved booking and immutable $25 deposit**, with payment idempotency.
- Use Square-hosted payment collection; never accept raw card numbers, CVV or banking passwords on the Massage Concierge server.
- Validate signed webhook body, signature, event ID/idempotency, amount, currency, booking ID, and payment status; do not trust browser return parameters or a screenshot of a payment.
- Handle refunds, reconciliation, dispute events, expired links, and scheduling failure. Keep enough transaction references for accounting, but not card details.
- Existing `/api/stripe/checkout` sample was disabled in this PR because it previously created a fixed-price $100 payment link.

## Venmo/Zelle/crypto
- Venmo business profile and Zelle business enrollment details: confirm in provider accounts, show only verified business payment instructions, and mark payment pending until verified manually. Don't invent handles or bank info.
- Crypto: use a **separate business receiving wallet**, approved asset/network, quote expiry, memo/tag where needed, on-chain transaction verification and USD accounting; no private keys in code.
- No method should confirm an appointment simply because a payment method was selected.

## SMS / Betty
- Create a dedicated Twilio business SMS account and phone number. Register applicable US A2P 10DLC brand/campaign and opt-in/STOP/HELP messaging before outbound messages.
- Keep `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and other secrets server-only.
- Authenticate webhook requests; associate every response with a single request and sender number.
- Treat Betty's conditional replies as human-review events, never automatic approval.
- Do not send medical notes or apartment photos by SMS.

## PWA and privacy
- App manifest and SVG icon added. No service worker/offline cache yet, intentionally: do not cache booking details, tokens, images, or payment returns.
- Room photos in the current preview stay in browser memory and aren't uploaded.
- Review privacy notice, cancellation policy and service terms before launch. Confirm current Florida massage licensure, business insurance, establishment/venue permissions and marketing accuracy.
- Review `PROJECT-BOUNDARIES.md` and conduct dependency, build, security and end-to-end tests.

## Dassie later
- Use already-configured S9 Dassie test node **only after** the commercial booking/payments foundation is stable.
- Read-only, separately authenticated node health telemetry; no customer PII, no wallet access, no production money transmission.
