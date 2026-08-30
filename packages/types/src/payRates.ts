import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";

export const payRateTypeEnumSchema = z.enum(["class", "individual"]);
export type PayRateType = z.infer<typeof payRateTypeEnumSchema>;

export const payRateEntranceMethodEnumSchema = z.enum([
  "All entrance methods",
  "Direct payment",
  "Any membership",
  "Any external program",
]);
export type PayRateEntranceMethod = z.infer<typeof payRateEntranceMethodEnumSchema>;

export const payRateSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  type: payRateTypeEnumSchema,
  name: z.string(),
  perClassRate: z.number().nullable(),
  perPersonRate: z.number().nullable(),
  perSessionRate: z.number().nullable(),
  revenueSharePercent: z.number().nullable(),
  compensateUnpaidBookings: z.boolean(),
  classTypeId: z.string().uuid().nullable(),
  instructorTypeId: z.string().uuid().nullable(),
  entranceMethod: payRateEntranceMethodEnumSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type PayRate = z.infer<typeof payRateSchema>;

const rate = z.number().nonnegative().optional();

const optionalUuid = z
  .union([z.string().uuid(), z.literal(""), z.null()])
  .optional()
  .transform((value) => (value ? value : null));

const payRateInsertObject = z.object({
  type: payRateTypeEnumSchema,
  name: z.string().trim().min(1, "Enter a policy name").max(120),
  perClassRate: rate,
  perPersonRate: rate,
  perSessionRate: rate,
  revenueSharePercent: z.number().min(0).max(100).optional(),
  compensateUnpaidBookings: z.boolean().default(false),
  classTypeId: optionalUuid,
  instructorTypeId: optionalUuid,
  entranceMethod: payRateEntranceMethodEnumSchema.default("All entrance methods"),
});

export const payRateInsertSchema = payRateInsertObject.superRefine((data, ctx) => {
  if (data.type === "class") {
    if (
      data.perClassRate == null &&
      data.perPersonRate == null &&
      data.revenueSharePercent == null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["perClassRate"],
        message: "Set a per-class, per-person, or revenue-share rate",
      });
    }
    return;
  }

  if (data.perSessionRate == null && data.revenueSharePercent == null) {
    ctx.addIssue({
      code: "custom",
      path: ["perSessionRate"],
      message: "Set a per-session or revenue-share rate",
    });
  }

  if (data.classTypeId) {
    ctx.addIssue({
      code: "custom",
      path: ["classTypeId"],
      message: "Individual training rates do not apply to a class type",
    });
  }
});
export type NewPayRate = z.infer<typeof payRateInsertSchema>;

export const payRateUpdateSchema = payRateInsertObject.partial();
export type UpdatePayRate = z.infer<typeof payRateUpdateSchema>;

export const payRateListQuerySchema = z.object({
  ...paginationFields,
  type: payRateTypeEnumSchema.optional(),
});
export type PayRateListQuery = z.infer<typeof payRateListQuerySchema>;
export type PayRateListResponse = PaginatedResponse<PayRate>;
