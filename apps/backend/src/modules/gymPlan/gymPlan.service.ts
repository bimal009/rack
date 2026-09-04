import {
  GymPlanListQuery,
  NewGymPlan,
  UpdateGymPlan,
  gymPlanInsertSchema,
  gymPlanUpdateSchema,
} from "@repo/types";
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { gymPlan, gymPlanFeature, gymPlanSport } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const listKey = (gymId: string, query: GymPlanListQuery): string => {
  const { page, limit, search, sortOrder, visibility, categoryId, isActive } =
    query;
  return `${CACHE_KEYS.GYM_PLAN}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}:${visibility ?? ""}:${categoryId ?? ""}:${isActive ?? ""}`;
};

const itemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.GYM_PLAN}:${gymId}:item:${id}`;

const invalidate = (gymId: string): Promise<number> =>
  deleteByPattern(`${CACHE_KEYS.GYM_PLAN}:${gymId}:*`);

export const listGymPlans = async (gymId: string, query: GymPlanListQuery) => {
  const cacheKey = listKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { page, limit, search, sortOrder, visibility, categoryId, isActive } =
    query;

  const [data, total] = await Promise.all([
    db.query.gymPlan.findMany({
      where: {
        gymId,
        visibility,
        categoryId,
        isActive,
        name: search ? { ilike: `%${search}%` } : undefined,
      },
      orderBy: { name: sortOrder },
      limit,
      offset: (page - 1) * limit,
      with: {
        category: { columns: { id: true, name: true } },
        sports: { with: { sport: { columns: { id: true, name: true } } } },
        features: { with: { feature: { columns: { id: true, name: true } } } },
      },
    }),
    db.$count(
      gymPlan,
      and(
        eq(gymPlan.gymId, gymId),
        visibility ? eq(gymPlan.visibility, visibility) : undefined,
        categoryId ? eq(gymPlan.categoryId, categoryId) : undefined,
        isActive === undefined ? undefined : eq(gymPlan.isActive, isActive)
      )
    ),
  ]);

  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getGymPlan = async (gymId: string, id: string) => {
  const cacheKey = itemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const record = await db.query.gymPlan.findFirst({
    where: { gymId, id },
    with: {
      category: { columns: { id: true, name: true } },
      sports: { with: { sport: { columns: { id: true, name: true } } } },
      features: { with: { feature: { columns: { id: true, name: true } } } },
    },
  });

  if (!record) throw new NotFoundError("Plan not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createGymPlan = async (gymId: string, input: NewGymPlan) => {
  const result = gymPlanInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid plan", result.error.flatten());
  }

  const {
    sportIds = [],
    featureIds = [],
    description,
    sessions,
    ...values
  } = result.data;

  const [category, sports, features] = await Promise.all([
    db.query.membershipCategory.findFirst({
      where: { id: values.categoryId, gymId },
      columns: { id: true },
    }),
    sportIds.length
      ? db.query.gymSport.findMany({
          where: { gymId, id: { in: sportIds } },
          columns: { id: true },
        })
      : undefined,
    featureIds.length
      ? db.query.gymFeature.findMany({
          where: { gymId, id: { in: featureIds } },
          columns: { id: true },
        })
      : undefined,
  ]);

  if (!category) {
    throw new ValidationError("Category does not belong to this gym");
  }
  if (sports && sports.length !== new Set(sportIds).size) {
    throw new ValidationError("One or more sports do not belong to this gym");
  }
  if (features && features.length !== new Set(featureIds).size) {
    throw new ValidationError("One or more features do not belong to this gym");
  }

  const created = await db.transaction(async (tx) => {
    const [plan] = await tx
      .insert(gymPlan)
      .values({
        gymId,
        ...values,
        description: description || null,
        sessions: sessions || null,
      })
      .returning({ id: gymPlan.id });

    if (!plan) throw new NotFoundError("Plan not found");

    if (sportIds.length > 0) {
      await tx.insert(gymPlanSport).values(
        [...new Set(sportIds)].map((sportId) => ({
          gymId,
          planId: plan.id,
          sportId,
        }))
      );
    }

    if (featureIds.length > 0) {
      await tx.insert(gymPlanFeature).values(
        [...new Set(featureIds)].map((featureId) => ({
          gymId,
          planId: plan.id,
          featureId,
        }))
      );
    }

    return plan;
  });

  await invalidate(gymId);

  return getGymPlan(gymId, created.id);
};

export const updateGymPlan = async (
  gymId: string,
  id: string,
  input: UpdateGymPlan
) => {
  const result = gymPlanUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid plan", result.error.flatten());
  }

  const { sportIds, featureIds, description, sessions, ...rest } = result.data;

  const values: Record<string, unknown> = { ...rest };
  if (description !== undefined) values.description = description || null;
  if (sessions !== undefined) values.sessions = sessions || null;

  const [category, sports, features] = await Promise.all([
    values.categoryId
      ? db.query.membershipCategory.findFirst({
          where: { id: values.categoryId as string, gymId },
          columns: { id: true },
        })
      : undefined,
    sportIds?.length
      ? db.query.gymSport.findMany({
          where: { gymId, id: { in: sportIds } },
          columns: { id: true },
        })
      : undefined,
    featureIds?.length
      ? db.query.gymFeature.findMany({
          where: { gymId, id: { in: featureIds } },
          columns: { id: true },
        })
      : undefined,
  ]);

  if (values.categoryId && !category) {
    throw new ValidationError("Category does not belong to this gym");
  }
  if (sports && sports.length !== new Set(sportIds).size) {
    throw new ValidationError("One or more sports do not belong to this gym");
  }
  if (features && features.length !== new Set(featureIds).size) {
    throw new ValidationError("One or more features do not belong to this gym");
  }

  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: gymPlan.id })
      .from(gymPlan)
      .where(and(eq(gymPlan.gymId, gymId), eq(gymPlan.id, id)))
      .limit(1);

    if (!existing) throw new NotFoundError("Plan not found");

    if (Object.keys(values).length > 0) {
      await tx
        .update(gymPlan)
        .set({ ...values, updatedAt: new Date() })
        .where(and(eq(gymPlan.gymId, gymId), eq(gymPlan.id, id)));
    }

    if (sportIds) {
      await tx.delete(gymPlanSport).where(eq(gymPlanSport.planId, id));
      if (sportIds.length > 0) {
        await tx.insert(gymPlanSport).values(
          [...new Set(sportIds)].map((sportId) => ({
            gymId,
            planId: id,
            sportId,
          }))
        );
      }
    }

    if (featureIds) {
      await tx.delete(gymPlanFeature).where(eq(gymPlanFeature.planId, id));
      if (featureIds.length > 0) {
        await tx.insert(gymPlanFeature).values(
          [...new Set(featureIds)].map((featureId) => ({
            gymId,
            planId: id,
            featureId,
          }))
        );
      }
    }
  });

  await invalidate(gymId);

  return getGymPlan(gymId, id);
};

export const deleteGymPlan = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(gymPlan)
    .where(and(eq(gymPlan.gymId, gymId), eq(gymPlan.id, id)))
    .returning({ id: gymPlan.id });

  if (!record) throw new NotFoundError("Plan not found");

  await invalidate(gymId);

  return record;
};
