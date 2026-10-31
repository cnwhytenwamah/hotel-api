import { notificationQueue } from "../src/queues/notification.queue";
import { redisConnection } from "../src/config/redis";

const testQueue = async (): Promise<void> => {
  try {
    const job = await notificationQueue.add(
      "test-notification",
      {
        message: "BullMQ is working correctly.",
        source: "hotel-api",
      }
    );

    console.log("Test job successfully added to queue.");
    console.log("Job ID:", job.id);
  } catch (error) {
    console.error("Queue test failed:", error);
    process.exitCode = 1;
  } finally {
    await notificationQueue.close();
    await redisConnection.quit();
  }
};

void testQueue();