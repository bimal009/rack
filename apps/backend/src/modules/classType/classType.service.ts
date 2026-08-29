import {
  NewClassType,
  UpdateClassType,
  classTypeInsertSchema,
  classTypeUpdateSchema,
} from "@repo/types";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { classType } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listClassTypes = async (gymId: string) => {
  return db
    .select()
    .from(classType)
    .where(eq(classType.gymId, gymId))
    .orderBy(asc(classType.name));
};

export const createClassType = async (gymId: string, input: NewClassType) => {
  const result = classTypeInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid class type", result.error.flatten());
  }

  const [record] = await db
    .insert(classType)
    .values({ gymId, ...result.data })
    .returning();

  return record;
};

export const updateClassType = async (
  gymId: string,
  id: string,
  input: UpdateClassType
) => {
  const result = classTypeUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid class type", result.error.flatten());
  }

  const [record] = await db
    .update(classType)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(classType.gymId, gymId), eq(classType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Class type not found");
  return record;
};

export const deleteClassType = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(classType)
    .where(and(eq(classType.gymId, gymId), eq(classType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Class type not found");
  return record;
};
