import { z } from "zod";

export const savedAddressSchema = z.object({
  id: z.string().min(1),
  label: z.string().max(80).nullable(),
  line1: z.string().min(1),
  line2: z.string().max(120).nullable(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  postalCode: z.string().max(16).nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  isDefault: z.boolean(),
});

export const clientProfileSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  savedAddresses: z.array(savedAddressSchema),
  ratingAverage: z.number().min(0).max(5),
  ratingCount: z.number().int().nonnegative(),
  notes: z.string().max(4000).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
