import {
  NewProduct,
  ProductListQuery,
  UpdateProduct,
  productInsertSchema,
  productUpdateSchema,
} from "@repo/types";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { product } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis, deleteByPattern } from "../../lib/redis";

const listKey = (gymId: string, query: ProductListQuery): string => {
  const {
    page,
    limit,
    search,
    sortOrder,
    categoryId,
    brandId,
    feature,
    visibility,
    isActive,
  } = query;
  return `${CACHE_KEYS.PRODUCT}:${gymId}:list:${page}:${limit}:${search ?? ""}:${sortOrder}:${categoryId ?? ""}:${brandId ?? ""}:${feature ?? ""}:${visibility ?? ""}:${isActive ?? ""}`;
};

const itemKey = (gymId: string, id: string): string =>
  `${CACHE_KEYS.PRODUCT}:${gymId}:item:${id}`;

const invalidate = (gymId: string): Promise<number> =>
  deleteByPattern(`${CACHE_KEYS.PRODUCT}:${gymId}:*`);

export const listProducts = async (gymId: string, query: ProductListQuery) => {
  const cacheKey = listKey(gymId, query);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const {
    page,
    limit,
    search,
    sortOrder,
    categoryId,
    brandId,
    feature,
    visibility,
    isActive,
  } = query;

  const [data, total] = await Promise.all([
    db.query.product.findMany({
      where: {
        gymId,
        categoryId,
        brandId,
        visibility,
        isActive,
        OR: search
          ? [{ name: { ilike: `%${search}%` } }, { sku: { ilike: `%${search}%` } }]
          : undefined,
        RAW: feature
          ? (table) => sql`${table.features} ? ${feature}`
          : undefined,
      },
      orderBy: { name: sortOrder },
      limit,
      offset: (page - 1) * limit,
      with: {
        category: { columns: { id: true, name: true } },
        brand: { columns: { id: true, name: true } },
        taxRate: { columns: { id: true, name: true, rate: true } },
      },
    }),
    db.$count(
      product,
      and(
        eq(product.gymId, gymId),
        categoryId ? eq(product.categoryId, categoryId) : undefined,
        brandId ? eq(product.brandId, brandId) : undefined,
        visibility ? eq(product.visibility, visibility) : undefined,
        isActive === undefined ? undefined : eq(product.isActive, isActive),
        search
          ? or(ilike(product.name, `%${search}%`), ilike(product.sku, `%${search}%`))
          : undefined,
        feature ? sql`${product.features} ? ${feature}` : undefined
      )
    ),
  ]);

  const result = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL.MEDIUM);

  return result;
};

export const getProduct = async (gymId: string, id: string) => {
  const cacheKey = itemKey(gymId, id);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const record = await db.query.product.findFirst({
    where: { gymId, id },
    with: {
      category: { columns: { id: true, name: true } },
      brand: { columns: { id: true, name: true } },
      taxRate: { columns: { id: true, name: true, rate: true } },
    },
  });

  if (!record) throw new NotFoundError("Product not found");

  await redis.set(cacheKey, JSON.stringify(record), "EX", CACHE_TTL.MEDIUM);

  return record;
};

const assertRefsBelongToGym = async (
  gymId: string,
  refs: { categoryId?: string; brandId?: string; taxRateId?: string }
): Promise<void> => {
  const [category, brand, taxRate] = await Promise.all([
    refs.categoryId
      ? db.query.productCategory.findFirst({
          where: { id: refs.categoryId, gymId },
          columns: { id: true },
        })
      : undefined,
    refs.brandId
      ? db.query.brand.findFirst({
          where: { id: refs.brandId, gymId },
          columns: { id: true },
        })
      : undefined,
    refs.taxRateId
      ? db.query.taxRate.findFirst({
          where: { id: refs.taxRateId, gymId },
          columns: { id: true },
        })
      : undefined,
  ]);

  if (refs.categoryId && !category) {
    throw new ValidationError("Category does not belong to this gym");
  }
  if (refs.brandId && !brand) {
    throw new ValidationError("Brand does not belong to this gym");
  }
  if (refs.taxRateId && !taxRate) {
    throw new ValidationError("Tax rate does not belong to this gym");
  }
};

export const createProduct = async (gymId: string, input: NewProduct) => {
  const result = productInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid product", result.error.flatten());
  }

  const { description, sku, ...values } = result.data;

  await assertRefsBelongToGym(gymId, {
    categoryId: values.categoryId,
    brandId: values.brandId,
    taxRateId: values.taxRateId,
  });

  const [record] = await db
    .insert(product)
    .values({
      gymId,
      ...values,
      description: description || null,
      sku: sku || null,
    })
    .returning({ id: product.id });

  if (!record) throw new NotFoundError("Product not found");

  await invalidate(gymId);

  return getProduct(gymId, record.id);
};

export const updateProduct = async (
  gymId: string,
  id: string,
  input: UpdateProduct
) => {
  const result = productUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid product", result.error.flatten());
  }

  const { description, sku, ...rest } = result.data;

  const values: Record<string, unknown> = { ...rest };
  if (description !== undefined) values.description = description || null;
  if (sku !== undefined) values.sku = sku || null;

  await assertRefsBelongToGym(gymId, {
    categoryId: values.categoryId as string | undefined,
    brandId: values.brandId as string | undefined,
    taxRateId: values.taxRateId as string | undefined,
  });

  const [record] = await db
    .update(product)
    .set({ ...values, updatedAt: new Date() })
    .where(and(eq(product.gymId, gymId), eq(product.id, id)))
    .returning({ id: product.id });

  if (!record) throw new NotFoundError("Product not found");

  await invalidate(gymId);

  return getProduct(gymId, id);
};

export const deleteProduct = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(product)
    .where(and(eq(product.gymId, gymId), eq(product.id, id)))
    .returning({ id: product.id });

  if (!record) throw new NotFoundError("Product not found");

  await invalidate(gymId);

  return record;
};
