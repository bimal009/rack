import {
  ClassTypeListQuery,
  NewClassType,
  UpdateClassType,
  classTypeInsertSchema,
  classTypeUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { classType } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listClassTypes = async (
  gymId: string,
  query: ClassTypeListQuery
) => {
  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(classType.gymId, gymId),
    search ? ilike(classType.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(classType)
      .where(where)
      .orderBy(sortOrder === "asc" ? asc(classType.name) : desc(classType.name))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(classType).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
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
