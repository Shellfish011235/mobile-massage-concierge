import type { UserRole } from "./user";

/**
 * Dual ratings: client → therapist and therapist → client.
 * Use discriminated `kind` for type-safe forms and persistence.
 */

export type ReviewKind = "client_to_therapist" | "therapist_to_client";

interface ReviewBase {
  id: string;
  bookingId: string;
  fromUserId: string;
  toUserId: string;
  fromRole: UserRole;
  toRole: UserRole;
  comment: string | null;
  createdAt: string;
}

/** After session — client rates licensed professional on the platform */
export interface ClientReviewOfTherapist extends ReviewBase {
  kind: "client_to_therapist";
  overallRating: number;
  professionalismRating: number;
  punctualityRating: number;
  massageQualityRating: number;
  cleanlinessSetupRating: number;
  wouldBookAgain: boolean;
}

/** After session — therapist rates booking experience */
export interface TherapistReviewOfClient extends ReviewBase {
  kind: "therapist_to_client";
  overallRating: number;
  professionalismRespectRating: number;
  safetyRating: number;
  locationReadinessRating: number;
  parkingAccessRating: number;
  environmentSuitabilityRating: number;
  wouldAcceptAgain: boolean;
}

export type Review = ClientReviewOfTherapist | TherapistReviewOfClient;

/** Payload shapes for create-review forms (ids filled server-side) */
export type NewClientReviewOfTherapist = Omit<
  ClientReviewOfTherapist,
  "id" | "createdAt" | "fromUserId" | "fromRole" | "toRole"
> & {
  toUserId: string;
};

export type NewTherapistReviewOfClient = Omit<
  TherapistReviewOfClient,
  "id" | "createdAt" | "fromUserId" | "fromRole" | "toRole"
> & {
  toUserId: string;
};
