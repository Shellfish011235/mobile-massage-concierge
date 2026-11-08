import type { PriceQuote, PriceQuoteInput, PricingLineItem } from "@/types/pricing";
import { computeDemandAdjustment } from "./demand-pricing";

function subtotalForOffering(input: PriceQuoteInput): { subtotal: number; addOnsTotal: number } {
  const { offering, durationMinutes, selectedAddOnIds } = input;
  let subtotal = offering.basePrice;

  if (offering.pricingType === "duration_based") {
    const key = String(durationMinutes);
    const mapped = offering.durationPriceMap[key];
    if (mapped != null) subtotal = mapped;
  }

  const addOnsTotal = offering.addOns
    .filter((a) => a.active && selectedAddOnIds.includes(a.id))
    .reduce((s, a) => s + a.price, 0);

  return { subtotal, addOnsTotal };
}

export function computePriceQuote(input: PriceQuoteInput): PriceQuote {
  const { subtotal, addOnsTotal } = subtotalForOffering(input);
  const { travelFee, valetFee, platformFeePercent, platformFeeFlat } = input;

  const demand = computeDemandAdjustment(input);
  // Surcharge applies to session only, never travel, valet or add-ons.
  const demandAdjustment = Math.round(subtotal * demand.percent / 100);
  const taxableBase = subtotal + demandAdjustment + addOnsTotal + travelFee + valetFee;
  const platformFee = Math.round(
    taxableBase * (platformFeePercent / 100) + platformFeeFlat,
  );
  const total = taxableBase + platformFee;
  const therapistPayout = total - platformFee;

  const lineItems: PricingLineItem[] = [
    { key: "session", label: input.offering.name, amount: subtotal },
  ];
  if (demandAdjustment > 0) {
    lineItems.push({ key: "demand", label: `${demand.label} (${demand.percent}%)`, amount: demandAdjustment });
  }
  if (addOnsTotal > 0) {
    lineItems.push({ key: "addons", label: "Add-ons", amount: addOnsTotal });
  }
  if (travelFee > 0) {
    lineItems.push({ key: "travel", label: "Travel", amount: travelFee });
  }
  if (valetFee > 0) {
    lineItems.push({ key: "valet", label: "Hotel / valet coordination", amount: valetFee });
  }
  if (platformFee > 0) {
    lineItems.push({ key: "platform", label: "Platform service fee", amount: platformFee });
  }

  return {
    lineItems,
    subtotal,
    addOnsTotal,
    travelFee,
    valetFee,
    platformFee,
    demandAdjustment,
    demandPercent: demand.percent,
    demandLabel: demand.label,
    total,
    therapistPayout,
  };
}

export const DEFAULT_PLATFORM: Pick<
  PriceQuoteInput,
  "platformFeePercent" | "platformFeeFlat"
> = {
  platformFeePercent: 12,
  platformFeeFlat: 0,
};
