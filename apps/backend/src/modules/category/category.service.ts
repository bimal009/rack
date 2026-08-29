import {
  ProductCategoryListQuery,
  NewProductCategory,
  UpdateProductCategory,
  productCategoryInsertSchema,
  productCategoryUpdateSchema,
} from "@repo/types";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../../db";
import { productCategory } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listCategories = async (
  gymId: string,
  query: ProductCategoryListQuery
) => {
  const { page, limit, search, sortOrder } = query;
  const where = and(
    eq(productCategory.gymId, gymId),
    search ? ilike(productCategory.name, `%${search}%`) : undefined
  );

  const [data, [totalRow]] = await Promise.all([
    db
      .select()
      .from(productCategory)
      .where(where)
      .orderBy(
        sortOrder === "asc"
          ? asc(productCategory.name)
          : desc(productCategory.name)
      )
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ total: count() }).from(productCategory).where(where),
  ]);

  const total = totalRow?.total ?? 0;
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const createCategory = async (
  gymId: string,
  input: NewProductCategory
) => {
  const result = productCategoryInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid category", result.error.flatten());
  }

  const [record] = await db
    .insert(productCategory)
    .values({ gymId, name: result.data.name })
    .returning();

  return record;
};

export const updateCategory = async (
  gymId: string,
  id: string,
  input: UpdateProductCategory
) => {
  const result = productCategoryUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid category", result.error.flatten());
  }

  const [record] = await db
    .update(productCategory)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(productCategory.gymId, gymId), eq(productCategory.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Category not found");
  return record;
};

export const deleteCategory = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(productCategory)
    .where(and(eq(productCategory.gymId, gymId), eq(productCategory.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Category not found");
  return record;
};
