import {
  MembershipPlanListQuery,
  NewMembershipPlan,
  UpdateMembershipPlan,
  membershipPlanInsertSchema,
  membershipPlanUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "../../db";
import {
  gymFeature,
  gymSport,
  memberMembership,
  membershipCategory,
  membershipFeature,
  membershipSport,
} from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

type PlanRow = { id: string };

const listKey = (gymId: string, query: MembershipPlanListQuery): string => {
  const { page, limit, search, sortOrder, visibility, categoryId, isActive } =
    query;
  return `${CACHE_KEYS.MEMBERSHIP_PLAN}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}:${visibility ?? ""}:${categoryId ?? ""}:${isActive ?? ""}`;
};

const itemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.MEMBERSHIP_PLAN}:${gymId}:item:${id}`;

const invalidate = (gymId: string): Promise<number> =>
  deleteByPattern(`${CACHE_KEYS.MEMBERSHIP_PLAN}:${gymId}:*`);

const attachRelations = async <T extends PlanRow>(rows: T[]) => {
  if (rows.length === 0) return [] as (T & { sports: unknown[]; features: unknown[] })[];

  const ids = rows.map((row) => row.id);
  const [sportRows, featureRows] = await Promise.all([
    db
      .select({
        membershipId: membershipSport.membershipId,
        id: gymSport.id,
        name: gymSport.name,
      })
      .from(membershipSport)
      .innerJoin(gymSport, eq(membershipSport.sportId, gymSport.id))
      .where(inArray(membershipSport.membershipId, ids)),
    db
      .select({
        membershipId: membershipFeature.membershipId,
        id: gymFeature.id,
        name: gymFeature.name,
      })
      .from(membershipFeature)
      .innerJoin(gymFeature, eq(membershipFeature.featureId, gymFeature.id))
      .where(inArray(membershipFeature.membershipId, ids)),
  ]);

  return rows.map((row) => ({
    ...row,
    sports: sportRows
      .filter((r) => r.membershipId === row.id)
      .map(({ id, name }) => ({ id, name })),
    features: featureRows
      .filter((r) => r.membershipId === row.id)
      .map(({ id, name }) => ({ id, name })),
  }));
};

const assertOwned = async (
  label: string,
  table: typeof gymSport | typeof gymFeature,
  gymId: string,
  ids: string[]
): Promise<void> => {
  const unique = [...new Set(ids)];
  if (unique.length === 0) return;

  const rows = await db
    .select({ id: table.id })
    .from(table)
    .where(and(eq(table.gymId, gymId), inArray(table.id, unique)));

  if (rows.length !== unique.length) {
    throw new ValidationError(`One or more ${label} do not belong to this gym`);
  }
};

const assertCategoryOwned = async (
  gymId: string,
  categoryId: string
): Promise<void> => {
  const [row] = await db
    .select({ id: membershipCategory.id })
    .from(membershipCategory)
    .where(
      and(
        eq(membershipCategory.gymId, gymId),
        eq(membershipCategory.id, categoryId)
      )
    )
    .limit(1);

  if (!row) throw new ValidationError("Category does not belong to this gym");
};

export const listMembershipPlans = async (
  gymId: string,
  query: MembershipPlanListQuery
) => {
  const cacheKey = listKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const { page, limit, search, sortOrder, visibility, categoryId, isActive } =
    query;
  const where = and(
    eq(memberMembership.gymId, gymId),
    visibility ? eq(memberMembership.visibility, visibility) : undefined,
    categoryId ? eq(memberMembership.categoryId, categoryId) : undefined,
    isActive === undefined
      ? undefined
      : eq(memberMembership.isActive, isActive),
    search ? ilike(memberMembership.name, `%${search}%`) : undefined
  );

  const [rows, [totalRow]] = await Promise.all([
    db
      .select({
        id: memberMembership.id,
        gymId: memberMembership.gymId,
        name: memberMembership.name,
        categoryId: memberMembership.categoryId,
        category: { id: membershipCategory.id, name: membershipCategory.name },
        visibility: memberMembership.visibility,
        description: memberMembership.description,
        barcode: memberMembership.barcode,
        isActive: memberMembership.isActive,
        pricePerPeriod: memberMembership.pricePerPeriod,
        billingType: memberMembership.billingType,
        billingIntervalUnit: memberMembership.billingIntervalUnit,
        billingIntervalCount: memberMembership.billingIntervalCount,
        signupFee: memberMembership.signupFee,
        requirePaymentUpfront: memberMembership.requirePaymentUpfront,
        coverage: memberMembership.coverage,
        coverageClasses: memberMembership.coverageClasses,
        coverageAreas: memberMembership.coverageAreas,
        coverageInstructors: memberMembership.coverageInstructors,
        noClasses: memberMembership.noClasses,
        noAreas: memberMembership.noAreas,
        noInstructors: memberMembership.noInstructors,
        sessions: memberMembership.sessions,
        createdAt: memberMembership.createdAt,
        updatedAt: memberMembership.updatedAt,
      })
      .from(memberMembership)
      .leftJoin(
        membershipCategory,
        eq(memberMembership.categoryId, membershipCategory.id)
      )
      .where(where)
      .orderBy(
        sortOrder === "asc"
          ? asc(memberMembership.name)
          : desc(memberMembership.name)
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(memberMembership).where(where),
  ]);

  const data = await attachRelations(rows);
  const total = totalRow?.total ?? 0;
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

  const [row] = await db
    .select({
      id: memberMembership.id,
      gymId: memberMembership.gymId,
      name: memberMembership.name,
      categoryId: memberMembership.categoryId,
      category: { id: membershipCategory.id, name: membershipCategory.name },
      visibility: memberMembership.visibility,
      description: memberMembership.description,
      barcode: memberMembership.barcode,
      isActive: memberMembership.isActive,
      pricePerPeriod: memberMembership.pricePerPeriod,
      billingType: memberMembership.billingType,
      billingIntervalUnit: memberMembership.billingIntervalUnit,
      billingIntervalCount: memberMembership.billingIntervalCount,
      signupFee: memberMembership.signupFee,
      requirePaymentUpfront: memberMembership.requirePaymentUpfront,
      coverage: memberMembership.coverage,
      coverageClasses: memberMembership.coverageClasses,
      coverageAreas: memberMembership.coverageAreas,
      coverageInstructors: memberMembership.coverageInstructors,
      noClasses: memberMembership.noClasses,
      noAreas: memberMembership.noAreas,
      noInstructors: memberMembership.noInstructors,
      sessions: memberMembership.sessions,
      createdAt: memberMembership.createdAt,
      updatedAt: memberMembership.updatedAt,
    })
    .from(memberMembership)
    .leftJoin(
      membershipCategory,
      eq(memberMembership.categoryId, membershipCategory.id)
    )
    .where(and(eq(memberMembership.gymId, gymId), eq(memberMembership.id, id)))
    .limit(1);

  if (!row) throw new NotFoundError("Membership plan not found");

  const [record] = await attachRelations([row]);

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
    barcode,
    sessions,
    ...values
  } = result.data;

  await Promise.all([
    assertCategoryOwned(gymId, values.categoryId),
    assertOwned("sports", gymSport, gymId, sportIds),
    assertOwned("features", gymFeature, gymId, featureIds),
  ]);

  const created = await db.transaction(async (tx) => {
    const [plan] = await tx
      .insert(memberMembership)
      .values({
        gymId,
        ...values,
        description: description || null,
        barcode: barcode || null,
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

  const { sportIds, featureIds, description, barcode, sessions, ...rest } =
    result.data;

  const values: Record<string, unknown> = { ...rest };
  if (description !== undefined) values.description = description || null;
  if (barcode !== undefined) values.barcode = barcode || null;
  if (sessions !== undefined) values.sessions = sessions || null;

  await Promise.all([
    values.categoryId
      ? assertCategoryOwned(gymId, values.categoryId as string)
      : Promise.resolve(),
    sportIds ? assertOwned("sports", gymSport, gymId, sportIds) : Promise.resolve(),
    featureIds
      ? assertOwned("features", gymFeature, gymId, featureIds)
      : Promise.resolve(),
  ]);

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
