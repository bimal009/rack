import {
  GymSportListQuery,
  NewGymSport,
  UpdateGymSport,
  gymSportInsertSchema,
  gymSportUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { gymSport } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listSports = async (gymId: string, query: GymSportListQuery) => {
  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(gymSport.gymId, gymId),
    search ? ilike(gymSport.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(gymSport)
      .where(where)
      .orderBy(sortOrder === "asc" ? asc(gymSport.name) : desc(gymSport.name))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(gymSport).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const createSport = async (gymId: string, input: NewGymSport) => {
  const result = gymSportInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid sport", result.error.flatten());
  }

  const [record] = await db
    .insert(gymSport)
    .values({ gymId, name: result.data.name })
    .returning();

  return record;
};

export const updateSport = async (
  gymId: string,
  id: string,
  input: UpdateGymSport
) => {
  const result = gymSportUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid sport", result.error.flatten());
  }

  const [record] = await db
    .update(gymSport)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(gymSport.gymId, gymId), eq(gymSport.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Sport not found");
  return record;
};

export const deleteSport = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(gymSport)
    .where(and(eq(gymSport.gymId, gymId), eq(gymSport.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Sport not found");
  return record;
};
