import { z } from "zod";

export const relatedRefSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});
export type RelatedRef = z.infer<typeof relatedRefSchema>;

// Shape returned by the membership plan's relational query `with`: the
// junction row plus its resolved sport/feature ref.
export const membershipSportRefSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  membershipId: z.string().uuid(),
  sportId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sport: relatedRefSchema,
});
export type MembershipSportRef = z.infer<typeof membershipSportRefSchema>;

export const membershipFeatureRefSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  membershipId: z.string().uuid(),
  featureId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  feature: relatedRefSchema,
});
export type MembershipFeatureRef = z.infer<typeof membershipFeatureRefSchema>;
