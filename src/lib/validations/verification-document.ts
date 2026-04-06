import { z } from "zod";
import { verificationDocumentTypeSchema, verificationDocumentStatusSchema } from "./enums";

export const verificationDocumentSchema = z.object({
  id: z.string().min(1),
  therapistProfileId: z.string().min(1),
  type: verificationDocumentTypeSchema,
  storagePath: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  uploadedAt: z.string(),
  reviewedAt: z.string().nullable(),
  status: verificationDocumentStatusSchema,
  reviewNotes: z.string().max(2000).nullable(),
});
