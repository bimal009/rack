import {
  GymFeatureListQuery,
  NewGymFeature,
  UpdateGymFeature,
  gymFeatureInsertSchema,
  gymFeatureUpdateSchema,
} from "@repo/types";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { gymFeature } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listFeatures = async (
  gymId: string,
  query: GymFeatureListQuery
) => {
  const { page, limit, search, sortOrder } = query;

  const [data, total] = await Promise.all([
    db.query.gymFeature.findMany({
      where: {
        gymId,
        name: search ? { ilike: `%${search}%` } : undefined,
      },
      orderBy: { name: sortOrder },
      limit,
      offset: (page - 1) * limit,
    }),
    db.$count(
      gymFeature,
      and(
        eq(gymFeature.gymId, gymId),
        search ? ilike(gymFeature.name, `%${search}%`) : undefined
      )
    ),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const createFeature = async (gymId: string, input: NewGymFeature) => {
  const result = gymFeatureInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid feature", result.error.flatten());
  }

  const [record] = await db
    .insert(gymFeature)
    .values({ gymId, name: result.data.name })
    .returning();

  return record;
};

export const updateFeature = async (
  gymId: string,
  id: string,
  input: UpdateGymFeature
) => {
  const result = gymFeatureUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid feature", result.error.flatten());
  }

  const [record] = await db
    .update(gymFeature)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(gymFeature.gymId, gymId), eq(gymFeature.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Feature not found");
  return record;
};

export const deleteFeature = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(gymFeature)
    .where(and(eq(gymFeature.gymId, gymId), eq(gymFeature.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Feature not found");
  return record;
};
