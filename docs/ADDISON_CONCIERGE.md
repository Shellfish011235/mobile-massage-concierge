# Addison Massage Concierge — implementation plan and acceptance gates

## What this branch implements
- Dedicated `/addison` **local-only preview** and therapist Requests navigation link.
- Isolated advance weekday rates: massage room $100/hour; resident apartment $120/hour; evening (proposed 5 PM onward) or weekend $150/hour.
- Duration 60 / 90 / 120 minutes, priced in integer cents.
- America/New_York calendar classification for weekday/weekend pricing.
- Conservative Betty SMS reply parser: unqualified YES / NO only. Qualified, ambiguous, or rescheduling responses require human review.
- Displays Square / Zelle / Venmo / crypto as **nonfunctional previews**. Does not request payment or mark it complete.

## Commercial workflow (not connected yet)
1. Client requests appointment; validate availability and quote on trusted server. Booking begins `pending_betty` for room or `awaiting_payment` for apartment, provided Addison rules permit.
2. For room bookings, create durable pending request and assign a short opaque booking code. Obtain Betty's consent to use business SMS. Send the minimum needed information (time, duration, room) through a verified Twilio sender. Avoid client health details.
3. Validate signed inbound Twilio webhook, recipient/sender, booking-code association, replay/idempotency and authorization. An unqualified YES transitions that request to `awaiting_payment`; NO to `declined`. A message with conditions or alternative time becomes `needs_clarification`, and a client proposal must be accepted and re-approved if needed.
4. Do not assume silence is approval. Enforce timeouts and owner escalation. Do not create confirmed room availability without Betty's actual approval.
5. Recheck therapist schedule for overlaps and hold the slot before taking payment. Make Google Calendar synchronization idempotent, and preserve errors/retry without double booking.
6. For Square, create a server-generated hosted checkout with the saved, immutable price snapshot, verified webhook, and payment reconciliation. Zelle/Venmo are manual reconciliation until official supported business integrations exist. Crypto payments require a dedicated receiving wallet, exchange quote expiry, destination/tag, validated settlement and USD/tax receipts. Never ask for or store private keys.
7. Send client confirmation only after room approval (where required), payment condition, and calendar creation have all passed. Provide cancel/reschedule and refund policy handling.
8. Protect customer contact details using signed-in owner roles and row-level security. Do not disclose sensitive client details to Betty. Record consent, event log, invoice and payment status separately.

## Outstanding configuration before activation
- Betty's consent, chosen SMS number and handling of simultaneous requests.
- Your verified business sending number, Twilio credentials, webhook signature validation, opt-in/opt-out compliance.
- Google Calendar OAuth and specific calendar ID (do not request Betty's primary calendar).
- Square account, payment webhook, environment configuration and verified checkout; alternative payment business identifiers.
- Booking persistence schema and RLS, paid/pending/cancelled state machine, access controls, tests, monitoring.
- Evening start hour (currently provisional 5 PM), tax/tip, cancellations, deposits, lead times, location-specific rules.
- Review PROJECT-BOUNDARIES.md before any live commercial activation. No secrets in Git.

## Manual preview test matrix
- Weekday 10:00 AM room: 60m $100, 90m $150, 120m $200.
- Weekday 10:00 AM apartment: $120, $180, $240.
- Weekday 5:00 PM, Saturday, Sunday: $150, $225, $300 (both locations).
- YES / Yes. -> pending payment; NO -> declined.
- “Yes, but only until 3”; “Can she come later?”; “No, unavailable until 2” -> needs clarification.
- Apartment skips Betty room-approval step but is **not** a final confirmed booking.
- No external side effects occur from preview; dashboard and public-facing pages must not imply otherwise.
