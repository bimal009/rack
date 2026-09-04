import {
  ClassTypeListQuery,
  NewClassType,
  UpdateClassType,
  classTypeInsertSchema,
  classTypeUpdateSchema,
} from "@repo/types";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { classType } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const classTypeListKey = (
  gymId: string,
  query: ClassTypeListQuery
): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.CLASS_TYPE}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const classTypeItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.CLASS_TYPE}:${gymId}:item:${id}`;

const invalidateClassTypeCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.CLASS_TYPE}:${gymId}:*`);
};

export const listClassTypes = async (
  gymId: string,
  query: ClassTypeListQuery
) => {
  const cacheKey = classTypeListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder } = query;

  const [data, total] = await Promise.all([
    db.query.classType.findMany({
      where: {
        gymId,
        name: search ? { ilike: `%${search}%` } : undefined,
      },
      orderBy: { name: sortOrder },
      limit,
      offset: (page - 1) * limit,
    }),
    db.$count(
      classType,
      and(
        eq(classType.gymId, gymId),
        search ? ilike(classType.name, `%${search}%`) : undefined
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

export const getClassType = async (gymId: string, id: string) => {
  const cacheKey = classTypeItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const record = await db.query.classType.findFirst({
    where: { gymId, id },
  });

  if (!record) throw new NotFoundError("Class type not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createClassType = async (gymId: string, input: NewClassType) => {
  const result = classTypeInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid class type", result.error.flatten());
  }

  const [record] = await db
    .insert(classType)
    .values({ gymId, ...result.data })
    .returning();

  await invalidateClassTypeCache(gymId);

  return record;
};

export const updateClassType = async (
  gymId: string,
  id: string,
  input: UpdateClassType
) => {
  const result = classTypeUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid class type", result.error.flatten());
  }

  const [record] = await db
    .update(classType)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(classType.gymId, gymId), eq(classType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Class type not found");

  await invalidateClassTypeCache(gymId);

  return record;
};

export const deleteClassType = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(classType)
    .where(and(eq(classType.gymId, gymId), eq(classType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Class type not found");

  await invalidateClassTypeCache(gymId);

  return record;
};
