import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";
import {
  gymPlanFeatureRefSchema,
  gymPlanSportRefSchema,
  relatedRefSchema,
} from "./gymPlanRefs";
import { openingHoursSchema } from "./gyms";

export const gymPlanVisibilityEnumSchema = z.enum([
  "Public",
  "Private",
  "Hidden",
]);
export type GymPlanVisibility = z.infer<typeof gymPlanVisibilityEnumSchema>;

export const gymPlanBillingTypeEnumSchema = z.enum([
  "one_time",
  "weekly",
  "monthly",
  "quarterly",
  "annually",
  "custom",
]);
export type GymPlanBillingType = z.infer<typeof gymPlanBillingTypeEnumSchema>;

export const gymPlanBillingUnitEnumSchema = z.enum(["day", "week", "month"]);
export type GymPlanBillingUnit = z.infer<typeof gymPlanBillingUnitEnumSchema>;

export const gymPlanCoverageEnumSchema = z.enum(["Full access", "Restricted"]);
export type GymPlanCoverage = z.infer<typeof gymPlanCoverageEnumSchema>;

export const gymPlanSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  name: z.string(),
  categoryId: z.string().uuid(),
  category: relatedRefSchema,
  visibility: gymPlanVisibilityEnumSchema,
  description: z.string().nullable(),
  isActive: z.boolean(),

  pricePerPeriod: z.number(),
  billingType: gymPlanBillingTypeEnumSchema,
  billingIntervalUnit: gymPlanBillingUnitEnumSchema.nullable(),
  billingIntervalCount: z.number().int().nullable(),
  signupFee: z.number().nullable(),
  requirePaymentUpfront: z.boolean(),

  coverage: gymPlanCoverageEnumSchema,
  coverageClasses: z.array(z.string()).nullable(),
  coverageAreas: z.array(z.string()).nullable(),
  coverageInstructors: z.array(z.string()).nullable(),
  noClasses: z.boolean(),
  noAreas: z.boolean(),
  noInstructors: z.boolean(),
  sessions: z.string().nullable(),

  sports: z.array(gymPlanSportRefSchema),
  features: z.array(gymPlanFeatureRefSchema),

  operatingHourOverrides: openingHoursSchema,

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type GymPlan = z.infer<typeof gymPlanSchema>;

const uuidArray = z.array(z.string().uuid());

const gymPlanFields = z
  .object({
    name: z.string().trim().min(2, "Enter a plan name").max(120),
    categoryId: z.string().uuid("Select a category"),
    visibility: gymPlanVisibilityEnumSchema.default("Public"),
    description: z.string().trim().max(300).optional().or(z.literal("")),
    isActive: z.boolean().default(true),

    pricePerPeriod: z
      .number()
      .int("Enter a valid price")
      .nonnegative("Enter a valid price"),
    billingType: gymPlanBillingTypeEnumSchema,
    billingIntervalUnit: gymPlanBillingUnitEnumSchema.optional(),
    billingIntervalCount: z
      .number()
      .int()
      .positive("Enter a valid period")
      .optional(),
    signupFee: z.number().int().nonnegative("Enter a valid fee").optional(),
    requirePaymentUpfront: z.boolean().default(true),

    coverage: gymPlanCoverageEnumSchema.default("Full access"),
    coverageClasses: uuidArray.nullish(),
    coverageAreas: uuidArray.nullish(),
    coverageInstructors: uuidArray.nullish(),
    noClasses: z.boolean().default(false),
    noAreas: z.boolean().default(false),
    noInstructors: z.boolean().default(false),
    sessions: z.string().trim().max(60).optional().or(z.literal("")),

    sportIds: uuidArray.default([]),
    featureIds: uuidArray.default([]),

    operatingHourOverrides: openingHoursSchema.default([]),
  })
  .strict();

type BillingShape = {
  billingType?: GymPlanBillingType;
  billingIntervalUnit?: GymPlanBillingUnit;
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

export const gymPlanInsertSchema = gymPlanFields.superRefine(validateBilling);
export type NewGymPlan = z.infer<typeof gymPlanInsertSchema>;

export const gymPlanUpdateSchema = gymPlanFields
  .partial()
  .strict()
  .superRefine(validateBilling);
export type UpdateGymPlan = z.infer<typeof gymPlanUpdateSchema>;

export const gymPlanListQuerySchema = z
  .object({
    ...paginationFields,
    visibility: gymPlanVisibilityEnumSchema.optional(),
    categoryId: z.string().uuid().optional(),
    isActive: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  })
  .strict();
export type GymPlanListQuery = z.infer<typeof gymPlanListQuerySchema>;
export type GymPlanListResponse = PaginatedResponse<GymPlan>;
