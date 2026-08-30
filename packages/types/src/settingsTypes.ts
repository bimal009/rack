import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";

const rowBase = {
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
};

const nameField = z.string().trim().min(1, "Enter a name").max(120);

const optionalDescription = z.string().trim().max(1000).optional();

const sportsField = z.array(z.string()).optional();
const positiveInt = z.number().int().positive().optional();
const nonNegativeInt = z.number().int().nonnegative().optional();
const booking = z.boolean().optional();

export const areaTypeSchema = z.object({
  ...rowBase,
  name: z.string(),
  description: z.string().nullable(),
  sports: z.array(z.string()),
  availableForBooking: z.boolean(),
  pricePerHour: z.number(),
  maxPlayers: z.number().int(),
  maxConcurrentBookings: z.number().int(),
});
export type AreaType = z.infer<typeof areaTypeSchema>;

export const areaTypeInsertSchema = z.object({
  name: nameField,
  description: optionalDescription,
  sports: sportsField,
  availableForBooking: booking,
  pricePerHour: nonNegativeInt,
  maxPlayers: positiveInt,
  maxConcurrentBookings: positiveInt,
});
export type NewAreaType = z.infer<typeof areaTypeInsertSchema>;
export const areaTypeUpdateSchema = areaTypeInsertSchema.partial();
export type UpdateAreaType = z.infer<typeof areaTypeUpdateSchema>;

export const instructorTypeSchema = z.object({
  ...rowBase,
  name: z.string(),
  description: z.string().nullable(),
  maxConcurrentBookings: z.number().int(),
});
export type InstructorTypeRecord = z.infer<typeof instructorTypeSchema>;

export const instructorTypeInsertSchema = z.object({
  name: nameField,
  description: optionalDescription,
  maxConcurrentBookings: positiveInt,
});
export type NewInstructorType = z.infer<typeof instructorTypeInsertSchema>;
export const instructorTypeUpdateSchema = instructorTypeInsertSchema.partial();
export type UpdateInstructorType = z.infer<typeof instructorTypeUpdateSchema>;

export const classTypeSchema = z.object({
  ...rowBase,
  name: z.string(),
  description: z.string().nullable(),
  sports: z.array(z.string()),
  availableForBooking: z.boolean(),
  pricePerClass: z.number(),
  maxParticipants: z.number().int(),
  maxConcurrentBookings: z.number().int(),
});
export type ClassType = z.infer<typeof classTypeSchema>;

export const classTypeInsertSchema = z.object({
  name: nameField,
  description: optionalDescription,
  sports: sportsField,
  availableForBooking: booking,
  pricePerClass: nonNegativeInt,
  maxParticipants: positiveInt,
  maxConcurrentBookings: positiveInt,
});
export type NewClassType = z.infer<typeof classTypeInsertSchema>;
export const classTypeUpdateSchema = classTypeInsertSchema.partial();
export type UpdateClassType = z.infer<typeof classTypeUpdateSchema>;

export const brandSchema = z.object({
  ...rowBase,
  name: z.string(),
});
export type Brand = z.infer<typeof brandSchema>;

export const brandInsertSchema = z.object({ name: nameField });
export type NewBrand = z.infer<typeof brandInsertSchema>;
export const brandUpdateSchema = brandInsertSchema.partial();
export type UpdateBrand = z.infer<typeof brandUpdateSchema>;

export const productCategorySchema = z.object({
  ...rowBase,
  name: z.string(),
});
export type ProductCategory = z.infer<typeof productCategorySchema>;

export const productCategoryInsertSchema = z.object({ name: nameField });
export type NewProductCategory = z.infer<typeof productCategoryInsertSchema>;
export const productCategoryUpdateSchema = productCategoryInsertSchema.partial();
export type UpdateProductCategory = z.infer<typeof productCategoryUpdateSchema>;

export const taxRateSchema = z.object({
  ...rowBase,
  name: z.string(),
  rate: z.number(),
});
export type TaxRate = z.infer<typeof taxRateSchema>;

export const taxRateInsertSchema = z.object({
  name: nameField,
  rate: z.number().min(0).max(100).optional(),
});
export type NewTaxRate = z.infer<typeof taxRateInsertSchema>;
export const taxRateUpdateSchema = taxRateInsertSchema.partial();
export type UpdateTaxRate = z.infer<typeof taxRateUpdateSchema>;

export const membershipCategorySchema = z.object({
  ...rowBase,
  name: z.string(),
});
export type MembershipCategory = z.infer<typeof membershipCategorySchema>;

export const membershipCategoryInsertSchema = z.object({ name: nameField });
export type NewMembershipCategory = z.infer<
  typeof membershipCategoryInsertSchema
>;
export const membershipCategoryUpdateSchema =
  membershipCategoryInsertSchema.partial();
export type UpdateMembershipCategory = z.infer<
  typeof membershipCategoryUpdateSchema
>;

export const areaTypeListQuerySchema = z.object({ ...paginationFields });
export type AreaTypeListQuery = z.infer<typeof areaTypeListQuerySchema>;
export type AreaTypeListResponse = PaginatedResponse<AreaType>;

export const instructorTypeListQuerySchema = z.object({ ...paginationFields });
export type InstructorTypeListQuery = z.infer<typeof instructorTypeListQuerySchema>;
export type InstructorTypeListResponse = PaginatedResponse<InstructorTypeRecord>;

export const classTypeListQuerySchema = z.object({ ...paginationFields });
export type ClassTypeListQuery = z.infer<typeof classTypeListQuerySchema>;
export type ClassTypeListResponse = PaginatedResponse<ClassType>;

export const brandListQuerySchema = z.object({ ...paginationFields });
export type BrandListQuery = z.infer<typeof brandListQuerySchema>;
export type BrandListResponse = PaginatedResponse<Brand>;

export const productCategoryListQuerySchema = z.object({ ...paginationFields });
export type ProductCategoryListQuery = z.infer<typeof productCategoryListQuerySchema>;
export type ProductCategoryListResponse = PaginatedResponse<ProductCategory>;

export const taxRateListQuerySchema = z.object({ ...paginationFields });
export type TaxRateListQuery = z.infer<typeof taxRateListQuerySchema>;
export type TaxRateListResponse = PaginatedResponse<TaxRate>;

export const membershipCategoryListQuerySchema = z.object({
  ...paginationFields,
});
export type MembershipCategoryListQuery = z.infer<
  typeof membershipCategoryListQuerySchema
>;
export type MembershipCategoryListResponse =
  PaginatedResponse<MembershipCategory>;
