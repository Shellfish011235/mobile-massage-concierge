import type { ServiceOffering } from "./service-offering";
import type { DemandPricingInput } from "@/lib/pricing/demand-pricing";

/**
 * Inputs/outputs for the pricing calculator (Stripe Connect–friendly breakdown).
 */

export interface PricingLineItem {
  key: string;
  label: string;
  amount: number;
}

export interface PriceQuoteInput extends DemandPricingInput {
  offering: ServiceOffering;
  durationMinutes: number;
  selectedAddOnIds: string[];
  travelFee: number;
  valetFee: number;
  /** Platform take — percent of subtotal+fees or flat; enforced server-side in production */
  platformFeePercent: number;
  platformFeeFlat: number;
}

export interface PriceQuote {
  lineItems: PricingLineItem[];
  subtotal: number;
  addOnsTotal: number;
  travelFee: number;
  valetFee: number;
  platformFee: number;
  demandAdjustment: number;
  demandPercent: number;
  demandLabel: string;
  total: number;
  therapistPayout: number;
}

/** Default platform config — override via env / admin in production */
export interface PlatformFeeConfig {
  feePercent: number;
  feeFlat: number;
  currency: string;
}
