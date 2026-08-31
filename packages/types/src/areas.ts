import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";

export const areaVisibilityEnumSchema = z.enum(["Public", "Private", "Hidden"]);
export type AreaVisibility = z.infer<typeof areaVisibilityEnumSchema>;

export const areaStatusEnumSchema = z.enum(["Active", "Inactive"]);
export type AreaStatus = z.infer<typeof areaStatusEnumSchema>;

export const areaSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  areaTypeId: z.string().uuid().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  images: z.array(z.string()),
  pricePerHour: z.number(),
  maxConcurrentBookings: z.number().int(),
  visibility: areaVisibilityEnumSchema,
  status: areaStatusEnumSchema,
  attributes: z.array(z.string()),
  areaType: z
    .object({ id: z.string().uuid(), name: z.string() })
    .nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Area = z.infer<typeof areaSchema>;

const optionalAreaTypeId = z
  .union([z.string().uuid(), z.literal(""), z.null()])
  .optional()
  .transform((value) => (value ? value : null));

export const areaInsertSchema = z.object({
  name: z.string().trim().min(1, "Enter an area name").max(120),
  areaTypeId: optionalAreaTypeId,
  description: z.string().trim().max(1000).optional(),
  images: z.array(z.string()).default([]),
  pricePerHour: z.number().nonnegative("Enter a valid price").default(0),
  maxConcurrentBookings: z
    .number()
    .int()
    .positive("Must be at least 1")
    .default(1),
  visibility: areaVisibilityEnumSchema.default("Public"),
  status: areaStatusEnumSchema.default("Active"),
  attributes: z.array(z.string()).default([]),
});
export type NewArea = z.infer<typeof areaInsertSchema>;

export const areaUpdateSchema = areaInsertSchema.partial();
export type UpdateArea = z.infer<typeof areaUpdateSchema>;

export const areaListQuerySchema = z.object({
  ...paginationFields,
  status: areaStatusEnumSchema.optional(),
  areaTypeId: z.string().uuid().optional(),
});
export type AreaListQuery = z.infer<typeof areaListQuerySchema>;
export type AreaListResponse = PaginatedResponse<Area>;
