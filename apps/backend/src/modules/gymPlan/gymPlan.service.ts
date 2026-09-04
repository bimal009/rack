import {
  MembershipPlanListQuery,
  NewMembershipPlan,
  UpdateMembershipPlan,
  membershipPlanInsertSchema,
  membershipPlanUpdateSchema,
} from "@repo/types";
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { memberMembership, membershipFeature, membershipSport } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const listKey = (gymId: string, query: MembershipPlanListQuery): string => {
  const { page, limit, search, sortOrder, visibility, categoryId, isActive } =
    query;
  return `${CACHE_KEYS.MEMBERSHIP_PLAN}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}:${visibility ?? ""}:${categoryId ?? ""}:${isActive ?? ""}`;
};

const itemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.MEMBERSHIP_PLAN}:${gymId}:item:${id}`;

const invalidate = (gymId: string): Promise<number> =>
  deleteByPattern(`${CACHE_KEYS.MEMBERSHIP_PLAN}:${gymId}:*`);

export const listMembershipPlans = async (
  gymId: string,
  query: MembershipPlanListQuery
) => {
  const cacheKey = listKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { page, limit, search, sortOrder, visibility, categoryId, isActive } =
    query;

  const [data, total] = await Promise.all([
    db.query.memberMembership.findMany({
      where: {
        gymId,
        visibility,
        categoryId,
        isActive,
        name: search ? { ilike: `%${search}%` } : undefined,
      },
      orderBy: { name: sortOrder },
      limit,
      offset: (page - 1) * limit,
      with: {
        category: { columns: { id: true, name: true } },
        sports: { with: { sport: { columns: { id: true, name: true } } } },
        features: { with: { feature: { columns: { id: true, name: true } } } },
      },
    }),
    db.$count(
      memberMembership,
      and(
        eq(memberMembership.gymId, gymId),
        visibility ? eq(memberMembership.visibility, visibility) : undefined,
        categoryId ? eq(memberMembership.categoryId, categoryId) : undefined,
        isActive === undefined
          ? undefined
          : eq(memberMembership.isActive, isActive)
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

export const getMembershipPlan = async (gymId: string, id: string) => {
  const cacheKey = itemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const record = await db.query.memberMembership.findFirst({
    where: { gymId, id },
    with: {
      category: { columns: { id: true, name: true } },
      sports: { with: { sport: { columns: { id: true, name: true } } } },
      features: { with: { feature: { columns: { id: true, name: true } } } },
    },
  });

  if (!record) throw new NotFoundError("Membership plan not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const createMembershipPlan = async (
  gymId: string,
  input: NewMembershipPlan
) => {
  const result = membershipPlanInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid membership plan", result.error.flatten());
  }

  const {
    sportIds = [],
    featureIds = [],
    description,
    sessions,
    ...values
  } = result.data;

  const [category, sports, features] = await Promise.all([
    db.query.membershipCategory.findFirst({
      where: { id: values.categoryId, gymId },
      columns: { id: true },
    }),
    sportIds.length
      ? db.query.gymSport.findMany({
          where: { gymId, id: { in: sportIds } },
          columns: { id: true },
        })
      : undefined,
    featureIds.length
      ? db.query.gymFeature.findMany({
          where: { gymId, id: { in: featureIds } },
          columns: { id: true },
        })
      : undefined,
  ]);

  if (!category) {
    throw new ValidationError("Category does not belong to this gym");
  }
  if (sports && sports.length !== new Set(sportIds).size) {
    throw new ValidationError("One or more sports do not belong to this gym");
  }
  if (features && features.length !== new Set(featureIds).size) {
    throw new ValidationError("One or more features do not belong to this gym");
  }

  const created = await db.transaction(async (tx) => {
    const [plan] = await tx
      .insert(memberMembership)
      .values({
        gymId,
        ...values,
        description: description || null,
        sessions: sessions || null,
      })
      .returning({ id: memberMembership.id });

    if (!plan) throw new NotFoundError("Membership plan not found");

    if (sportIds.length > 0) {
      await tx.insert(membershipSport).values(
        [...new Set(sportIds)].map((sportId) => ({
          gymId,
          membershipId: plan.id,
          sportId,
        }))
      );
    }

    if (featureIds.length > 0) {
      await tx.insert(membershipFeature).values(
        [...new Set(featureIds)].map((featureId) => ({
          gymId,
          membershipId: plan.id,
          featureId,
        }))
      );
    }

    return plan;
  });

  await invalidate(gymId);

  return getMembershipPlan(gymId, created.id);
};

export const updateMembershipPlan = async (
  gymId: string,
  id: string,
  input: UpdateMembershipPlan
) => {
  const result = membershipPlanUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid membership plan", result.error.flatten());
  }

  const { sportIds, featureIds, description, sessions, ...rest } =
    result.data;

  const values: Record<string, unknown> = { ...rest };
  if (description !== undefined) values.description = description || null;
  if (sessions !== undefined) values.sessions = sessions || null;

  const [category, sports, features] = await Promise.all([
    values.categoryId
      ? db.query.membershipCategory.findFirst({
          where: { id: values.categoryId as string, gymId },
          columns: { id: true },
        })
      : undefined,
    sportIds?.length
      ? db.query.gymSport.findMany({
          where: { gymId, id: { in: sportIds } },
          columns: { id: true },
        })
      : undefined,
    featureIds?.length
      ? db.query.gymFeature.findMany({
          where: { gymId, id: { in: featureIds } },
          columns: { id: true },
        })
      : undefined,
  ]);

  if (values.categoryId && !category) {
    throw new ValidationError("Category does not belong to this gym");
  }
  if (sports && sports.length !== new Set(sportIds).size) {
    throw new ValidationError("One or more sports do not belong to this gym");
  }
  if (features && features.length !== new Set(featureIds).size) {
    throw new ValidationError("One or more features do not belong to this gym");
  }

  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: memberMembership.id })
      .from(memberMembership)
      .where(
        and(eq(memberMembership.gymId, gymId), eq(memberMembership.id, id))
      )
      .limit(1);

    if (!existing) throw new NotFoundError("Membership plan not found");

    if (Object.keys(values).length > 0) {
      await tx
        .update(memberMembership)
        .set({ ...values, updatedAt: new Date() })
        .where(
          and(eq(memberMembership.gymId, gymId), eq(memberMembership.id, id))
        );
    }

    if (sportIds) {
      await tx
        .delete(membershipSport)
        .where(eq(membershipSport.membershipId, id));
      if (sportIds.length > 0) {
        await tx.insert(membershipSport).values(
          [...new Set(sportIds)].map((sportId) => ({
            gymId,
            membershipId: id,
            sportId,
          }))
        );
      }
    }

    if (featureIds) {
      await tx
        .delete(membershipFeature)
        .where(eq(membershipFeature.membershipId, id));
      if (featureIds.length > 0) {
        await tx.insert(membershipFeature).values(
          [...new Set(featureIds)].map((featureId) => ({
            gymId,
            membershipId: id,
            featureId,
          }))
        );
      }
    }
  });

  await invalidate(gymId);

  return getMembershipPlan(gymId, id);
};

export const deleteMembershipPlan = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(memberMembership)
    .where(and(eq(memberMembership.gymId, gymId), eq(memberMembership.id, id)))
    .returning({ id: memberMembership.id });

  if (!record) throw new NotFoundError("Membership plan not found");

  await invalidate(gymId);

  return record;
};
