import {
  NewTaxRate,
  UpdateTaxRate,
  taxRateInsertSchema,
  taxRateUpdateSchema,
} from "@repo/types";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { taxRate } from "../../db/schema";
import { NotFoundError, ValidationError } from "../../lib/errors";

export const listTaxRates = async (gymId: string) => {
  return db
    .select()
    .from(taxRate)
    .where(eq(taxRate.gymId, gymId))
    .orderBy(asc(taxRate.rate));
};

export const createTaxRate = async (gymId: string, input: NewTaxRate) => {
  const result = taxRateInsertSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid tax rate", result.error.flatten());
  }

  const [record] = await db
    .insert(taxRate)
    .values({ gymId, ...result.data })
    .returning();

  return record;
};

export const updateTaxRate = async (
  gymId: string,
  id: string,
  input: UpdateTaxRate
) => {
  const result = taxRateUpdateSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid tax rate", result.error.flatten());
  }

  const [record] = await db
    .update(taxRate)
    .set({ ...result.data, updatedAt: new Date() })
    .where(and(eq(taxRate.gymId, gymId), eq(taxRate.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Tax rate not found");
  return record;
};

export const deleteTaxRate = async (gymId: string, id: string) => {
  const [record] = await db
    .delete(taxRate)
    .where(and(eq(taxRate.gymId, gymId), eq(taxRate.id, id)))
    .returning();

  if (!record) throw new NotFoundError("Tax rate not found");
  return record;
};
