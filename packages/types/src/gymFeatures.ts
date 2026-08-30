import { z } from "zod";
import { paginationFields, type PaginatedResponse } from "./pagination";

export const gymFeatureSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GymFeature = z.infer<typeof gymFeatureSchema>;

export const gymFeatureInsertSchema = z.object({
  name: z.string().trim().min(1, "Enter a feature name").max(100),
});

export type NewGymFeature = z.infer<typeof gymFeatureInsertSchema>;

export const gymFeatureUpdateSchema = gymFeatureInsertSchema.partial();

export type UpdateGymFeature = z.infer<typeof gymFeatureUpdateSchema>;

export const gymFeatureListQuerySchema = z.object({ ...paginationFields });

export type GymFeatureListQuery = z.infer<typeof gymFeatureListQuerySchema>;

export type GymFeatureListResponse = PaginatedResponse<GymFeature>;
