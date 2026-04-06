/**
 * Client-specific profile data (extends auth User).
 */

export interface SavedAddress {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string | null;
  /** For matching / travel estimates */
  lat: number | null;
  lng: number | null;
  isDefault: boolean;
}

export interface ClientProfile {
  id: string;
  userId: string;
  savedAddresses: SavedAddress[];
  ratingAverage: number;
  ratingCount: number;
  /** Internal / support notes — never expose to other clients */
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
