/**
 * Admin workflow helpers (queue rows, audit — extend as needed).
 */

export type TherapistVerificationDecision = "pending" | "approved" | "rejected";

export interface TherapistVerificationQueueItem {
  therapistProfileId: string;
  userId: string;
  displayName: string;
  submittedAt: string;
  licenseDocumentUrl: string | null;
  insuranceDocumentUrl: string | null;
  status: TherapistVerificationDecision;
  reviewedAt: string | null;
  reviewedByAdminUserId: string | null;
  reviewNotes: string | null;
}
