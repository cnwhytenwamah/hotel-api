import { Worker } from "bullmq";

import { redisConnection } from "../config/redis";
import { sequelize } from "../config/database";
import { bookingHoldRepository } from "../modules/bookings/repositories/booking-hold.repository";

interface ExpireHoldJob {
  holdId: string;
}

export const bookingHoldWorker = new Worker<ExpireHoldJob>(
  "booking-holds",
  async (job) => {
    const { holdId } = job.data;

    await sequelize.transaction(async (transaction) => {
      const hold = await bookingHoldRepository.findHoldById(
        holdId,
        transaction
      );

      if (!hold || hold.status !== "active") {
        return;
      }

      if (hold.expiresAt.getTime() > Date.now()) {
        return;
      }

      await bookingHoldRepository.expireHold(hold, transaction);

      console.log(`Booking hold ${holdId} expired.`);
    });
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

bookingHoldWorker.on("failed", (job, error) => {
  console.error(
    `Booking hold expiration job ${job?.id} failed:`,
    error
  );
});

bookingHoldWorker.on("error", (error) => {
  console.error("Booking hold worker error:", error);
});

export const closeBookingHoldWorker = async (): Promise<void> => {
  await bookingHoldWorker.close();
};