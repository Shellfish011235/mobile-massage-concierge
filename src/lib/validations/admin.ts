import { z } from "zod";
import { therapistVerificationDecisionSchema } from "./enums";

export const therapistVerificationQueueItemSchema = z.object({
  therapistProfileId: z.string().min(1),
  userId: z.string().min(1),
  displayName: z.string().min(1),
  submittedAt: z.string(),
  licenseDocumentUrl: z.string().nullable(),
  insuranceDocumentUrl: z.string().nullable(),
  status: therapistVerificationDecisionSchema,
  reviewedAt: z.string().nullable(),
  reviewedByAdminUserId: z.string().nullable(),
  reviewNotes: z.string().max(2000).nullable(),
});
