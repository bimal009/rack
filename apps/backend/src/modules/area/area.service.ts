import {
  AreaListQuery,
  NewArea,
  UpdateArea,
  areaInsertSchema,
  areaUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { area, areaType } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const areaListKey = (gymId: string, query: AreaListQuery): string => {
  const { page, limit, search, sortOrder, status, areaTypeId } = query;
  return `${CACHE_KEYS.AREA}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}:${status ?? ""}:${areaTypeId ?? ""}`;
};

const areaItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.AREA}:${gymId}:item:${id}`;

const invalidateAreaCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.AREA}:${gymId}:*`);
};

export const listAreas = async (gymId: string, query: AreaListQuery) => {
  const cacheKey = areaListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder, status, areaTypeId } = query;
  const where = and(
    eq(area.gymId, gymId),
    status ? eq(area.status, status) : undefined,
    areaTypeId ? eq(area.areaTypeId, areaTypeId) : undefined,
    search ? ilike(area.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select({
        id: area.id,
        gymId: area.gymId,
        areaTypeId: area.areaTypeId,
        name: area.name,
        description: area.description,
        images: area.images,
        pricePerHour: area.pricePerHour,
        maxConcurrentBookings: area.maxConcurrentBookings,
        visibility: area.visibility,
        status: area.status,
        attributes: area.attributes,
        areaType: { id: areaType.id, name: areaType.name },
        createdAt: area.createdAt,
        updatedAt: area.updatedAt,
      })
      .from(area)
      .leftJoin(areaType, eq(area.areaTypeId, areaType.id))
      .where(where)
      .orderBy(sortOrder === "asc" ? asc(area.name) : desc(area.name))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(area).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getArea = async (gymId: string, id: string) => {
  const cacheKey = areaItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const [record] = await db
    .select({
      id: area.id,
      gymId: area.gymId,
      areaTypeId: area.areaTypeId,
      name: area.name,
      description: area.description,
      images: area.images,
      pricePerHour: area.pricePerHour,
      maxConcurrentBookings: area.maxConcurrentBookings,
      visibility: area.visibility,
      status: area.status,
      attributes: area.attributes,
      areaType: { id: areaType.id, name: areaType.name },
      createdAt: area.createdAt,
      updatedAt: area.updatedAt,
    })
    .from(area)
    .leftJoin(areaType, eq(area.areaTypeId, areaType.id))
    .where(and(eq(area.gymId, gymId), eq(area.id, id)))
    .limit(1);

  if (!record) throw new NotFoundError("Area not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createArea = async (gymId: string, input: NewArea) => {
  const result = areaInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid area", result.error.flatten());
  }

  const [record] = await db
    .insert(area)
    .values({ gymId, ...result.data })
    .returning();

  await invalidateAreaCache(gymId);

  return record;
};

export const updateArea = async (
  gymId: string,
  id: string,
  input: UpdateArea
) => {
  const result = areaUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid area", result.error.flatten());
  }

  const [record] = await db
    .update(area)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(area.gymId, gymId), eq(area.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Area not found");

  await invalidateAreaCache(gymId);

  return record;
};

export const deleteArea = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(area)
    .where(and(eq(area.gymId, gymId), eq(area.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Area not found");

  await invalidateAreaCache(gymId);

  return record;
};
