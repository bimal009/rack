import {
  NewProductCategory,
  UpdateProductCategory,
  productCategoryInsertSchema,
  productCategoryUpdateSchema,
} from "@repo/types";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { productCategory } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listCategories = async (gymId: string) => {
  return db
    .select()
    .from(productCategory)
    .where(eq(productCategory.gymId, gymId))
    .orderBy(asc(productCategory.name));
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
