# Shellfish x Massage Concierge — business-facing proof of concept
Date: 2026-11-09
Status: protected, simulated POC ONLY; no production agent, wallet, payment, SMS or booking execution.

## Commercial intent
Demonstrate the reusable multi-tenant business engine to prospective therapists, spas and other service businesses. The Addison Massage Concierge is only the first vertical/venue. Anam Beo Bodywork is the service business. Betty's approval is reserved for that venue's shared massage room and must never be activated for other tenants.

## Current delivered POC
- Route: `/demo/business`; accessible from `/therapist`.
- Three *invented* business presets; dynamically editable price/deposit/duration.
- Agent-style deterministic authorization result: blocked / needs human / eligible for review.
- Explicit policy flags for provider credential verification, client consent and schedule availability.
- Mobile travel and setup buffer input; unknown travel time causes block.
- Four disabled rail descriptions: Square card, XRP, RLUSD issued-currency payment, and Dassie/ILP messaging.
- JSON *illustrative*, unsigned decision receipt; all real execution flags false.
- No persistence, medical records, secrets, wallet access, actual Shellfish process invocation, ledger RPC, network contact, or payment collection.

## Business-safe architecture
```text
Business tenant (jurisdiction, credentials, seats, merchant)
    -> authenticated customer booking proposal
    -> signed/authorized booking and service context
    -> verified scheduling and travel availability
    -> Shellfish authorization boundary (read-only evaluate)
    -> human approval if required
    -> merchant-owned payment adapter (future / disabled)
        -> Square hosted payment
        -> XRPL XRP normal Payment OR XRP-only Payment Channel (separate adapters)
        -> XRPL RLUSD issued currency Payment (not XRP channel)
    -> verified settlement receipt / reconciliation
    -> idempotent confirmed booking
    -> tenant-scoped calendar + private travel blocks
    -> scoped agent audit receipt
Optional Dassie: transport for authenticated agent messaging, not unrestricted payment access
```

## Exact next acceptance milestones
1. **Real authenticated tenant and persisted booking POC**: limited demo tenants, server-side DB/RLS with policies verified under concurrent access, no medical records, authentic signed requests, unique idempotency keys and booking conflict exclusion. Nationwide settings must be configurable by state, county, permitted venue, license and insurance status. Unreviewed jurisdictions block real bookings.
2. **Shellfish read-only adapter**: integrate with a *specific reviewed commit* from `Shellfish011235/shellfish-agent-control`, preferably isolated signed HTTPS adapter; verify policy envelopes, nonces, expiry, authority binding and receipt signatures server-side. Do NOT copy Python functions into browser or claim simulation is a real signed engine. Required tests: replay fail-closed, unauthorized tenant denial, lost acknowledgement receipt recovery, transaction separation.
3. **Square sandbox business settlement**: only merchant-controlled accounts, server-verifiable hosted payment intents, signed webhooks, amount matching, approval, receipts, refunds and idempotency; real money disabled until legal and security checks.
4. **XRPL Testnet isolated adapter**: independent key management with zero production signing permissions. Test XRP normal Payment and separately RLUSD/issued-currency Payment where test infrastructure supports it. Do not substitute XRP Payment Channels for RLUSD. Evidence: validated ledger proof, correct currency/issuer/destination/amount and tag if required. Keep denomination/price conversion explicit.
5. **Dassie / ILP**: optional audited authenticated agent message transport; off unless independently proven end-to-end. Separate transport health from execution status and settlement receipts. No customer PII, private keys or unrestricted agency.
6. **Public partner POC**: use non-sensitive synthetic data, clearly separate real vs simulated events, measurable time-to-approval, double-booking rejection, receipt lineage, permission denials, and costs. Public release only after review; the currently protected demo must not be presented as production.

## Revenue and compliance strategy
- Proposed $1.99 Solo is for **bounded SaaS features**, not unlimited agent execution, SMS, verification, data storage, or payment fees.
- Business/team seats, paid automation and separately metered usage may support unit economics; verify churn, support and processor fees before adopting pricing.
- Direct merchant settlement is the default. No custodial pooled funds, automatic patient referral commissions, agent-owned customer funds or routing for third-party users without legal counsel analyzing money transmission, state licensing, payment processor agreements, Florida and other jurisdiction-specific requirements.
- A testnet demo does not establish regulatory exemption for production.
- Clinical intake/SOAP is external-provider link only; actual clinical records stay with independently contracted vendors. Integrations may still create obligations and require review.
- Therapist/client safety controls and tenant isolation remain mandatory in all subscription tiers.

## Release rule
Do not enable public booking, live payments, crypto custody, generalized agent signing, or new third-party message delivery until explicit authorization and independent legal/security acceptance. The current `/demo/business` is not a claim of integrated Shellfish, Dassie, XRPL Testnet or settled transactions.
