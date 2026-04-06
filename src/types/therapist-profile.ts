import type { ServiceOffering } from "./service-offering";

/**
 * Therapist-facing profile and marketplace visibility fields.
 */

export type AvailabilityStatus = "on_duty" | "off_duty" | "busy";

export interface TherapistProfile {
  id: string;
  userId: string;
  displayName: string;
  photoUrl: string | null;
  bio: string | null;
  yearsExperience: number | null;
  licenseNumber: string | null;
  licenseVerified: boolean;
  insuranceVerified: boolean;
  licenseDocumentUrl: string | null;
  insuranceDocumentUrl: string | null;
  specialties: string[];
  certifications: string[];
  services: ServiceOffering[];
  travelRadiusMiles: number;
  acceptsHome: boolean;
  acceptsHotel: boolean;
  acceptsOffice: boolean;
  acceptsEvents: boolean;
  acceptsValetJobs: boolean;
  availabilityStatus: AvailabilityStatus;
  ratingAverage: number;
  ratingCount: number;
  /** Admin gate — only approved therapists appear in client discovery */
  isApproved: boolean;
  city: string | null;
  state: string | null;
  /** Therapist-controlled visibility (e.g. pause bookings without losing approval) */
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Card/list discovery — optional distance when computed client-side or via API */
export interface TherapistProfileSummary
  extends Pick<
    TherapistProfile,
    | "id"
    | "userId"
    | "displayName"
    | "photoUrl"
    | "specialties"
    | "yearsExperience"
    | "availabilityStatus"
    | "ratingAverage"
    | "ratingCount"
    | "licenseVerified"
    | "insuranceVerified"
    | "travelRadiusMiles"
    | "acceptsHome"
    | "acceptsHotel"
    | "acceptsOffice"
    | "acceptsEvents"
    | "active"
    | "isApproved"
  > {
  /** Lowest display price among services, if precomputed */
  priceStartingAt: number | null;
  /** Miles from client when known */
  distanceMiles: number | null;
}
