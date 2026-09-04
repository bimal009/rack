import { z } from "zod";

export const relatedRefSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});
export type RelatedRef = z.infer<typeof relatedRefSchema>;

// Shape returned by the gym plan's relational query `with`: the junction row
// plus its resolved sport/feature ref.
export const gymPlanSportRefSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  planId: z.string().uuid(),
  sportId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sport: relatedRefSchema,
});
export type GymPlanSportRef = z.infer<typeof gymPlanSportRefSchema>;

export const gymPlanFeatureRefSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  planId: z.string().uuid(),
  featureId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  feature: relatedRefSchema,
});
export type GymPlanFeatureRef = z.infer<typeof gymPlanFeatureRefSchema>;
