# Competitor gap audit and implementation backlog — 2026-11-09

Scope: The Addison Massage Concierge is the first use case, delivered by Anam Beo Bodywork. Future platform supports independent licensed therapists and multi-therapist businesses. Do NOT mistake a prototype screen for an operational service.

## Public competitor evidence
- MassageBook: booking, outcall services, scheduling, cancellations/waitlist, client management, memberships, gifts, reviews and optional clinical intake/SOAP notes. https://pro.massagebook.com/features and https://support.massagebook.com/hc/en-us/articles/49251635207693-Launch-Tier-Overview-and-FAQs
- Square Appointments: booking website, Google Calendar sync, automated reminders, resource/room reservations, waitlist, deposits and cancellation fees, multistaff scheduling, payments, gift cards and consumer discovery. https://squareup.com/us/en/appointments/features
- Fresha: calendar, service menus, staff/resources, checkout, waitlist, automated messages and marketplace. https://www.fresha.com/for-business/features
- Vagaro: booking, staff, deposits, gift cards/packages, memberships and merchant payouts. https://support.vagaro.com/hc/en-us/articles/204348270-Activate-the-Online-Shopping-Cart
- The Wellness Guild: independent licensed providers, ZIP-based location discovery, rooms, peers, verification and direct-to-provider payments. https://thewellnessguild.app/
- EASE: therapist on-demand job acceptance and advertised $25 per completed customer referral, manually verified. This is evidence of market positioning, **not** legal permission to copy referral-fee terms. https://try-ease.co/referrals
- FTC rule: no fabricated ratings or paid-for-positive reviews. https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials
- Florida 2026 §817.505: restrictions on healthcare patient-referral compensation, subject to statutory definitions/exceptions. https://www.flsenate.gov/Laws/Statutes/2026/817.505

## Gap matrix
| Capability | Existing Addison branch | Next safe step | Release gate |
| --- | --- | --- | --- |
| Pricing, 60–120 minutes, room/apartment | Preview implemented | Validate timezone and local DST conversion server-side | Production pricing tests |
| Client contact preferences | UI/consent preview only | Accountless verified booking token and minimal server-side persistence | Privacy/RLS and anti-spam |
| Betty room approval | Reply parser / text templates only | Per-request authenticated SMS with opaque code, reply uniqueness, expiry and audit | Betty consent, A2P, Twilio webhook validation |
| Calendar double-booking prevention | Missing | Durable reservation hold, resource availability, appointment conflicts | Race/idempotency tests |
| $25 deposit + final balance and optional tip | Copy and payment-method UI only | Square sandbox merchant-connected hosted checkout, webhook, refund handling | No live funds until verified |
| Cancellation waitlist | **Added optional local-only UI preview** | Opt-in waitlist persisted securely with expiring offers and fairness/rate limits | No pretending an appointment is held |
| Repeat-client booking convenience | **Added local-only returning-client selector** | Safe reuse of preferences by authenticated/consented clients (not treatment records) | Client identity verification |
| In-apartment visit preparation | **Added optional checklist preview** | Trusted arrival instructions, safe exit/check-in and privacy controls | Staff-only scope, retention policy |
| On-demand peer coverage | Roadmap only | Separate peer availability/shifts, opt-in and radius matching | Credential review and client handoff consent |
| Therapist peer reviews, client reviews | Roadmap only | Verified completed-service feedback, appeal and private safety flags | Moderation and FTC compliance |
| Provider license/insurance proof | Roadmap only | Secure private document intake with expiry reminders and manual/official checks | Least-privilege, no public docs |
| Seat-based subscription | Roadmap only | Evaluate Solo $1.99, team bundles and per-seat caps | Billing economics, metering and tenant isolation |
| Provider payments | Not connected | Merchant-owned processing via authorized provider connections | No pooled provider funds by default |
| Packages, memberships, gift cards | Not implemented | Evaluate after MVP revenue/safety tests | Processor and refund review |
| Marketing/SEO/QR booking link | Manifest/UI partly implemented | Production app branding, QR booking link, email consent management | Custom domain + verified messages |
| Clinical intake, SOAP, HIPAA module | Explicitly out of scope | Separate future optional product | Independent clinical/privacy compliance |
| Automated peer referral compensation | Disabled | Counsel review of provider and patient referral rules | Written legal approval, not automatically enabled |

## Safety/security requirements
- Do not show public client safety scores or unmoderated allegations. Therapist incident reports are role-restricted, reviewable and appealable.
- Never expose a therapist's live GPS or home address to clients or peers; appointment check-ins are optional and consented.
- Multi-tenant authorization MUST be enforced server-side / DB RLS. Cannot treat UI account filters as secure isolation.
- Client names, location access, phone numbers, medical notes, and documents must never enter public GitHub or Vercel logs.
- All booking, SMS and payment state transitions need signed webhooks, authenticated roles, replay protection, audit events, conflict checks and idempotency.
- "$1.99 unlimited" cannot promise unlimited SMS, staff support, paid verification or payment processing. Per-therapist subscription needs usage metering and a separate variable-cost policy.

## Work committed this audit
- `src/components/addison/booking-extras.tsx`: optional client-side cancellation waitlist preference with alternate-time picker; returning-client selector; optional in-apartment arrival and safety preparation checklist.
- `src/app/addison/page.tsx`: embedded new preview within resident booking request.
- None of these options currently writes data, contacts Betty/clients, creates bookings, validates safety, accepts a subscription or collects money.

## Launch order
1. Stabilize Vercel preview builds, test UI and isolate public-facing paths; resolve custom domain billing only after confirming failed orders.
2. Lock schema + tenant isolation and implement persisted booking/availability with server-side quotes, conflict prevention, auditing and cancellation policy.
3. Connect Betty approval and owner notice with opt-in A2P-compliant SMS and signed reply webhooks; client email/SMS after real approval.
4. Connect Square sandbox with direct merchant settlement, signed payment callbacks, deposit verification, refunds and post-service balance/tip.
5. Test mobile client workflow, accessibility and privacy; move to production only when all external side effects are proven.
6. Multi-therapist SaaS, verified provider documents, peer/on-clock marketplace, moderate ratings and usage-aware subscriptions later.
