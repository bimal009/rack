import {
  InstructorTypeListQuery,
  NewInstructorType,
  UpdateInstructorType,
  instructorTypeInsertSchema,
  instructorTypeUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { instructorType } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const instructorTypeListKey = (
  gymId: string,
  query: InstructorTypeListQuery
): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.INSTRUCTOR_TYPE}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const instructorTypeItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.INSTRUCTOR_TYPE}:${gymId}:item:${id}`;

const invalidateInstructorTypeCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.INSTRUCTOR_TYPE}:${gymId}:*`);
};

export const listInstructorTypes = async (
  gymId: string,
  query: InstructorTypeListQuery
) => {
  const cacheKey = instructorTypeListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(instructorType.gymId, gymId),
    search ? ilike(instructorType.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(instructorType)
      .where(where)
      .orderBy(
        sortOrder === "asc" ? asc(instructorType.name) : desc(instructorType.name)
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(instructorType).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getInstructorType = async (gymId: string, id: string) => {
  const cacheKey = instructorTypeItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const [record] = await db
    .select()
    .from(instructorType)
    .where(and(eq(instructorType.gymId, gymId), eq(instructorType.id, id)))
    .limit(1);

  if (!record) throw new NotFoundError("Instructor type not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createInstructorType = async (
  gymId: string,
  input: NewInstructorType
) => {
  const result = instructorTypeInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid instructor type", result.error.flatten());
  }

  const [record] = await db
    .insert(instructorType)
    .values({ gymId, ...result.data })
    .returning();

  await invalidateInstructorTypeCache(gymId);

  return record;
};

export const updateInstructorType = async (
  gymId: string,
  id: string,
  input: UpdateInstructorType
) => {
  const result = instructorTypeUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid instructor type", result.error.flatten());
  }

  const [record] = await db
    .update(instructorType)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(instructorType.gymId, gymId), eq(instructorType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Instructor type not found");

  await invalidateInstructorTypeCache(gymId);

  return record;
};

export const deleteInstructorType = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(instructorType)
    .where(and(eq(instructorType.gymId, gymId), eq(instructorType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Instructor type not found");

  await invalidateInstructorTypeCache(gymId);

  return record;
};