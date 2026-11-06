import { createHash, randomBytes } from "crypto";
import { Transaction } from "sequelize";

import { sequelize } from "../../../config/database";
import { AppError } from "../../../utils/app-error";
import { Hotel } from "../../hotels/models/hotel.model";
import { RoomType } from "../../room-types/models/room-type.model";
import { bookingHoldRepository } from "../repositories/booking-hold.repository";
import { bookingHoldQueue } from "../../../queues/booking-hold.queue";

interface CreateHoldInput {
  hotelId: string;
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomCount: number;
}

const HOLD_DURATION_MS = 10 * 60 * 1000;

class BookingHoldService {
  async createHold(input: CreateHoldInput): Promise<{
    holdId: string;
    holdToken: string;
    expiresAt: Date;
    durationSeconds: number;
    roomsReserved: number;
    checkInDate: string;
    checkOutDate: string;
    message: string;
  }> {
    const hotel = await Hotel.findOne({
      where: {
        id: input.hotelId,
        isActive: true,
      },
    });

    if (!hotel) {
      throw new AppError("Active hotel not found.", 404);
    }

    const roomType = await RoomType.findOne({
      where: {
        id: input.roomTypeId,
        hotelId: input.hotelId,
        isActive: true,
      },
    });

    if (!roomType) {
      throw new AppError(
        "Active room category not found for this hotel.",
        404
      );
    }

    if (input.adults > roomType.maxAdults * input.roomCount) {
      throw new AppError(
        "The selected rooms cannot accommodate the requested adults.",
        400
      );
    }

    if (input.children > roomType.maxChildren * input.roomCount) {
      throw new AppError(
        "The selected rooms cannot accommodate the requested children.",
        400
      );
    }

    if (
      input.adults + input.children >
      roomType.maxOccupancy * input.roomCount
    ) {
      throw new AppError(
        "The selected rooms cannot accommodate the total number of guests.",
        400
      );
    }

    // Generate a secret token. Only its SHA-256 hash is stored in PostgreSQL.
    const token = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(token);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + HOLD_DURATION_MS);

    const hold = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (transaction) => {
        const rooms =
            await bookingHoldRepository.findAndLockAvailableRooms(
                input.hotelId,
                input.roomTypeId,
                input.checkInDate,
                input.checkOutDate,
                input.roomCount,
                transaction
            );

            if (rooms.length !== input.roomCount) {
            throw new AppError(
                "Not enough rooms are currently available for those dates.",
                409
            );
        }

        const createdHold = await bookingHoldRepository.createHold(
        {
            hotelId: input.hotelId,
            tokenHash,
            checkInDate: input.checkInDate,
            checkOutDate: input.checkOutDate,
            adults: input.adults,
            children: input.children,
            roomCount: input.roomCount,
            expiresAt,
        },
        transaction
        );

        await bookingHoldRepository.createHeldRooms(
          createdHold.id,
          rooms,
          transaction
        );

        return createdHold;
      }
    );

    // PostgreSQL expiry remains authoritative if Redis is temporarily unavailable.
    try {
      await bookingHoldQueue.add(
        "expire-hold",
        { holdId: hold.id },
        {
          delay: HOLD_DURATION_MS,
          jobId: `expire-hold-${hold.id}`,
          removeOnComplete: true,
          removeOnFail: 1000,
        }
      );
    } catch (error) {
      console.error("Unable to schedule booking hold expiration:", error);
    }

    return {
      holdId: hold.id,
      holdToken: token,
      expiresAt: hold.expiresAt,
      durationSeconds: HOLD_DURATION_MS / 1000,
      roomsReserved: input.roomCount,
      checkInDate: hold.checkInDate,
      checkOutDate: hold.checkOutDate,
      message: "Rooms temporarily reserved. Complete your booking before expiry.",
    };
  }

  async releaseHold(token: string) {
    const tokenHash = this.hashToken(token);

    return sequelize.transaction(async (transaction) => {
      const hold = await bookingHoldRepository.findActiveHoldByTokenHash(
        tokenHash,
        transaction
      );

      if (!hold) {
        throw new AppError("Active booking hold not found.", 404);
      }

      if (hold.expiresAt.getTime() <= Date.now()) {
        await bookingHoldRepository.expireHold(hold, transaction);

        return {
          released: false,
          expired: true,
        };
      }

      await bookingHoldRepository.releaseHold(hold, transaction);

      return {
        released: true,
        expired: false,
      };
    });
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}

export const bookingHoldService = new BookingHoldService();