import { openingHoursSchema, type OpeningHours } from "@repo/types";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { gymOperatingHour } from "../../db/schema";
import { ValidationError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis } from "../../lib/redis";

const cacheKey = (gymId: string): string => `${CACHE_KEYS.GYM_HOURS}:${gymId}`;

export const getOperatingHours = async (gymId: string): Promise<OpeningHours> => {
  const cached = await redis.get(cacheKey(gymId));
  if (cached) return JSON.parse(cached);

  const hours = await db.query.gymOperatingHour.findMany({
    where: { gymId },
    columns: { day: true, open: true, close: true },
  });

  await redis.set(cacheKey(gymId), JSON.stringify(hours), "EX", CACHE_TTL.MEDIUM);

  return hours;
};

export const updateOperatingHours = async (
  gymId: string,
  input: OpeningHours
): Promise<OpeningHours> => {
  const result = openingHoursSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid operating hours", result.error.flatten());
  }

  await db.transaction(async (tx) => {
    await tx.delete(gymOperatingHour).where(eq(gymOperatingHour.gymId, gymId));

    if (result.data.length > 0) {
      await tx.insert(gymOperatingHour).values(
        result.data.map((range) => ({ gymId, ...range }))
      );
    }
  });

  await redis.del(cacheKey(gymId));

  return result.data;
};
