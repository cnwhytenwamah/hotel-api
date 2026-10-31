import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";

const notificationWorker = new Worker(
  "notifications",

  async (job) => {
    console.log("Processing notification job:", {
      id: job.id,
      name: job.name,
    });


    return {
      received: true,
    };
  },

  {
    connection: redisConnection.duplicate(),
    concurrency: 5,
  }
);

notificationWorker.on("ready", () => {
  console.log("Notification worker is ready.");
});

notificationWorker.on("completed", (job) => {
  console.log(`Notification job ${job.id} completed.`);
});

notificationWorker.on("failed", (job, error) => {
  console.error(
    `Notification job ${job?.id} failed:`,
    error.message
  );
});

notificationWorker.on("error", (error) => {
  console.error("Notification worker error:", error);
});

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  console.log(`${signal} received. Shutting down worker...`);

  try {
    await notificationWorker.close();
    await redisConnection.quit();

    console.log("Notification worker shut down successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Worker shutdown error:", error);
    process.exit(1);
  }
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);