import {
  MembershipCategoryListQuery,
  NewMembershipCategory,
  UpdateMembershipCategory,
  membershipCategoryInsertSchema,
  membershipCategoryUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { membershipCategory } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const membershipCategoryListKey = (
  gymId: string,
  query: MembershipCategoryListQuery
): string => {
  const { page, limit, search, sortOrder } = query;
  return `${CACHE_KEYS.MEMBERSHIP_CATEGORY}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}`;
};

const membershipCategoryItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.MEMBERSHIP_CATEGORY}:${gymId}:item:${id}`;

const invalidateMembershipCategoryCache = async (
  gymId: string
): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.MEMBERSHIP_CATEGORY}:${gymId}:*`);
};

export const listMembershipCategories = async (
  gymId: string,
  query: MembershipCategoryListQuery
) => {
  const cacheKey = membershipCategoryListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(membershipCategory.gymId, gymId),
    search ? ilike(membershipCategory.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(membershipCategory)
      .where(where)
      .orderBy(
        sortOrder === "asc"
          ? asc(membershipCategory.name)
          : desc(membershipCategory.name)
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(membershipCategory).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getMembershipCategory = async (gymId: string, id: string) => {
  const cacheKey = membershipCategoryItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const [record] = await db
    .select()
    .from(membershipCategory)
    .where(
      and(eq(membershipCategory.gymId, gymId), eq(membershipCategory.id, id))
    )
    .limit(1);

  if (!record) throw new NotFoundError("Membership category not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createMembershipCategory = async (
  gymId: string,
  input: NewMembershipCategory
) => {
  const result = membershipCategoryInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(
      "Invalid membership category",
      result.error.flatten()
    );
  }

  const [record] = await db
    .insert(membershipCategory)
    .values({ gymId, name: result.data.name })
    .returning();

  await invalidateMembershipCategoryCache(gymId);

  return record;
};

export const updateMembershipCategory = async (
  gymId: string,
  id: string,
  input: UpdateMembershipCategory
) => {
  const result = membershipCategoryUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(
      "Invalid membership category",
      result.error.flatten()
    );
  }

  const [record] = await db
    .update(membershipCategory)
    .set({ ...result.data, updatedAt: new Date() })
    .where(
      and(eq(membershipCategory.gymId, gymId), eq(membershipCategory.id, id))
    )
    .returning();

  if (!record) throw new NotFoundError("Membership category not found");

  await invalidateMembershipCategoryCache(gymId);

  return record;
};

export const deleteMembershipCategory = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(membershipCategory)
    .where(
      and(eq(membershipCategory.gymId, gymId), eq(membershipCategory.id, id))
    )
    .returning();

  if (!record) throw new NotFoundError("Membership category not found");

  await invalidateMembershipCategoryCache(gymId);

  return record;
};
