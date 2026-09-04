import {
  ProductFeatureListQuery,
  NewProductFeature,
  UpdateProductFeature,
  productFeatureInsertSchema,
  productFeatureUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { productFeature } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const listKey = (gymId: string, query: ProductFeatureListQuery): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.PRODUCT_FEATURE}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const itemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.PRODUCT_FEATURE}:${gymId}:item:${id}`;

const invalidate = (gymId: string): Promise<number> =>
  deleteByPattern(`${CACHE_KEYS.PRODUCT_FEATURE}:${gymId}:*`);

export const listProductFeatures = async (
  gymId: string,
  query: ProductFeatureListQuery
) => {
  const cacheKey = listKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(productFeature.gymId, gymId),
    search ? ilike(productFeature.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(productFeature)
      .where(where)
      .orderBy(
        sortOrder === "asc" ? asc(productFeature.name) : desc(productFeature.name)
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(productFeature).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getProductFeature = async (gymId: string, id: string) => {
  const cacheKey = itemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const [record] = await db
    .select()
    .from(productFeature)
    .where(and(eq(productFeature.gymId, gymId), eq(productFeature.id, id)))
    .limit(1);

  if (!record) throw new NotFoundError("Product feature not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createProductFeature = async (
  gymId: string,
  input: NewProductFeature
) => {
  const result = productFeatureInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid product feature", result.error.flatten());
  }

  const [record] = await db
    .insert(productFeature)
    .values({ gymId, name: result.data.name })
    .returning();

  await invalidate(gymId);

  return record;
};

export const updateProductFeature = async (
  gymId: string,
  id: string,
  input: UpdateProductFeature
) => {
  const result = productFeatureUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid product feature", result.error.flatten());
  }

  const [record] = await db
    .update(productFeature)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(productFeature.gymId, gymId), eq(productFeature.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Product feature not found");

  await invalidate(gymId);

  return record;
};

export const deleteProductFeature = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(productFeature)
    .where(and(eq(productFeature.gymId, gymId), eq(productFeature.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Product feature not found");

  await invalidate(gymId);

  return record;
};
