import { z } from "zod";

export const gymMembershipAssignmentSchema = z.object({
  planId: z.string().uuid("Select a plan"),
  status: z.enum(["Active", "Paused", "Expired", "Cancelled"]).default("Active"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  price: z.number().int("Enter a valid price").nonnegative("Enter a valid price"),
  signupFee: z.number().int().nonnegative().nullable().optional(),
  extendedDays: z.number().int().nonnegative().default(0),
  extensionReason: z.string().trim().max(300).optional().or(z.literal("")),
});

export type GymMembershipAssignment = z.infer<typeof gymMembershipAssignmentSchema>;
