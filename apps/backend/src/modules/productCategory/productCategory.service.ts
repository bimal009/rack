import {
  ProductCategoryListQuery,
  NewProductCategory,
  UpdateProductCategory,
  productCategoryInsertSchema,
  productCategoryUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { productCategory } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const categoryListKey = (
  gymId: string,
  query: ProductCategoryListQuery
): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.CATEGORY}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const categoryItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.CATEGORY}:${gymId}:item:${id}`;

const invalidateCategoryCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.CATEGORY}:${gymId}:*`);
};

export const listCategories = async (
  gymId: string,
  query: ProductCategoryListQuery
) => {
  const cacheKey = categoryListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(productCategory.gymId, gymId),
    search ? ilike(productCategory.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(productCategory)
      .where(where)
      .orderBy(
        sortOrder === "asc"
          ? asc(productCategory.name)
          : desc(productCategory.name)
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(productCategory).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getCategory = async (gymId: string, id: string) => {
  const cacheKey = categoryItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const [record] = await db
    .select()
    .from(productCategory)
    .where(and(eq(productCategory.gymId, gymId), eq(productCategory.id, id)))
    .limit(1);

  if (!record) throw new NotFoundError("Category not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createCategory = async (
  gymId: string,
  input: NewProductCategory
) => {
  const result = productCategoryInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid category", result.error.flatten());
  }

  const [record] = await db
    .insert(productCategory)
    .values({ gymId, name: result.data.name })
    .returning();

  await invalidateCategoryCache(gymId);

  return record;
};

export const updateCategory = async (
  gymId: string,
  id: string,
  input: UpdateProductCategory
) => {
  const result = productCategoryUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid category", result.error.flatten());
  }

  const [record] = await db
    .update(productCategory)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(productCategory.gymId, gymId), eq(productCategory.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Category not found");

  await invalidateCategoryCache(gymId);

  return record;
};

export const deleteCategory = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(productCategory)
    .where(and(eq(productCategory.gymId, gymId), eq(productCategory.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Category not found");

  await invalidateCategoryCache(gymId);

  return record;
};