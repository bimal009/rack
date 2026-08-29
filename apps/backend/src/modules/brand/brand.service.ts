import {
  NewBrand,
  UpdateBrand,
  brandInsertSchema,
  brandUpdateSchema,
} from "@repo/types";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { brand } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listBrands = async (gymId: string) => {
  return db
    .select()
    .from(brand)
    .where(eq(brand.gymId, gymId))
    .orderBy(asc(brand.name));
};

export const createBrand = async (gymId: string, input: NewBrand) => {
  const result = brandInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid brand", result.error.flatten());
  }

  const [record] = await db
    .insert(brand)
    .values({ gymId, name: result.data.name })
    .returning();

  return record;
};

export const updateBrand = async (
  gymId: string,
  id: string,
  input: UpdateBrand
) => {
  const result = brandUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid brand", result.error.flatten());
  }

  const [record] = await db
    .update(brand)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(brand.gymId, gymId), eq(brand.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Brand not found");
  return record;
};

export const deleteBrand = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(brand)
    .where(and(eq(brand.gymId, gymId), eq(brand.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Brand not found");
  return record;
};
