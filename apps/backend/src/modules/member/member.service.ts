import { randomUUID } from "node:crypto";
import {
  MemberListQuery,
  NewMemberWithUser,
  UpdateMember,
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
  const input = result.data;
  const name = `${input.firstName} ${input.lastName}`.trim();

  const created = await db.transaction(async (tx) => {
    const [newUser] = await tx
      .insert(user)
      .values({
        id: randomUUID(),
        email: input.email,
        name,
        image: input.image ?? null,
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
        status: input.status,
        phone: input.phone,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        address: input.address,
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

export const updateMember = async (
  gymId: string,
  id: string,
  input: UpdateMember
) => {
  const result = memberUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid member data", result.error.flatten());
  }

  const [record] = await db
    .update(member)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(member.gymId, gymId), eq(member.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Member not found");

  await invalidateMemberCache(gymId);

  return record;
};

export const deleteMember = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(member)
    .where(and(eq(member.gymId, gymId), eq(member.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Member not found");

  await invalidateMemberCache(gymId);

  return record;
};
