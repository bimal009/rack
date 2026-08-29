import { randomUUID } from "node:crypto";
import {
  NewStaffWithUser,
  StaffListQuery,
  staffWithUserInsertSchema,
} from "@repo/types";
import { ValidationError } from "../../lib/errors";
import { db } from "../../db";
import { staff, user } from "../../db/schema";
import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";

export async function createStaffWithUser(data: NewStaffWithUser,gymId:string) {
  const result = staffWithUserInsertSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Invalid staff data", result.error.flatten());
  }
  const input = result.data;
  const name = `${input.firstName} ${input.lastName}`.trim();

  return await db.transaction(async (tx) => {
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
        allowAdminAccess: input.allowAdminAccess,
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
        activeInstructor: input.activeInstructor,
      })
      .returning();

    return { user: newUser, staff: newStaff };
  });
}


export const getAll = async (gymId: string, query: StaffListQuery) => {
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
      allowAdminAccess: staff.allowAdminAccess,
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
      activeInstructor: staff.activeInstructor,
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
  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getStaffByGym = async (gymId: string, userId: string) => {
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

  return gymStaff;
};