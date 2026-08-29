import "dotenv/config"
import Redis from "ioredis"
import { logger } from "./logger"

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
})

redis.on("error", (err) => logger.error({ err }, "Redis client error"))
redis.on("connect", () => logger.info("Redis connected"))






export const CACHE_KEYS = {
  PLAN: "plans",
  GYM: "gym",
  MEMBER: "member",
  STAFF: "staff",
  ROLE_PERMISSION: "role_permissions",
} as const;

export const CACHE_TTL = {
  SHORT: 60,            
  MEDIUM: 60 * 60,      
  LONG: 60 * 60 * 24,  
} as const;