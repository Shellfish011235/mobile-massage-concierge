import { z } from "zod";
import { pricingTypeSchema } from "./enums";

export const serviceAddOnSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().max(500).nullable(),
  price: z.number().nonnegative(),
  active: z.boolean(),
});

export const durationPriceMapSchema = z.record(z.string(), z.number().nonnegative());

export const serviceOfferingSchema = z.object({
  id: z.string().min(1),
  therapistId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().max(2000).nullable(),
  durationOptions: z.array(z.number().int().positive()).min(1),
  pricingType: pricingTypeSchema,
  basePrice: z.number().nonnegative(),
  durationPriceMap: durationPriceMapSchema,
  addOns: z.array(serviceAddOnSchema),
});
