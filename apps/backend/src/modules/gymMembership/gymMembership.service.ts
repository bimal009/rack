import {
  ExtendGymMembership,
  GymMembershipListQuery,
  NewGymMembership,
  UpdateGymMembership,
  gymMembershipExtendSchema,
  gymMembershipInsertSchema,
  gymMembershipUpdateSchema,
} from "@repo/types";
import { and, eq, exists, ilike, or, sql } from "drizzle-orm";
import { addDays, format } from "date-fns";
import { db } from "../../db";
import { gymMembership, gymPlan, member, user } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";
import { calculateEndDate } from "../../lib/helper";

const itemKey = (gymId: string, memberId: string): string =>
  `${CACHE_KEYS.GYM_MEMBERSHIP}:${gymId}:member:${memberId}`;

const listKey = (gymId: string, query: GymMembershipListQuery): string => {
  const { page, limit, search, sortOrder, planCategoryId, planId, status } = query;
  return `${CACHE_KEYS.GYM_MEMBERSHIP}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}:${planCategoryId ?? ""}:${planId ?? ""}:${status ?? ""}`;
};

export const invalidateMembership = async (gymId: string, memberId: string): Promise<void> => {
  await Promise.all([
    deleteByPattern(`${CACHE_KEYS.GYM_MEMBERSHIP}:${gymId}:member:${memberId}*`),
    deleteByPattern(`${CACHE_KEYS.GYM_MEMBERSHIP}:${gymId}:list:*`),
  ]);
};

const extendEndDate = (dateStr: string, days: number): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year!, month! - 1, day!);
  return format(addDays(date, days), "yyyy-MM-dd");
};

export const getMemberMembership = async (gymId: string, memberId: string) => {
  const cacheKey = itemKey(gymId, memberId);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const record = await db.query.gymMembership.findFirst({
    where: { gymId, memberId },
    orderBy: { createdAt: "desc" },
    with: {
      plan: { columns: { id: true, name: true } },
    },
  });

  await redis.set(cacheKey, JSON.stringify(record ?? null), "EX", CACHE_TTL.SHORT);

  return record ?? null;
};

export const createMemberMembership = async (
  gymId: string,
  memberId: string,
  input: NewGymMembership
) => {
  const result = gymMembershipInsertSchema.safeParse({ ...input, memberId });
  if (!result.success) {
    throw new ValidationError("Invalid membership", result.error.flatten());
  }

  const [memberRecord, plan] = await Promise.all([
    db.query.member.findFirst({ where: { id: memberId, gymId }, columns: { id: true } }),
    db.query.gymPlan.findFirst({
      where: { id: result.data.planId, gymId },
      columns: {
        id: true,
        billingType: true,
        billingIntervalUnit: true,
        billingIntervalCount: true,
      },
    }),
  ]);

  if (!memberRecord) throw new ValidationError("Member does not belong to this gym");
  if (!plan) throw new ValidationError("Plan does not belong to this gym");

  await db.transaction(async (tx) => {
    const existing = await tx.query.gymMembership.findFirst({
      where: { gymId, memberId, status: { in: ["Active", "Paused"] } },
      columns: { id: true },
    });

    if (existing) {
      throw new ValidationError(
        "This member already has an active membership. Extend or cancel it first."
      );
    }

    await tx.insert(gymMembership).values({
      gymId,
      ...result.data,
      endDate: calculateEndDate(result.data.startDate, plan),
    });
  });

  await invalidateMembership(gymId, memberId);

  return getMemberMembership(gymId, memberId);
};

export const updateMemberMembership = async (
  gymId: string,
  memberId: string,
  id: string,
  input: UpdateGymMembership
) => {
  const result = gymMembershipUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid membership", result.error.flatten());
  }

  const [record] = await db
    .update(gymMembership)
    .set({ ...result.data, updatedAt: new Date() })
    .where(
      and(
        eq(gymMembership.gymId, gymId),
        eq(gymMembership.memberId, memberId),
        eq(gymMembership.id, id)
      )
    )
    .returning();

  if (!record) throw new NotFoundError("Membership not found");

  await invalidateMembership(gymId, memberId);

  return getMemberMembership(gymId, memberId);
};

export const extendMemberMembership = async (
  gymId: string,
  memberId: string,
  id: string,
  input: ExtendGymMembership
) => {
  const result = gymMembershipExtendSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid extension", result.error.flatten());
  }

  const existing = await db.query.gymMembership.findFirst({
    where: { gymId, memberId, id },
    columns: { endDate: true, extendedDays: true },
  });
  if (!existing) throw new NotFoundError("Membership not found");

  const { days, reason } = result.data;

  const [record] = await db
    .update(gymMembership)
    .set({
      endDate: extendEndDate(existing.endDate, days),
      extendedDays: existing.extendedDays + days,
      extensionReason: reason || null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gymMembership.gymId, gymId),
        eq(gymMembership.memberId, memberId),
        eq(gymMembership.id, id)
      )
    )
    .returning();

  if (!record) throw new NotFoundError("Membership not found");

  await invalidateMembership(gymId, memberId);

  return getMemberMembership(gymId, memberId);
};

export const listMembership = async (gymId: string, query: GymMembershipListQuery) => {
  const cacheKey = listKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { limit, page, search, sortOrder, planCategoryId, planId, status } = query;

  const [data, total] = await Promise.all([
    db.query.gymMembership.findMany({
      where: {
        gymId,
        status: status ? status : undefined,
        planId: planId ? planId : undefined,
        plan: planCategoryId ? { categoryId: planCategoryId } : undefined,
        member: search
          ? {
              user: {
                OR: [
                  { name: { ilike: `%${search}%` } },
                  { email: { ilike: `%${search}%` } },
                ],
              },
            }
          : undefined,
      },
      orderBy: { createdAt: sortOrder },
      limit,
      offset: (page - 1) * limit,
      with: {
        plan: {
          columns: { id: true, name: true },
          with: { category: { columns: { id: true, name: true } } },
        },
        member: {
          columns: { id: true, phone: true },
          with: { user: { columns: { id: true, name: true, email: true, image: true } } },
        },
      },
    }),
    db.$count(
      gymMembership,
      and(
        eq(gymMembership.gymId, gymId),
        status ? eq(gymMembership.status, status) : undefined,
        planId ? eq(gymMembership.planId, planId) : undefined,
        planCategoryId
          ? exists(
              db
                .select({ one: sql`1` })
                .from(gymPlan)
                .where(
                  and(
                    eq(gymPlan.id, gymMembership.planId),
                    eq(gymPlan.categoryId, planCategoryId)
                  )
                )
            )
          : undefined,
        search
          ? exists(
              db
                .select({ one: sql`1` })
                .from(member)
                .innerJoin(user, eq(user.id, member.userId))
                .where(
                  and(
                    eq(member.id, gymMembership.memberId),
                    or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
                  )
                )
            )
          : undefined
      )
    ),
  ]);

  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.SHORT);

  return result;
};