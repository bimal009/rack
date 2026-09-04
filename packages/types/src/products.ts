import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";
import { relatedRefSchema } from "./gymPlanRefs";

export const productVisibilityEnumSchema = z.enum([
  "Public",
  "Private",
  "Hidden",
]);
export type ProductVisibility = z.infer<typeof productVisibilityEnumSchema>;

const taxRateRefSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  rate: z.number(),
});

export const productSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  name: z.string(),
  categoryId: z.string().uuid(),
  category: relatedRefSchema,
  brandId: z.string().uuid().nullable(),
  brand: relatedRefSchema.nullable(),
  sku: z.string().nullable(),
  visibility: productVisibilityEnumSchema,
  isActive: z.boolean(),

  price: z.number(),
  costPrice: z.number().nullable(),
  taxRateId: z.string().uuid().nullable(),
  taxRate: taxRateRefSchema.nullable(),

  description: z.string().nullable(),
  features: z.array(z.string()),
  images: z.array(z.string()),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Product = z.infer<typeof productSchema>;

const productFields = z
  .object({
    name: z.string().trim().min(2, "Enter a product name").max(120),
    categoryId: z.string().uuid("Select a category"),
    brandId: z.string().uuid().optional(),
    sku: z.string().trim().max(80).optional().or(z.literal("")),
    visibility: productVisibilityEnumSchema.default("Public"),
    isActive: z.boolean().default(true),

    price: z.number().int("Enter a valid price").positive("Enter a valid price"),
    costPrice: z.number().int().nonnegative("Enter a valid cost").optional(),
    taxRateId: z.string().uuid().optional(),

    description: z.string().trim().max(300).optional().or(z.literal("")),
    features: z.array(z.string().trim().min(1)).default([]),
    images: z.array(z.string()).default([]),
  })
  .strict();

export const productInsertSchema = productFields;
export type NewProduct = z.infer<typeof productInsertSchema>;

export const productUpdateSchema = productFields.partial().strict();
export type UpdateProduct = z.infer<typeof productUpdateSchema>;

export const productListQuerySchema = z
  .object({
    ...paginationFields,
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional(),
    feature: z.string().trim().min(1).optional(),
    visibility: productVisibilityEnumSchema.optional(),
    isActive: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  })
  .strict();
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type ProductListResponse = PaginatedResponse<Product>;
