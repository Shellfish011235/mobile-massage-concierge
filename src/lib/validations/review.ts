import { z } from "zod";
import { userRoleSchema } from "./enums";

const rating = z.number().int().min(1).max(5);

const reviewBaseSchema = z.object({
  id: z.string().min(1),
  bookingId: z.string().min(1),
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
  fromRole: userRoleSchema,
  toRole: userRoleSchema,
  comment: z.string().max(2000).nullable(),
  createdAt: z.string(),
});

export const clientReviewOfTherapistSchema = reviewBaseSchema.extend({
  kind: z.literal("client_to_therapist"),
  overallRating: rating,
  professionalismRating: rating,
  punctualityRating: rating,
  massageQualityRating: rating,
  cleanlinessSetupRating: rating,
  wouldBookAgain: z.boolean(),
});

export const therapistReviewOfClientSchema = reviewBaseSchema.extend({
  kind: z.literal("therapist_to_client"),
  overallRating: rating,
  professionalismRespectRating: rating,
  safetyRating: rating,
  locationReadinessRating: rating,
  parkingAccessRating: rating,
  environmentSuitabilityRating: rating,
  wouldAcceptAgain: z.boolean(),
});

export const reviewSchema = z.discriminatedUnion("kind", [
  clientReviewOfTherapistSchema,
  therapistReviewOfClientSchema,
]);

export const newClientReviewSchema = clientReviewOfTherapistSchema.omit({
  id: true,
  createdAt: true,
  fromUserId: true,
  fromRole: true,
  toRole: true,
});

export const newTherapistReviewSchema = therapistReviewOfClientSchema.omit({
  id: true,
  createdAt: true,
  fromUserId: true,
  fromRole: true,
  toRole: true,
});
