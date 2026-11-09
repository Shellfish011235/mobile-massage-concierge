/**
 * Shellfish business POC: bounded, deterministic policy decisions, no wallets.
 * Everything in this module is a locally simulated business case.
 * This is not a certified implementation of shellfish-agent-control or
 * the existing Python compliance and transactional replay system.
 */
export type PaymentRail = "square" | "xrp" | "rlusd" | "dassie";
export type ServiceMode = "mobile" | "venue";
export type AgentDecision = {
  status: "allowed_for_review" | "needs_human" | "blocked";
  reason: string;
  requiredProof: string[];
  canExecute: false;
};
export type BusinessCase = {
  businessId: string;
  providerId: string;
  customerAlias: string;
  service: string;
  mode: ServiceMode;
  durationMinutes: number;
  priceCents: number;
  depositCents: number;
  travelMinutes: number | null;
  setupMinutes: number;
  availabilityVerified: boolean;
  credentialsVerified: boolean;
  customerConsent: boolean;
  humanApproval: boolean;
  rail: PaymentRail;
};
export type DemoReceipt = {
  version: "shellfish-demo-1";
  reference: string;
  issuedAt: string;
  businessId: string;
  agent: "shellfish-demo-policy";
  decision: AgentDecision["status"];
  paymentRail: PaymentRail;
  totalCents: number;
  depositCents: number;
  canExecute: false;
  verifiedSettlement: false;
  simulated: true;
  requiredProof: string[];
  warning: string;
};
export const RAILS: Record<PaymentRail,{ label:string; detail:string; enabled:boolean }> = {
  square: { label: "Square / card", detail: "Merchant-hosted checkout; no checkout or webhooks connected in demo", enabled: false },
  xrp: { label: "XRPL XRP", detail: "XRP Payment Channels are XRP-only; a separate XRP transfer or channel adapter requires independent authorization", enabled: false },
  rlusd: { label: "XRPL RLUSD", detail: "Issued-currency Payment path, not an XRP Payment Channel; issuer/trust-line/asset checks required", enabled: false },
  dassie: { label: "Dassie / ILP (messaging)", detail: "Optional communication transport only; no node or settlement adapter is connected", enabled: false },
};

export function evaluateBusinessCase(input: BusinessCase): AgentDecision {
  const requiredProof = [
    "Authorized business and therapist identity",
    "Booking conflict and availability verification",
    "Client-approved amount and terms",
    "Independent payment/receipt verification",
    "Durable idempotency and audit record",
  ];
  if (!input.businessId || !input.providerId || !Number.isInteger(input.priceCents) ||
      input.priceCents <= 0 || !Number.isInteger(input.depositCents) ||
      input.depositCents < 0 || input.depositCents > input.priceCents ||
      !Number.isInteger(input.durationMinutes) || input.durationMinutes < 15 ||
      input.durationMinutes > 240) {
    return { status:"blocked",reason:"Invalid booking scope, duration or payment amount", requiredProof,canExecute:false };
  }
  if (!input.credentialsVerified)
    return { status:"blocked",reason:"Therapist credential verification is required",requiredProof,canExecute:false };
  if (!input.customerConsent)
    return { status:"blocked",reason:"Client consent to pricing and terms is required",requiredProof,canExecute:false };
  if (!input.availabilityVerified)
    return { status:"blocked",reason:"Availability and calendar conflicts have not been verified",requiredProof,canExecute:false };
  if (input.mode === "mobile" && (input.travelMinutes === null ||
      !Number.isInteger(input.travelMinutes) || input.travelMinutes < 0 ||
      input.travelMinutes > 480))
    return { status:"blocked",reason:"Mobile travel time is unknown or invalid; no automatic slot approval",requiredProof,canExecute:false };
  if (!Number.isInteger(input.setupMinutes) || input.setupMinutes < 0 || input.setupMinutes > 480)
    return { status:"blocked",reason:"Invalid setup buffer",requiredProof,canExecute:false };
  if (!input.humanApproval)
    return { status:"needs_human",reason:"Agent recommendation is awaiting human approval; no payment authority delegated",requiredProof,canExecute:false };
  return {status:"allowed_for_review",reason:"Policy checks passed in simulation only. Production execution remains disabled until real signed authority, verified payment and compliance proof are connected.",requiredProof,canExecute:false};
}

export function makeDemoReceipt(input: BusinessCase, decision: AgentDecision, reference: string, issuedAt: string): DemoReceipt {
  return {
    version:"shellfish-demo-1",reference,issuedAt,businessId:input.businessId,
    agent:"shellfish-demo-policy",decision:decision.status,paymentRail:input.rail,
    totalCents:input.priceCents,depositCents:input.depositCents,
    canExecute:false,verifiedSettlement:false,simulated:true,
    requiredProof:decision.requiredProof,
    warning:"DEMO ONLY — unsigned local illustration, not a Shellfish cryptographic receipt or on-chain confirmation",
  };
}
