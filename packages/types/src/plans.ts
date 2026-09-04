import { z } from "zod";

export const planSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),

  monthlyPrice: z.number(),
  yearlyPrice: z.number().nullable(),
  discountPercent: z.number(),

  maxMembers: z.number().nullable(),
  durationDays: z.number().nullable(),
  trialDays: z.number(),

  smsEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  reportsEnabled: z.boolean(),
  inventoryEnabled: z.boolean(),
  staffEnabled: z.boolean(),
  websiteEnabled: z.boolean(),
  reEngagementEnabled: z.boolean(),
  attendanceEnabled: z.boolean(),
  doorLockEnabled: z.boolean(),

  isActive: z.boolean(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Plan = z.infer<typeof planSchema>;
