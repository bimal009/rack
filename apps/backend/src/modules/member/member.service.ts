import { randomUUID } from "node:crypto";
import {
  MemberListQuery,
  NewMemberWithUser,
  UpdateMember,
  generateMemberEmail,
  memberUpdateSchema,
  memberWithUserAndMembershipInsertSchema,
} from "@repo/types";
import { and, eq, exists, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { gymMembership, member, user } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";
import { calculateEndDate } from "../../lib/helper";
import { invalidateMembership } from "../gymMembership/gymMembership.service";

const memberListKey = (gymId: string, query: MemberListQuery): string => {
  const { page, limit, search, sortOrder, status } = query;
  return `${CACHE_KEYS.MEMBER}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}:${status ?? ""}`;
};

const memberItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.MEMBER}:${gymId}:item:${id}`;

const invalidateMemberCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.MEMBER}:${gymId}:*`);
};

export async function createMemberWithUser(data: NewMemberWithUser, gymId: string) {
  const result = memberWithUserAndMembershipInsertSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Invalid member data", result.error.flatten());
  }
  const { user: userInput, member: memberInput, membership: membershipInput } = result.data;
  const email = userInput.email ?? generateMemberEmail(userInput.name, memberInput.phone);

  const created = await db.transaction(async (tx) => {
    const [newUser] = await tx
      .insert(user)
      .values({
        id: randomUUID(),
        email,
        name: userInput.name,
        image: userInput.image ?? null,
        role: "user",
      })
      .returning();

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    const [newMember] = await tx
      .insert(member)
      .values({
        gymId,
        userId: newUser.id,
        status: memberInput.status,
        phone: memberInput.phone,
        dateOfBirth: memberInput.dateOfBirth,
        gender: memberInput.gender,
        address: memberInput.address,
      })
      .returning();

    if (!newMember) {
      throw new Error("Failed to create member");
    }

    let newMembership = null;
    if (membershipInput) {
      const plan = await tx.query.gymPlan.findFirst({
        where: { id: membershipInput.planId, gymId },
        columns: {
          id: true,
          billingType: true,
          billingIntervalUnit: true,
          billingIntervalCount: true,
        },
      });

      if (!plan) {
        throw new ValidationError("Plan does not belong to this gym");
      }

      const [membershipRecord] = await tx
        .insert(gymMembership)
        .values({
          gymId,
          memberId: newMember.id,
          planId: membershipInput.planId,
          status: membershipInput.status,
          startDate: membershipInput.startDate,
          endDate: calculateEndDate(membershipInput.startDate, plan),
          price: membershipInput.price,
          signupFee: membershipInput.signupFee ?? null,
          extendedDays: membershipInput.extendedDays ?? 0,
          extensionReason: membershipInput.extensionReason ?? null,
        })
        .returning();
      newMembership = membershipRecord;
    }

    return { user: newUser, member: newMember, membership: newMembership };
  });

  await Promise.all([
    invalidateMemberCache(gymId),
    invalidateMembership(gymId, created.member.id),
  ]);

  return created;
}

export const getAllMembers = async (gymId: string, query: MemberListQuery) => {
  const cacheKey = memberListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, sortOrder, search, status } = query;

  const [data, total] = await Promise.all([
    db.query.member.findMany({
      where: {
        gymId,
        status,
        user: search
          ? { OR: [{ name: { ilike: `%${search}%` } }, { email: { ilike: `%${search}%` } }] }
          : undefined,
      },
      orderBy: { createdAt: sortOrder },
      limit,
      offset: (page - 1) * limit,

      with: {
        user: { columns: { id: true, name: true, email: true, image: true } },
      },
    }),
    db.$count(
      member,
      and(
        eq(member.gymId, gymId),
        status ? eq(member.status, status) : undefined,
        search
          ? exists(
              db
                .select({ one: sql`1` })
                .from(user)
                .where(
                  and(
                    eq(user.id, member.userId),
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

export const getMemberById = async (gymId: string, id: string) => {
  const cacheKey = memberItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const record = await db.query.member.findFirst({
    where: { gymId, id },
    with: {
      user: { columns: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!record) throw new NotFoundError("Member not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const updateMember = async (gymId: string, id: string, input: UpdateMember) => {
  const result = memberUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid member data", result.error.flatten());
  }
  const { user: userInput, member: memberInput } = result.data;

  const existing = await db.query.member.findFirst({
    where: { gymId, id },
    with: { user: { columns: { id: true, name: true, email: true, image: true } } },
  });
  if (!existing || !existing.user) throw new NotFoundError("Member not found");
  const existingUser = existing.user;

  const updated = await db.transaction(async (tx) => {
    if (userInput) {
      await tx
        .update(user)
        .set({
          name: userInput.name ?? existingUser.name,
          email: userInput.email ?? existingUser.email,
          image: userInput.image !== undefined ? (userInput.image ?? null) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(user.id, existing.userId));
    }

    const [record] = memberInput
      ? await tx
          .update(member)
          .set({ ...memberInput, updatedAt: new Date() })
          .where(and(eq(member.gymId, gymId), eq(member.id, id)))
          .returning()
      : [existing];

    if (!record) throw new NotFoundError("Member not found");

    return record;
  });

  await invalidateMemberCache(gymId);

  return updated;
};

export const deleteMember = async (gymId: string, id: string) => {
  const record = await db.transaction(async (tx) => {
    const [deletedMember] = await tx
      .delete(member)
      .where(and(eq(member.gymId, gymId), eq(member.id, id)))
      .returning();

    if (!deletedMember) throw new NotFoundError("Member not found");

    await tx.delete(user).where(eq(user.id, deletedMember.userId));

    return deletedMember;
  });

  await Promise.all([
    invalidateMemberCache(gymId),
    invalidateMembership(gymId, id),
  ]);

  return record;
};
