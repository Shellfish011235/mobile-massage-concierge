export type VerificationDocumentType = "license" | "insurance" | "other";

export type VerificationDocumentStatus = "pending" | "approved" | "rejected";

export interface VerificationDocument {
  id: string;
  therapistProfileId: string;
  type: VerificationDocumentType;
  storagePath: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  reviewedAt: string | null;
  status: VerificationDocumentStatus;
  reviewNotes: string | null;
}
