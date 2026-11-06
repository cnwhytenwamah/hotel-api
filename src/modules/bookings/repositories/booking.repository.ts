import { CreationAttributes, Transaction } from "sequelize";

import { Booking } from "../models/booking.model";
import { BookingRoom } from "../models/booking-room.model";
import { BookingGuest } from "../models/booking-guest.model";
import { BookingRoomNight } from "../models/booking-room-night.model";

class BookingRepository {
  async createBooking(
    data: Partial<Booking>,
    transaction: Transaction
  ): Promise<Booking> {
    return Booking.create(data as never, { transaction });
  }

  async createBookingRooms(
    data: Array<{
      bookingId: string;
      roomTypeId: string;
      roomId: string;
    }>,
    transaction: Transaction
  ): Promise<BookingRoom[]> {
    return BookingRoom.bulkCreate(data, {
      transaction,
      returning: true,
    });
  }

  async createBookingGuests(
    data: Array<{
      bookingId: string;
      bookingRoomId: string | null;
      firstName: string;
      lastName: string;
      email: string | null;
      phone: string | null;
      country: string | null;
      isPrimary: boolean;
    }>,
    transaction: Transaction
  ): Promise<void> {
    await BookingGuest.bulkCreate(data, { transaction });
  }

  async createRoomNights(
    data: Array<{
      bookingRoomId: string;
      stayDate: string;
      nightlyRate: string;
      rateName: string | null;
    }>,
    transaction: Transaction
  ): Promise<void> {
    await BookingRoomNight.bulkCreate(data, { transaction });
  }
}

export const bookingRepository = new BookingRepository();