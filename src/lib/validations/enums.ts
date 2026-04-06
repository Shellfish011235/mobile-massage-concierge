import { z } from "zod";

export const userRoleSchema = z.enum(["client", "therapist", "admin"]);

export const bookingStatusSchema = z.enum([
  "requested",
  "accepted",
  "therapist_preparing",
  "en_route",
  "arriving_soon",
  "arrived",
  "in_session",
  "completed",
  "cancelled",
]);

export const locationTypeSchema = z.enum(["home", "hotel", "office", "event"]);

export const valetPreferenceSchema = z.enum(["yes", "no", "not_sure"]);

export const availabilityStatusSchema = z.enum(["on_duty", "off_duty", "busy"]);

export const pricingTypeSchema = z.enum(["flat", "duration_based", "service_specific"]);

export const reviewKindSchema = z.enum(["client_to_therapist", "therapist_to_client"]);

export const notificationEventTypeSchema = z.enum([
  "booking_requested",
  "booking_accepted",
  "booking_declined",
  "therapist_preparing",
  "therapist_en_route",
  "therapist_arriving_soon",
  "therapist_arrived",
  "session_started",
  "session_completed",
  "booking_cancelled",
  "review_requested",
  "verification_approved",
  "verification_rejected",
]);

export const verificationDocumentTypeSchema = z.enum(["license", "insurance", "other"]);

export const verificationDocumentStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const therapistVerificationDecisionSchema = z.enum(["pending", "approved", "rejected"]);
