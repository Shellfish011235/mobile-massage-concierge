import { z } from "zod";

export const pricingLineItemSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  amount: z.number(),
});

export const priceQuoteInputSchema = z.object({
  offeringId: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  selectedAddOnIds: z.array(z.string()),
  travelFee: z.number().nonnegative(),
  valetFee: z.number().nonnegative(),
  platformFeePercent: z.number().nonnegative().max(100),
  platformFeeFlat: z.number().nonnegative(),
});

export const priceQuoteSchema = z.object({
  lineItems: z.array(pricingLineItemSchema),
  subtotal: z.number().nonnegative(),
  addOnsTotal: z.number().nonnegative(),
  travelFee: z.number().nonnegative(),
  valetFee: z.number().nonnegative(),
  platformFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  therapistPayout: z.number().nonnegative(),
});

export const platformFeeConfigSchema = z.object({
  feePercent: z.number().nonnegative().max(100),
  feeFlat: z.number().nonnegative(),
  currency: z.string().length(3),
});
