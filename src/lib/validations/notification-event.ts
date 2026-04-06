import { z } from "zod";
import { notificationEventTypeSchema } from "./enums";

const dataValue = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const notificationEventSchema = z.object({
  id: z.string().min(1),
  bookingId: z.string().nullable(),
  type: notificationEventTypeSchema,
  title: z.string().min(1),
  body: z.string().min(1),
  recipientUserId: z.string().min(1),
  read: z.boolean(),
  data: z.record(z.string(), dataValue).nullable(),
  createdAt: z.string(),
});
