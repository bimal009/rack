import {
  ProductCategoryListQuery,
  NewProductCategory,
  UpdateProductCategory,
  productCategoryInsertSchema,
  productCategoryUpdateSchema,
} from "@repo/types";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { productCategory } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const productCategoryListKey = (
  gymId: string,
  query: ProductCategoryListQuery
): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.PRODUCT_CATEGORY}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const productCategoryItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.PRODUCT_CATEGORY}:${gymId}:item:${id}`;

const invalidateProductCategoryCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.PRODUCT_CATEGORY}:${gymId}:*`);
};

export const listProductCategories = async (
  gymId: string,
  query: ProductCategoryListQuery
) => {
  const cacheKey = productCategoryListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder } = query;

  const [data, total] = await Promise.all([
    db.query.productCategory.findMany({
      where: {
        gymId,
        name: search ? { ilike: `%${search}%` } : undefined,
      },
      orderBy: { name: sortOrder },
      limit,
      offset: (page - 1) * limit,
    }),
    db.$count(
      productCategory,
      and(
        eq(productCategory.gymId, gymId),
        search ? ilike(productCategory.name, `%${search}%`) : undefined
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

export const getProductCategory = async (gymId: string, id: string) => {
  const cacheKey = productCategoryItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const record = await db.query.productCategory.findFirst({
    where: { gymId, id },
  });

  if (!record) throw new NotFoundError("Product category not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createProductCategory = async (
  gymId: string,
  input: NewProductCategory
) => {
  const result = productCategoryInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(
      "Invalid product category",
      result.error.flatten()
    );
  }

  const [record] = await db
    .insert(productCategory)
    .values({ gymId, name: result.data.name })
    .returning();

  await invalidateProductCategoryCache(gymId);

  return record;
};

export const updateProductCategory = async (
  gymId: string,
  id: string,
  input: UpdateProductCategory
) => {
  const result = productCategoryUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(
      "Invalid product category",
      result.error.flatten()
    );
  }

  const [record] = await db
    .update(productCategory)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(productCategory.gymId, gymId), eq(productCategory.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Product category not found");

  await invalidateProductCategoryCache(gymId);

  return record;
};

export const deleteProductCategory = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(productCategory)
    .where(and(eq(productCategory.gymId, gymId), eq(productCategory.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Product category not found");

  await invalidateProductCategoryCache(gymId);

  return record;
};
