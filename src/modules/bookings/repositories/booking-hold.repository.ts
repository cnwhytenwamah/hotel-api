import {
  QueryTypes,
  Transaction,
} from "sequelize";

import { sequelize } from "../../../config/database";
import { BookingHold } from "../models/booking-hold.model";
import { BookingHoldRoom } from "../models/booking-hold-room.model";

export interface AvailablePhysicalRoom {
  id: string;
  roomTypeId: string;
}

export interface HeldPhysicalRoom {
  roomId: string;
  roomTypeId: string;
  hotelId: string;
  isActive: boolean;
  status: string;
}

class BookingHoldRepository {
  async findAndLockAvailableRooms(
    hotelId: string,
    roomTypeId: string,
    checkInDate: string,
    checkOutDate: string,
    roomCount: number,
    transaction: Transaction
  ): Promise<AvailablePhysicalRoom[]> {
    const sql = `
      SELECT
        r.id,
        r.room_type_id AS "roomTypeId"
      FROM rooms r
      WHERE
        r.hotel_id = :hotelId
        AND r.room_type_id = :roomTypeId
        AND r.is_active = TRUE
        AND r.status = 'available'

        AND NOT EXISTS (
          SELECT 1
          FROM booking_rooms br
          INNER JOIN bookings b
            ON b.id = br.booking_id
          WHERE
            br.room_id = r.id
            AND b.status IN (
              'awaiting_payment',
              'confirmed',
              'checked_in'
            )
            AND b.check_in_date < :checkOutDate
            AND b.check_out_date > :checkInDate
        )

        AND NOT EXISTS (
          SELECT 1
          FROM booking_hold_rooms bhr
          INNER JOIN booking_holds bh
            ON bh.id = bhr.hold_id
          WHERE
            bhr.room_id = r.id
            AND bh.status = 'active'
            AND bh.expires_at > CURRENT_TIMESTAMP
            AND bh.check_in_date < :checkOutDate
            AND bh.check_out_date > :checkInDate
        )

      ORDER BY r.room_number ASC
      LIMIT :roomCount
      FOR UPDATE OF r SKIP LOCKED;
    `;

    return sequelize.query<AvailablePhysicalRoom>(sql, {
      replacements: {
        hotelId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        roomCount,
      },
      type: QueryTypes.SELECT,
      transaction,
    });
  }

  async findAndLockHeldRooms( holdId: string, transaction: Transaction ): Promise<HeldPhysicalRoom[]> {
    const sql = `
      SELECT
        r.id AS "roomId",
        r.room_type_id AS "roomTypeId",
        r.hotel_id AS "hotelId",
        r.is_active AS "isActive",
        r.status AS "status"
      FROM booking_hold_rooms bhr
      INNER JOIN rooms r
        ON r.id = bhr.room_id
      WHERE bhr.hold_id = :holdId
      ORDER BY r.room_number ASC
      FOR UPDATE OF r;
    `;

    return sequelize.query<HeldPhysicalRoom>(sql, {
      replacements: { holdId },
      type: QueryTypes.SELECT,
      transaction,
    });
  }

  async createHold(
    data: {
      hotelId: string;
      tokenHash: string;
      checkInDate: string;
      checkOutDate: string;
      adults: number;
      children: number;
      roomCount: number;
      expiresAt: Date;
    },
    transaction: Transaction
  ): Promise<BookingHold> {
    return BookingHold.create(
      {
        ...data,
        status: "active",
        bookingId: null,
      },
      { transaction }
    );
  }

  async createHeldRooms(
    holdId: string,
    rooms: AvailablePhysicalRoom[],
    transaction: Transaction
  ): Promise<void> {
    await BookingHoldRoom.bulkCreate(
      rooms.map((room) => ({
        holdId,
        roomId: room.id,
        roomTypeId: room.roomTypeId,
      })),
      { transaction }
    );
  }

  async findActiveHoldByTokenHash( tokenHash: string, transaction?: Transaction ) {
    return BookingHold.findOne({
        where: {
            tokenHash,
            status: "active",
            },
            transaction,
            ...(transaction
            ? { lock: transaction.LOCK.UPDATE }
            : {}),
        });
    }

  async findHoldById(holdId: string, transaction?: Transaction) {
    return BookingHold.findByPk(holdId, {
            transaction,
            ...(transaction ? { lock: transaction.LOCK.UPDATE } : {}),
        });
    }

  async findHeldRooms(holdId: string, transaction?: Transaction) {
    return BookingHoldRoom.findAll({
      where: { holdId },
      transaction,
    });
  }

  async expireHold(
    hold: BookingHold,
    transaction: Transaction
  ): Promise<void> {
    await hold.update(
      { status: "expired" },
      { transaction }
    );
  }

  async releaseHold(
    hold: BookingHold,
    transaction: Transaction
  ): Promise<void> {
    await hold.update(
      { status: "released" },
      { transaction }
    );
  }
}

export const bookingHoldRepository = new BookingHoldRepository();