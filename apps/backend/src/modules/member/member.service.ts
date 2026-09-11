import { randomUUID } from "node:crypto";
import {
  MemberListQuery,
  NewMemberWithUser,
  UpdateMember,
  generateMemberEmail,
  memberUpdateSchema,
  memberWithUserInsertSchema,
} from "@repo/types";
import { and, eq, exists, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { member, user } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

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
  const result = memberWithUserInsertSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Invalid member data", result.error.flatten());
  }
  const { user: userInput, member: memberInput } = result.data;
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

    return { user: newUser, member: newMember };
  });

  await invalidateMemberCache(gymId);

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
        deletedAt: { isNull: true },
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
    where: { gymId, id, deletedAt: { isNull: true } },
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
  where: { gymId, id, deletedAt: { isNull: true } },
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
  const [record] = await db
    .update(member)
    .set({ deletedAt: new Date() })
    .where(and(eq(member.gymId, gymId), eq(member.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Member not found");

  await invalidateMemberCache(gymId);

  return record;
};
