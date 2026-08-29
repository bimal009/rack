import {
  InstructorTypeListQuery,
  NewInstructorType,
  UpdateInstructorType,
  instructorTypeInsertSchema,
  instructorTypeUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { instructorType } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listInstructorTypes = async (
  gymId: string,
  query: InstructorTypeListQuery
) => {
  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(instructorType.gymId, gymId),
    search ? ilike(instructorType.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(instructorType)
      .where(where)
      .orderBy(
        sortOrder === "asc" ? asc(instructorType.name) : desc(instructorType.name)
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(instructorType).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const createInstructorType = async (
  gymId: string,
  input: NewInstructorType
) => {
  const result = instructorTypeInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid instructor type", result.error.flatten());
  }

  const [record] = await db
    .insert(instructorType)
    .values({ gymId, ...result.data })
    .returning();

  return record;
};

export const updateInstructorType = async (
  gymId: string,
  id: string,
  input: UpdateInstructorType
) => {
  const result = instructorTypeUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid instructor type", result.error.flatten());
  }

  const [record] = await db
    .update(instructorType)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(instructorType.gymId, gymId), eq(instructorType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Instructor type not found");
  return record;
};

export const deleteInstructorType = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(instructorType)
    .where(and(eq(instructorType.gymId, gymId), eq(instructorType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Instructor type not found");
  return record;
};
