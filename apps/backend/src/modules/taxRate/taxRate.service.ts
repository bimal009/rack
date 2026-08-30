import {
  TaxRateListQuery,
  NewTaxRate,
  UpdateTaxRate,
  taxRateInsertSchema,
  taxRateUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { taxRate } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const taxRateListKey = (gymId: string, query: TaxRateListQuery): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.TAX_RATE}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const taxRateItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.TAX_RATE}:${gymId}:item:${id}`;

const invalidateTaxRateCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.TAX_RATE}:${gymId}:*`);
};

export const listTaxRates = async (gymId: string, query: TaxRateListQuery) => {
  const cacheKey = taxRateListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(taxRate.gymId, gymId),
    search ? ilike(taxRate.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(taxRate)
      .where(where)
      .orderBy(sortOrder === "asc" ? asc(taxRate.rate) : desc(taxRate.rate))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(taxRate).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getTaxRate = async (gymId: string, id: string) => {
  const cacheKey = taxRateItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const [record] = await db
    .select()
    .from(taxRate)
    .where(and(eq(taxRate.gymId, gymId), eq(taxRate.id, id)))
    .limit(1);

  if (!record) throw new NotFoundError("Tax rate not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createTaxRate = async (gymId: string, input: NewTaxRate) => {
  const result = taxRateInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid tax rate", result.error.flatten());
  }

  const [record] = await db
    .insert(taxRate)
    .values({ gymId, ...result.data })
    .returning();

  await invalidateTaxRateCache(gymId);

  return record;
};

export const updateTaxRate = async (
  gymId: string,
  id: string,
  input: UpdateTaxRate
) => {
  const result = taxRateUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid tax rate", result.error.flatten());
  }

  const [record] = await db
    .update(taxRate)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(taxRate.gymId, gymId), eq(taxRate.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Tax rate not found");

  await invalidateTaxRateCache(gymId);

  return record;
};

export const deleteTaxRate = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(taxRate)
    .where(and(eq(taxRate.gymId, gymId), eq(taxRate.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Tax rate not found");

  await invalidateTaxRateCache(gymId);

  return record;
};