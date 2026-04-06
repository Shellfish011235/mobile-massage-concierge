/**
 * Core user record — aligns with auth provider user id (e.g. Supabase auth.users).
 */

export type UserRole = "client" | "therapist" | "admin";

export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}
