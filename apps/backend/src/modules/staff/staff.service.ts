import { randomUUID } from "node:crypto";
import {
  NewStaffWithUser,
  StaffListQuery,
  UpdateStaff,
  staffUpdateSchema,
  staffWithUserInsertSchema,
} from "@repo/types";
import { ForbiddenError, NotFoundError, ValidationError } from "../../lib/errors";
import { db } from "../../db";
import { staff, user } from "../../db/schema";
import { and, eq, exists, ilike, or, sql } from "drizzle-orm";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const staffListKey = (gymId: string, query: StaffListQuery): string => {
  const { page, limit, search, sortOrder, role, status } = query;
  return `${CACHE_KEYS.STAFF}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}:${role ?? ""}:${status ?? ""}`;
};

const staffItemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.STAFF}:${gymId}:item:${id}`;

const staffByUserKey = (gymId: string, userId: string): string =>
  `${CACHE_KEYS.STAFF}:${gymId}:byUser:${userId}`;

const invalidateStaffCache = async (gymId: string): Promise<void> => {
  await deleteByPattern(`${CACHE_KEYS.STAFF}:${gymId}:*`);
};

export async function createStaffWithUser(data: NewStaffWithUser, gymId: string) {
  const result = staffWithUserInsertSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Invalid staff data", result.error.flatten());
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

    const [newStaff] = await tx
      .insert(staff)
      .values({
        gymId,
        userId: newUser.id,
        role: input.role,
        isActive: input.isActive,
        phone: input.phone,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        address: input.address,
        payType: input.payType,
        payRate: input.payRate,
        instructorTypeId: input.instructorTypeId,
        experience: input.experience,
        certifications: input.certifications,
        canBeBooked: input.canBeBooked,
        visibility: input.visibility,
        maxConcurrentBookings: input.maxConcurrentBookings,
      })
      .returning();

    return { user: newUser, staff: newStaff };
  });

  await invalidateStaffCache(gymId);

  return created;
}

export const getAll = async (gymId: string, query: StaffListQuery) => {
  const cacheKey = staffListKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { page, limit, sortOrder, search, role, status } = query;

  const [data, total] = await Promise.all([
    db.query.staff.findMany({
      where: {
        gymId,
        role,
        isActive: status ? status === "active" : undefined,
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
      staff,
      and(
        eq(staff.gymId, gymId),
        role ? eq(staff.role, role) : undefined,
        status ? eq(staff.isActive, status === "active") : undefined,
        search
          ? exists(
              db
                .select({ one: sql`1` })
                .from(user)
                .where(
                  and(
                    eq(user.id, staff.userId),
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

export const getStaffById = async (gymId: string, id: string) => {
  const cacheKey = staffItemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const record = await db.query.staff.findFirst({
    where: { gymId, id },
  });

  if (!record) throw new NotFoundError("Staff not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

export const getStaffByGym = async (gymId: string, userId: string) => {
  const cacheKey = staffByUserKey(gymId, userId);

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const gymStaff = await db.query.staff.findFirst({
    where: { gymId, userId, isActive: true },
  });

  if (gymStaff) {
    await redis.set(cacheKey, JSON.stringify(gymStaff), "EX", CACHE_TTL.MEDIUM);
  }

  return gymStaff;
};

export const updateStaff = async (
  gymId: string,
  id: string,
  input: UpdateStaff
) => {
  const result = staffUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid staff data", result.error.flatten());
  }

  const existing = await db.query.staff.findFirst({
    where: { gymId, id },
    columns: { isOwner: true },
  });

  if (!existing) throw new NotFoundError("Staff not found");

  if (existing.isOwner) {
    throw new ForbiddenError("The gym owner cannot be edited");
  }

  const [record] = await db
    .update(staff)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(staff.gymId, gymId), eq(staff.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Staff not found");

  await invalidateStaffCache(gymId);

  return record;
};

export const deleteStaff = async (gymId: string, id: string) => {
  const existing = await db.query.staff.findFirst({
    where: { gymId, id },
    columns: { isOwner: true },
  });

  if (!existing) throw new NotFoundError("Staff not found");

  if (existing.isOwner) {
    throw new ForbiddenError("The gym owner cannot be removed");
  }

  const [record] = await db
    .delete(staff)
    .where(and(eq(staff.gymId, gymId), eq(staff.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Staff not found");

  await invalidateStaffCache(gymId);

  return record;
};
