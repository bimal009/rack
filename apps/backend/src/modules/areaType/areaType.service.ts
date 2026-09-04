import {
  AreaTypeListQuery,
  NewAreaType,
  UpdateAreaType,
  areaTypeInsertSchema,
  areaTypeUpdateSchema,
} from "@repo/types";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { areaType } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const areaTypeListKey = (gymId: string, query: AreaTypeListQuery): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.AREA_TYPE}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const areaTypeItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.AREA_TYPE}:${gymId}:item:${id}`;

const invalidateAreaTypeCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.AREA_TYPE}:${gymId}:*`);
};

export const listAreaTypes = async (
  gymId: string,
  query: AreaTypeListQuery
) => {
  const cacheKey = areaTypeListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder } = query;

  const [data, total] = await Promise.all([
    db.query.areaType.findMany({
      where: {
        gymId,
        name: search ? { ilike: `%${search}%` } : undefined,
      },
      orderBy: { name: sortOrder },
      limit,
      offset: (page - 1) * limit,
    }),
    db.$count(
      areaType,
      and(
        eq(areaType.gymId, gymId),
        search ? ilike(areaType.name, `%${search}%`) : undefined
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

export const getAreaType = async (gymId: string, id: string) => {
  const cacheKey = areaTypeItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const record = await db.query.areaType.findFirst({
    where: { gymId, id },
  });

  if (!record) throw new NotFoundError("Area type not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createAreaType = async (gymId: string, input: NewAreaType) => {
  const result = areaTypeInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid area type", result.error.flatten());
  }

  const [record] = await db
    .insert(areaType)
    .values({ gymId, ...result.data })
    .returning();

  await invalidateAreaTypeCache(gymId);

  return record;
};

export const updateAreaType = async (
  gymId: string,
  id: string,
  input: UpdateAreaType
) => {
  const result = areaTypeUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid area type", result.error.flatten());
  }

  const [record] = await db
    .update(areaType)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(areaType.gymId, gymId), eq(areaType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Area type not found");

  await invalidateAreaTypeCache(gymId);

  return record;
};

export const deleteAreaType = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(areaType)
    .where(and(eq(areaType.gymId, gymId), eq(areaType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Area type not found");

  await invalidateAreaTypeCache(gymId);

  return record;
};
