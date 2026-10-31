import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const notificationQueue = new Queue("notifications", {
  connection: redisConnection,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: {
      count: 1000,
    },

    removeOnFail: {
      count: 5000,
    },
  },
});