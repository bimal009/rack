import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";
import {
  membershipFeatureRefSchema,
  membershipSportRefSchema,
  relatedRefSchema,
} from "./membershipRefs";

export const membershipPlanVisibilityEnumSchema = z.enum([
  "Public",
  "Private",
  "Hidden",
]);
export type MembershipPlanVisibility = z.infer<
  typeof membershipPlanVisibilityEnumSchema
>;

export const membershipPlanBillingTypeEnumSchema = z.enum([
  "one_time",
  "weekly",
  "monthly",
  "quarterly",
  "annually",
  "custom",
]);
export type MembershipPlanBillingType = z.infer<
  typeof membershipPlanBillingTypeEnumSchema
>;

export const membershipPlanBillingUnitEnumSchema = z.enum([
  "day",
  "week",
  "month",
]);
export type MembershipPlanBillingUnit = z.infer<
  typeof membershipPlanBillingUnitEnumSchema
>;

export const membershipPlanCoverageEnumSchema = z.enum([
  "Full access",
  "Restricted",
]);
export type MembershipPlanCoverage = z.infer<
  typeof membershipPlanCoverageEnumSchema
>;

export const membershipPlanSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  name: z.string(),
  categoryId: z.string().uuid(),
  category: relatedRefSchema,
  visibility: membershipPlanVisibilityEnumSchema,
  description: z.string().nullable(),
  isActive: z.boolean(),

  pricePerPeriod: z.number(),
  billingType: membershipPlanBillingTypeEnumSchema,
  billingIntervalUnit: membershipPlanBillingUnitEnumSchema.nullable(),
  billingIntervalCount: z.number().int().nullable(),
  signupFee: z.number().nullable(),
  requirePaymentUpfront: z.boolean(),

  coverage: membershipPlanCoverageEnumSchema,
  coverageClasses: z.array(z.string()).nullable(),
  coverageAreas: z.array(z.string()).nullable(),
  coverageInstructors: z.array(z.string()).nullable(),
  noClasses: z.boolean(),
  noAreas: z.boolean(),
  noInstructors: z.boolean(),
  sessions: z.string().nullable(),

  sports: z.array(membershipSportRefSchema),
  features: z.array(membershipFeatureRefSchema),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type MembershipPlan = z.infer<typeof membershipPlanSchema>;

const uuidArray = z.array(z.string().uuid());

const membershipPlanFields = z.object({
  name: z.string().trim().min(2, "Enter a membership name").max(120),
  categoryId: z.string().uuid("Select a category"),
  visibility: membershipPlanVisibilityEnumSchema.default("Public"),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  isActive: z.boolean().default(true),

  pricePerPeriod: z
    .number()
    .int("Enter a valid price")
    .nonnegative("Enter a valid price"),
  billingType: membershipPlanBillingTypeEnumSchema,
  billingIntervalUnit: membershipPlanBillingUnitEnumSchema.optional(),
  billingIntervalCount: z
    .number()
    .int()
    .positive("Enter a valid period")
    .optional(),
  signupFee: z.number().int().nonnegative("Enter a valid fee").optional(),
  requirePaymentUpfront: z.boolean().default(true),

  coverage: membershipPlanCoverageEnumSchema.default("Full access"),
  coverageClasses: uuidArray.nullish(),
  coverageAreas: uuidArray.nullish(),
  coverageInstructors: uuidArray.nullish(),
  noClasses: z.boolean().default(false),
  noAreas: z.boolean().default(false),
  noInstructors: z.boolean().default(false),
  sessions: z.string().trim().max(60).optional().or(z.literal("")),

  sportIds: uuidArray.default([]),
  featureIds: uuidArray.default([]),
}).strict();

type BillingShape = {
  billingType?: MembershipPlanBillingType;
  billingIntervalUnit?: MembershipPlanBillingUnit;
  billingIntervalCount?: number;
};

const validateBilling = (val: BillingShape, ctx: z.RefinementCtx) => {
  if (val.billingType === undefined) return;

  if (val.billingType === "custom") {
    if (val.billingIntervalUnit == null) {
      ctx.addIssue({
        code: "custom",
        path: ["billingIntervalUnit"],
        message: "Choose a unit for custom billing",
      });
    }
    if (val.billingIntervalCount == null) {
      ctx.addIssue({
        code: "custom",
        path: ["billingIntervalCount"],
        message: "Enter a period for custom billing",
      });
    }
    return;
  }

  if (val.billingIntervalUnit != null || val.billingIntervalCount != null) {
    ctx.addIssue({
      code: "custom",
      path: ["billingType"],
      message: "Interval unit and period only apply to custom billing",
    });
  }
};

export const membershipPlanInsertSchema =
  membershipPlanFields.superRefine(validateBilling);
export type NewMembershipPlan = z.infer<typeof membershipPlanInsertSchema>;

export const membershipPlanUpdateSchema = membershipPlanFields
  .partial()
  .strict()
  .superRefine(validateBilling);
export type UpdateMembershipPlan = z.infer<typeof membershipPlanUpdateSchema>;

export const membershipPlanListQuerySchema = z
  .object({
    ...paginationFields,
    visibility: membershipPlanVisibilityEnumSchema.optional(),
    categoryId: z.string().uuid().optional(),
    isActive: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  })
  .strict();
export type MembershipPlanListQuery = z.infer<
  typeof membershipPlanListQuerySchema
>;
export type MembershipPlanListResponse = PaginatedResponse<MembershipPlan>;
