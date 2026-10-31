import Redis from "ioredis";
import { env } from "./env";

export const redisConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy(times) {
    return Math.min(times * 500, 5000);
  },
});

redisConnection.on("connect", () => {
  console.log("Redis connection established.");
});

redisConnection.on("ready", () => {
  console.log("Redis is ready to accept commands.");
});

redisConnection.on("error", (error) => {
  console.error("Redis connection error:", error);
});

redisConnection.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisConnection.ping();

    console.log("Redis connected successfully.");
  } catch (error) {
    console.error("Unable to connect to Redis:", error);
    throw error;
  }
};