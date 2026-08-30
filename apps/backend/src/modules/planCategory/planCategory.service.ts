import {
  PlanCategoryListQuery,
  NewPlanCategory,
  UpdatePlanCategory,
  planCategoryInsertSchema,
  planCategoryUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { planCategory } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const planCategoryListKey = (
  gymId: string,
  query: PlanCategoryListQuery
): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.PLAN_CATEGORY}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const planCategoryItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.PLAN_CATEGORY}:${gymId}:item:${id}`;

const invalidatePlanCategoryCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.PLAN_CATEGORY}:${gymId}:*`);
};

export const listPlanCategories = async (
  gymId: string,
  query: PlanCategoryListQuery
) => {
  const cacheKey = planCategoryListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(planCategory.gymId, gymId),
    search ? ilike(planCategory.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(planCategory)
      .where(where)
      .orderBy(
        sortOrder === "asc" ? asc(planCategory.name) : desc(planCategory.name)
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(planCategory).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getPlanCategory = async (gymId: string, id: string) => {
  const cacheKey = planCategoryItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const [record] = await db
    .select()
    .from(planCategory)
    .where(and(eq(planCategory.gymId, gymId), eq(planCategory.id, id)))
    .limit(1);

  if (!record) throw new NotFoundError("Plan category not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createPlanCategory = async (
  gymId: string,
  input: NewPlanCategory
) => {
  const result = planCategoryInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid plan category", result.error.flatten());
  }

  const [record] = await db
    .insert(planCategory)
    .values({ gymId, name: result.data.name })
    .returning();

  await invalidatePlanCategoryCache(gymId);

  return record;
};

export const updatePlanCategory = async (
  gymId: string,
  id: string,
  input: UpdatePlanCategory
) => {
  const result = planCategoryUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid plan category", result.error.flatten());
  }

  const [record] = await db
    .update(planCategory)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(planCategory.gymId, gymId), eq(planCategory.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Plan category not found");

  await invalidatePlanCategoryCache(gymId);

  return record;
};

export const deletePlanCategory = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(planCategory)
    .where(and(eq(planCategory.gymId, gymId), eq(planCategory.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Plan category not found");

  await invalidatePlanCategoryCache(gymId);

  return record;
};
