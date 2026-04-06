import { z } from "zod";
import { userRoleSchema } from "./enums";

export const userSchema = z.object({
  id: z.string().min(1),
  role: userRoleSchema,
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(32).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserParsed = z.infer<typeof userSchema>;
