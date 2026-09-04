import {
  BrandListQuery,
  NewBrand,
  UpdateBrand,
  brandInsertSchema,
  brandUpdateSchema,
} from "@repo/types";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { brand } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const brandListKey = (gymId: string, query: BrandListQuery): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.BRANDS}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const brandItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.BRANDS}:${gymId}:item:${id}`;

const invalidateBrandCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.BRANDS}:${gymId}:*`);
};

export const listBrands = async (gymId: string, query: BrandListQuery) => {
  const cacheKey = brandListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder } = query;

  const [data, total] = await Promise.all([
    db.query.brand.findMany({
      where: {
        gymId,
        name: search ? { ilike: `%${search}%` } : undefined,
      },
      orderBy: { name: sortOrder },
      limit,
      offset: (page - 1) * limit,
    }),
    db.$count(
      brand,
      and(
        eq(brand.gymId, gymId),
        search ? ilike(brand.name, `%${search}%`) : undefined
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

export const getBrand = async (gymId: string, id: string) => {
  const cacheKey = brandItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const record = await db.query.brand.findFirst({
    where: { gymId, id },
  });

  if (!record) throw new NotFoundError("Brand not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createBrand = async (gymId: string, input: NewBrand) => {
  const result = brandInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid brand", result.error.flatten());
  }

  const [record] = await db
    .insert(brand)
    .values({ gymId, name: result.data.name })
    .returning();

  await invalidateBrandCache(gymId);

  return record;
};

export const updateBrand = async (
  gymId: string,
  id: string,
  input: UpdateBrand
) => {
  const result = brandUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid brand", result.error.flatten());
  }

  const [record] = await db
    .update(brand)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(brand.gymId, gymId), eq(brand.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Brand not found");

  await invalidateBrandCache(gymId);

  return record;
};

export const deleteBrand = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(brand)
    .where(and(eq(brand.gymId, gymId), eq(brand.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Brand not found");

  await invalidateBrandCache(gymId);

  return record;
};
