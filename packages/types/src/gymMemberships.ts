import { MemberWithUser, memberWithUserSchema } from './members';
import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";
import { relatedRefSchema } from "./gymPlanRefs";
import { planSchema } from './plans';

export const gymMembershipStatusEnumSchema = z.enum([
  "Active",
  "Paused",
  "Expired",
  "Cancelled",
]);
export type GymMembershipStatus = z.infer<typeof gymMembershipStatusEnumSchema>;

export const gymMembershipSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  memberId: z.string().uuid(),
  planId: z.string().uuid(),

  status: gymMembershipStatusEnumSchema,

  startDate: z.string(),
  endDate: z.string(),
  price: z.number(),
  signupFee: z.number().nullable(),

  extendedDays: z.number().int(),
  extensionReason: z.string().nullable(),
  pausedAt: z.date().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type GymMembership = z.infer<typeof gymMembershipSchema>;

export const gymMembershipWithRefsSchema = gymMembershipSchema.extend({
  member: relatedRefSchema,
  plan: relatedRefSchema,
});
export type GymMembershipWithRefs = z.infer<typeof gymMembershipWithRefsSchema>;

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date");

export const gymMembershipAssignmentSchema = z.object({
  planId: z.string().uuid("Select a plan"),
  status: gymMembershipStatusEnumSchema.default("Active"),
  startDate: dateString,
  price: z.number().int("Enter a valid price").nonnegative("Enter a valid price"),
  signupFee: z.number().int().nonnegative().nullable().optional(),
  extendedDays: z.number().int().nonnegative().default(0),
  extensionReason: z.string().trim().max(300).optional().or(z.literal("")),
});
export type GymMembershipAssignment = z.infer<typeof gymMembershipAssignmentSchema>;

const gymMembershipFields = gymMembershipAssignmentSchema
  .extend({
    memberId: z.string().uuid("Select a member"),
  })
  .strict();

export const gymMembershipInsertSchema = gymMembershipFields;
export type NewGymMembership = z.infer<typeof gymMembershipInsertSchema>;

export const gymMembershipUpdateSchema = gymMembershipFields.partial().strict();
export type UpdateGymMembership = z.infer<typeof gymMembershipUpdateSchema>;

export const gymMembershipExtendSchema = z
  .object({
    days: z.number().int().positive("Enter a number of days"),
    reason: z.string().trim().max(300).optional().or(z.literal("")),
  })
  .strict();
export type ExtendGymMembership = z.infer<typeof gymMembershipExtendSchema>;

export const gymMembershipListQuerySchema = z
  .object({
    ...paginationFields,
    status: gymMembershipStatusEnumSchema.optional(),
    memberId: z.string().uuid().optional(),
    planId: z.string().uuid().optional(),
    planCategoryId: z.string().uuid().optional(),
  })
  .strict();
export type GymMembershipListQuery = z.infer<typeof gymMembershipListQuerySchema>;
export type GymMembershipListResponse = PaginatedResponse<GymMembershipWithRefs>;

export const gymMembershipWithMemberAndPlanSchema = gymMembershipSchema.extend({
  member: memberWithUserSchema,
  plan: planSchema,
})
export type GymMembershipWithMemberAndPlan = z.infer<typeof gymMembershipWithMemberAndPlanSchema>