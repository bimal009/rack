import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";

export const productFeatureSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProductFeature = z.infer<typeof productFeatureSchema>;

export const productFeatureInsertSchema = z.object({
  name: z.string().trim().min(1, "Enter a feature name").max(100),
});

export type NewProductFeature = z.infer<typeof productFeatureInsertSchema>;

export const productFeatureUpdateSchema = productFeatureInsertSchema.partial();

export type UpdateProductFeature = z.infer<typeof productFeatureUpdateSchema>;

export const productFeatureListQuerySchema = z.object({ ...paginationFields });

export type ProductFeatureListQuery = z.infer<
  typeof productFeatureListQuerySchema
>;

export type ProductFeatureListResponse = PaginatedResponse<ProductFeature>;
