import {
  GymFeatureListQuery,
  NewGymFeature,
  UpdateGymFeature,
  gymFeatureInsertSchema,
  gymFeatureUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { gymFeature } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listFeatures = async (
  gymId: string,
  query: GymFeatureListQuery
) => {
  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(gymFeature.gymId, gymId),
    search ? ilike(gymFeature.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(gymFeature)
      .where(where)
      .orderBy(sortOrder === "asc" ? asc(gymFeature.name) : desc(gymFeature.name))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(gymFeature).where(where),
  ]);

  const total = totalRow?.total ?? 0;
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
