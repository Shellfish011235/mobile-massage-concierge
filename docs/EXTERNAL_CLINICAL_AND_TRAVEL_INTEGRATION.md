# Clinical-tools external provider policy (design gate, not clinical storage)

**Default for the $1.99 tier:** Booking, safety and schedules only. Clinical intake and SOAP documentation remain with independently selected professional vendors.

## Why a connector rather than our own vault
- Each practitioner can use their own properly licensed/contracted clinical charting provider, under their own account, including intake and SOAP notes.
- Massage Concierge should initially link to a provider's public, HTTPS login page, not accept client-specific portal links, login tokens or medical information.
- The app does not host or proxy intake forms, SOAP notes, PDFs, medical diagnoses, PHI, patient IDs, QR health access tokens or provider credentials.
- A link is *not* a guarantee of outsourced legal liability. Therapists remain responsible for appropriate records and obtaining relevant agreements. Our platform remains responsible for its own booking data, authentication, security and representations.
- Any OAuth, patient sync, webhook, embedding, deep-linking or clinical metadata would trigger independent privacy, legal, access-control, vendor contract and HIPAA applicability assessment.
- The vendor must undergo security, retention, portability and compliance review. Avoid calling third-party products HIPAA compliant without confirmation of their exact contracted plan and configuration.

## Proposed account settings
- Provider choice: None / approved external provider / custom enterprise request under admin review.
- Provider account verified by therapist via vendor-origin authentication (future only).
- Tenant-specific clinical feature toggle defaults OFF.
- A vetted allowlist of HTTPS vendor **sign-in home pages**, not arbitrary URLs.
- "Open intake platform" and "Open SOAP notes" go to the vendor's login home without client or booking identifiers.
- No clinical fields included in scheduling, notifications, peer matching, calendar titles, analytics or URL query strings.
- Never scrape, embed, iframe or automate clinical portals without security and contractual assessment.

## Future QR proposal
A client-controlled temporary sharing grant is deferred to a later independent module; do not build one into ordinary booking or put health details inside QR codes.

## Travel-aware booking design
- Each booking has a location accessible only to authorized therapist/owner, a time interval, and separately selected travel mode.
- For any two on-site appointments, obtain a traffic-aware travel estimate where supported, or request a conservative manual estimate. If none is available, refuse automatic confirmation.
- Reserve **preceding travel + parking/elevator/setup** and **following teardown/travel** as opaque private busy intervals; reject conflicts transactionally across all the therapist's calendars.
- On reassignment/cancellation/rebooking, adjust the dependent buffers idempotently and recheck neighboring bookings.
- Use Google Maps Routes API server-side for estimated driving time only with a configured key, explicit consent, a budget, appropriate purpose limitation, rate limits, caching permitted by provider terms, and audit protections.
- Waze documented deep links are for navigation and **do not give us an ETA API**. Make Waze or Google Maps the therapist's optional navigation preference and open on explicit click.
- A calendar connection will create private `transparency: opaque` Google Calendar events without medical information or full client identifiers.
- Never write travel holds to the connected calendar until authenticated, tenant-scoped OAuth and idempotent booking persistence are ready.
- This app currently has only a preview planner and pure interval helpers. No route service or calendar write is active.

## Acceptance gates
1. Authorized therapist calendar ownership and tenant boundaries confirmed.
2. Full timezone/DST coverage, overlapping and adjoining intervals tested.
3. Server refuses unknown travel durations unless therapist supplies a documented manual buffer.
4. Rebooking / no-show / cancellation reconciliation and duplicate event protection tested.
5. Maps data disclosed to user before external navigation; prevent accidental PHI sharing.
6. External clinical vendors and agreements independently reviewed before listing as approved.
