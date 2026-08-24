import "dotenv/config"
import Redis from "ioredis"
import { logger } from "./logger"

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
})

redis.on("error", (err) => logger.error({ err }, "Redis client error"))
redis.on("connect", () => logger.info("Redis connected"))
