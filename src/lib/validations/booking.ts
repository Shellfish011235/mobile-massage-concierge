import { z } from "zod";
import { bookingStatusSchema, locationTypeSchema, valetPreferenceSchema } from "./enums";

export const bookingSchema = z.object({
  id: z.string().min(1),
  clientId: z.string().min(1),
  therapistId: z.string().min(1),
  serviceName: z.string().min(1),
  durationMinutes: z.number().int().positive().max(480),
  appointmentDateTime: z.string(),
  locationType: locationTypeSchema,
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  hotelName: z.string().nullable(),
  parkingNotes: z.string().nullable(),
  valetRequired: valetPreferenceSchema,
  clientNotes: z.string().nullable(),
  environmentConfirmed: z.boolean(),
  spaceConfirmed: z.boolean(),
  petsSecuredConfirmed: z.boolean(),
  quietSettingConfirmed: z.boolean(),
  cleanSurfaceConfirmed: z.boolean(),
  status: bookingStatusSchema,
  subtotal: z.number().nonnegative(),
  travelFee: z.number().nonnegative(),
  valetFee: z.number().nonnegative(),
  platformFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  therapistPayout: z.number().nonnegative(),
  estimatedArrivalAt: z.string().nullable(),
  cancelledAt: z.string().nullable(),
  cancelReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** Client booking request (before server assigns ids / pricing) */
export const bookingRequestSchema = z
  .object({
    therapistProfileId: z.string().min(1),
    serviceId: z.string().min(1),
    durationMinutes: z.number().int().positive(),
    appointmentDateTime: z.string().min(1),
    locationType: locationTypeSchema,
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(2).max(2),
    hotelName: z.string().optional(),
    parkingNotes: z.string().optional(),
    valetRequired: valetPreferenceSchema,
    clientNotes: z.string().optional(),
    environmentConfirmed: z.literal(true),
    spaceConfirmed: z.literal(true),
    petsSecuredConfirmed: z.literal(true),
    quietSettingConfirmed: z.literal(true),
    cleanSurfaceConfirmed: z.literal(true),
    selectedAddOnIds: z.array(z.string()).default([]),
  })
  .strict();

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
