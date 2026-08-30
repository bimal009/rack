import { randomUUID } from "node:crypto";
import {
  NewStaffWithUser,
  StaffListQuery,
  UpdateStaff,
  staffUpdateSchema,
  staffWithUserInsertSchema,
} from "@repo/types";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { db } from "../../db";
import { staff, user } from "../../db/schema";
import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
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

  const where = and(
    eq(staff.gymId, gymId),
    role ? eq(staff.role, role) : undefined,
    status ? eq(staff.isActive, status === "active") : undefined,
    search
      ? or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
      : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select({
        id: staff.id,
        gymId: staff.gymId,
        userId: staff.userId,
        role: staff.role,
        isActive: staff.isActive,
        phone: staff.phone,
        dateOfBirth: staff.dateOfBirth,
        gender: staff.gender,
        address: staff.address,
        payType: staff.payType,
        payRate: staff.payRate,
        instructorTypeId: staff.instructorTypeId,
        experience: staff.experience,
        certifications: staff.certifications,
        canBeBooked: staff.canBeBooked,
        visibility: staff.visibility,
        maxConcurrentBookings: staff.maxConcurrentBookings,
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(staff)
      .innerJoin(user, eq(staff.userId, user.id))
      .where(where)
      .orderBy(
        sortOrder === "asc" ? asc(staff.createdAt) : desc(staff.createdAt)
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db
      .select({ total: count() })
      .from(staff)
      .innerJoin(user, eq(staff.userId, user.id))
      .where(where),
  ]);

  const total = totalRow?.total ?? 0;
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

  const [record] = await db
    .select()
    .from(staff)
    .where(and(eq(staff.gymId, gymId), eq(staff.id, id)))
    .limit(1);

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

  const [gymStaff] = await db
    .select()
    .from(staff)
    .where(
      and(
        eq(staff.gymId, gymId),
        eq(staff.userId, userId),
        eq(staff.isActive, true)
      )
    )
    .limit(1);

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
  const [record] = await db
    .delete(staff)
    .where(and(eq(staff.gymId, gymId), eq(staff.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Staff not found");

  await invalidateStaffCache(gymId);

  return record;
};