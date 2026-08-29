import {
  NewInstructorType,
  UpdateInstructorType,
  instructorTypeInsertSchema,
  instructorTypeUpdateSchema,
} from "@repo/types";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { instructorType } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listInstructorTypes = async (gymId: string) => {
  return db
    .select()
    .from(instructorType)
    .where(eq(instructorType.gymId, gymId))
    .orderBy(asc(instructorType.name));
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
