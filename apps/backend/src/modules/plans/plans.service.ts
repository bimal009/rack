import { db } from "../../db";
import { NotFoundError } from "../../lib/errors";
import { CACHE_KEYS, CACHE_TTL, redis } from "../../lib/redis";

const planKey = (slug: string): string => `${CACHE_KEYS.PLAN}:${slug}`;

export async function get() {
  const cacheKey = planKey("all");

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const plans = await db.query.plan.findMany({
    where: { isActive: true },
    orderBy: { monthlyPrice: "asc" },
  });

  if (plans.length === 0) {
    throw new NotFoundError("No plans found");
  }

  await redis.set(cacheKey, JSON.stringify(plans), "EX", CACHE_TTL.LONG);

  return plans;
}