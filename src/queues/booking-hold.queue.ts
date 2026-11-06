import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const bookingHoldQueue = new Queue("booking-holds", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});