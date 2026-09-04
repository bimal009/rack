import "dotenv/config";
import Redis from "ioredis";
import { logger } from "./logger";

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => logger.error({ err }, "Redis client error"));
redis.on("connect", () => logger.info("Redis connected"));

export const CACHE_KEYS = {
  PLAN: "plans",
  GYM: "gym",
  MEMBER: "member",
  STAFF: "staff",
  ROLE_PERMISSION: "role_permissions",
  SPORTS: "sports",
  TAX_RATE: "tax_rate",
  BRANDS: "brands",
  AREA_TYPE: "area_type",
  AREA: "area",
  PRODUCT_CATEGORY: "product_category",
  CLASS_TYPE: "class_type",
  INSTRUCTOR_TYPE: "instructor_type",
  PAY_RATE: "pay_rate",
  MEMBERSHIP_CATEGORY: "membership_category",
  GYM_PLAN: "gym_plan",
  PRODUCT: "product",
  PRODUCT_FEATURE: "product_feature",
} as const;

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 60 * 60, // 1 hour
  LONG: 60 * 60 * 24, // 1 day
} as const;


export const scanKeys = async (
  pattern: string,
  count = 100
): Promise<string[]> => {
  const found: string[] = [];
  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      count
    );
    cursor = nextCursor;
    found.push(...keys);
  } while (cursor !== "0");

  return found;
};


export const deleteByPattern = async (pattern: string): Promise<number> => {
  const keys = await scanKeys(pattern);
  if (keys.length === 0) return 0;

  await redis.unlink(...keys);
  return keys.length;
};