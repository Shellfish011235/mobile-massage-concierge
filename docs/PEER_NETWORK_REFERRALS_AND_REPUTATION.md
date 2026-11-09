# Massage Concierge: peer network, on-clock availability and reputation
Status: future roadmap only. No real booking transfers, referral payments, public ratings or live geolocation are activated.

## Scope
The Addison Massage Concierge is the first implementation. Anam Beo Bodywork is its service business. Future participating therapists maintain their own branding, verified licenses, insurance, service regions, scheduling, fees, consent and payment accounts.

## Availability / on-the-clock feature
A therapist may opt in to the network and set one of:
- OFF DUTY: no new peer referral offers.
- AVAILABLE NOW: accepting requests immediately for the next configured time window.
- ON THE CLOCK: currently working a scheduled shift, with free appointment slots.
- BUSY: occupied; optionally available for subsequent slots.
- SCHEDULED: available for specified future days and hours.
- PAUSED: temporarily unavailable without ending the shift.

Availability expires automatically unless refreshed, supports an optional maximum daily workload, breaks, notice/travel buffer, geographic coverage and qualification requirements. The availability engine must distinguish "online" from "able to physically arrive immediately"; estimates account for traffic and therapist travel time but do not guarantee arrival.

A recipient therapist explicitly accepts each referral and confirms an exact time. Never automatically assign or charge the client merely because a therapist is marked online. Validate calendar conflicts, service scope, license and insurance eligibility, booking confirmation, trust/safety flags and age/service restrictions. Do not reveal live GPS or home address to clients or peers.

## Consent-based referral handoff
1. Original therapist cannot serve the request and offers trusted eligible peers, with a short expiration.
2. Client chooses to request a specific therapist and consents to share minimum necessary appointment details and contact information.
3. Peer independently approves availability, price and location requirements and provides their own booking terms and checkout.
4. After verified deposit/payment and calendar confirmation, client receives a verified confirmation.
5. Record referral attribution using an opaque ID. Never transfer treatment notes or sensitive medical details without appropriate consent.

## Reviews
- Client reviews therapist after a verified completed appointment: punctuality, professionalism, communication and quality.
- Therapist privately reviews appointment conditions: address accuracy, safe access, respect of boundaries, communications.
- Referring and receiving therapists may review peer reliability and completed handoff quality.
- Prevent review manipulation, reciprocal retaliation and paid positive reviews. Delay reciprocal display until both have reviewed or a window ends.
- Safety allegations are private, moderated, limited-access and appealable; no public "unsafe-client" list, no public client safety score.
- Review visibility, retention, account suspensions, dispute resolution and audit rules require legal/privacy review.

## Compensation legal gate
Referral attribution is separate from monetization. Never enable automatic per-client/patient referral commissions, success-based royalties, fee splitting or healthcare kickbacks by default. Review Florida Statutes §§ 456.054 and 817.505, other jurisdictions, federal healthcare program rules and applicable payer rules with counsel before proposing any paid referral scheme. A software subscription or separately priced lawful platform service may be evaluated but is not automatically exempt.

## Security and acceptance
Tenant isolation, server-side access controls, encrypted contact records, minimal location sharing, independent merchant accounts, verified webhooks, audit logging, expiring availability state, opt-in check-ins, emergency-contact protocols, report appeal process and independent therapist safety exit.
No production availability promises, booking charges, automatic SMS to peers or third-party referrals until integration tests, consent and policy gates pass.
