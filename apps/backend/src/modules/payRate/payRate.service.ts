import {
  PayRateListQuery,
  NewPayRate,
  UpdatePayRate,
  payRateInsertSchema,
  payRateUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { payRate } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const payRateListKey = (gymId: string, query: PayRateListQuery): string => {
  const { page, limit, search, sortOrder, type } = query;
  return `${CACHE_KEYS.PAY_RATE}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}:${type ?? ""}`;
};

const payRateItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.PAY_RATE}:${gymId}:item:${id}`;

const invalidatePayRateCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.PAY_RATE}:${gymId}:*`);
};

export const listPayRates = async (gymId: string, query: PayRateListQuery) => {
  const cacheKey = payRateListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder, type } = query;
  const where = and(
    eq(payRate.gymId, gymId),
    type ? eq(payRate.type, type) : undefined,
    search ? ilike(payRate.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(payRate)
      .where(where)
      .orderBy(sortOrder === "asc" ? asc(payRate.name) : desc(payRate.name))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(payRate).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getPayRate = async (gymId: string, id: string) => {
  const cacheKey = payRateItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const [record] = await db
    .select()
    .from(payRate)
    .where(and(eq(payRate.gymId, gymId), eq(payRate.id, id)))
    .limit(1);

  if (!record) throw new NotFoundError("Pay rate not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createPayRate = async (gymId: string, input: NewPayRate) => {
  const result = payRateInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid pay rate", result.error.flatten());
  }

  const [record] = await db
    .insert(payRate)
    .values({ gymId, ...result.data })
    .returning();

  await invalidatePayRateCache(gymId);

  return record;
};

export const updatePayRate = async (
  gymId: string,
  id: string,
  input: UpdatePayRate
) => {
  const result = payRateUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid pay rate", result.error.flatten());
  }

  const [record] = await db
    .update(payRate)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(payRate.gymId, gymId), eq(payRate.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Pay rate not found");

  await invalidatePayRateCache(gymId);

  return record;
};

export const deletePayRate = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(payRate)
    .where(and(eq(payRate.gymId, gymId), eq(payRate.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Pay rate not found");

  await invalidatePayRateCache(gymId);

  return record;
};
