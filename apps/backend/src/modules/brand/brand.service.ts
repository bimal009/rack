import {
  BrandListQuery,
  NewBrand,
  UpdateBrand,
  brandInsertSchema,
  brandUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { brand } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listBrands = async (gymId: string, query: BrandListQuery) => {
  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(brand.gymId, gymId),
    search ? ilike(brand.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(brand)
      .where(where)
      .orderBy(sortOrder === "asc" ? asc(brand.name) : desc(brand.name))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(brand).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
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
