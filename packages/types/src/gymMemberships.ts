import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";
import { relatedRefSchema } from "./gymPlanRefs";

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
  pricePaid: z.number(),

  extendedDays: z.number().int(),
  extensionReason: z.string().nullable(),

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

const gymMembershipFields = z
  .object({
    memberId: z.string().uuid("Select a member"),
    planId: z.string().uuid("Select a plan"),
    status: gymMembershipStatusEnumSchema.default("Active"),

    startDate: dateString,
    endDate: dateString,
    pricePaid: z.number().int("Enter a valid price").nonnegative("Enter a valid price"),

    extendedDays: z.number().int().nonnegative().default(0),
    extensionReason: z.string().trim().max(300).optional().or(z.literal("")),
  })
  .strict();

const validateDateRange = (
  val: { startDate?: string; endDate?: string },
  ctx: z.RefinementCtx
) => {
  if (!val.startDate || !val.endDate) return;
  if (val.endDate < val.startDate) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message: "End date must be on or after the start date",
    });
  }
};

export const gymMembershipInsertSchema =
  gymMembershipFields.superRefine(validateDateRange);
export type NewGymMembership = z.infer<typeof gymMembershipInsertSchema>;

export const gymMembershipUpdateSchema = gymMembershipFields
  .partial()
  .strict()
  .superRefine(validateDateRange);
export type UpdateGymMembership = z.infer<typeof gymMembershipUpdateSchema>;

export const gymMembershipListQuerySchema = z
  .object({
    ...paginationFields,
    status: gymMembershipStatusEnumSchema.optional(),
    memberId: z.string().uuid().optional(),
    planId: z.string().uuid().optional(),
  })
  .strict();
export type GymMembershipListQuery = z.infer<typeof gymMembershipListQuerySchema>;
export type GymMembershipListResponse = PaginatedResponse<GymMembershipWithRefs>;
