import {
  AreaTypeListQuery,
  NewAreaType,
  UpdateAreaType,
  areaTypeInsertSchema,
  areaTypeUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { areaType } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listAreaTypes = async (gymId: string, query: AreaTypeListQuery) => {
  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(areaType.gymId, gymId),
    search ? ilike(areaType.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(areaType)
      .where(where)
      .orderBy(sortOrder === "asc" ? asc(areaType.name) : desc(areaType.name))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(areaType).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const createAreaType = async (gymId: string, input: NewAreaType) => {
  const result = areaTypeInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid area type", result.error.flatten());
  }

  const [record] = await db
    .insert(areaType)
    .values({ gymId, ...result.data })
    .returning();

  return record;
};

export const updateAreaType = async (
  gymId: string,
  id: string,
  input: UpdateAreaType
) => {
  const result = areaTypeUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid area type", result.error.flatten());
  }

  const [record] = await db
    .update(areaType)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(areaType.gymId, gymId), eq(areaType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Area type not found");
  return record;
};

export const deleteAreaType = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(areaType)
    .where(and(eq(areaType.gymId, gymId), eq(areaType.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Area type not found");
  return record;
};
