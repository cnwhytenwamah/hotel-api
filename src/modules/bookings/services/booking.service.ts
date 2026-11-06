import { createHash, randomBytes } from "crypto";
import { Transaction } from "sequelize";

import { sequelize } from "../../../config/database";
import { AppError } from "../../../utils/app-error";

import { bookingHoldRepository } from "../repositories/booking-hold.repository";
import { bookingRepository } from "../repositories/booking.repository";
import { quotationService } from "./quotation.service";

import type {
  CreateBookingBody,
  BookingGuestBody,
} from "../validator/booking.validator";

type GuestInput = BookingGuestBody;
type CreateBookingInput = CreateBookingBody;

class BookingService {
  async createBooking(
    input: CreateBookingInput
  ): Promise<{ booking: any; message: string }> {
    const token = input.holdToken.trim();

    if (!token) {
      throw new AppError("A valid booking hold token is required.", 400);
    }

    const primaryGuest = input.primaryGuest;

    if (!primaryGuest) {
      throw new AppError("Primary guest information is required.", 400);
    }

    const primaryFirstName = primaryGuest.firstName.trim();
    const primaryLastName = primaryGuest.lastName.trim();
    const primaryEmail = primaryGuest.email?.trim();
    const primaryPhone = primaryGuest.phone?.trim();

    if (!primaryFirstName || !primaryLastName) {
      throw new AppError(
        "The primary guest's first and last names are required.",
        400
      );
    }

    if (!primaryEmail) {
      throw new AppError(
        "The primary guest's email address is required.",
        400
      );
    }

    if (!primaryPhone) {
      throw new AppError(
        "The primary guest's phone number is required.",
        400
      );
    }

    const tokenHash = this.hashToken(token);

    const outcome = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (transaction) => {
        // 1. Lock the active hold so it cannot be converted twice.
        const hold =
          await bookingHoldRepository.findActiveHoldByTokenHash(
            tokenHash,
            transaction
          );

        if (!hold) {
          throw new AppError(
            "Active booking hold not found. It may have expired or already been used.",
            404
          );
        }

        // 2. Expire the hold and allow this transaction to commit.
        if (hold.expiresAt.getTime() <= Date.now()) {
          await bookingHoldRepository.expireHold(hold, transaction);

          return { kind: "expired" as const };
        }

        // 3. Retrieve and lock the physical rooms assigned to this hold.
        const heldRooms = await bookingHoldRepository.findAndLockHeldRooms(
          hold.id,
          transaction
        );

        if (
          heldRooms.length === 0 ||
          heldRooms.length !== hold.roomCount
        ) {
          throw new AppError(
            "The rooms reserved by this hold could not be verified.",
            409
          );
        }

        // 4. Verify that all held rooms belong to one room category.
        const roomTypeIds = [
          ...new Set(heldRooms.map((room) => room.roomTypeId)),
        ];

        if (roomTypeIds.length !== 1) {
          throw new AppError(
            "This booking hold contains an invalid room selection.",
            409
          );
        }

        const roomTypeId = roomTypeIds[0];

        // 5. Verify that every held physical room is still bookable.
        const invalidRoom = heldRooms.some(
          (room) =>
            room.hotelId !== hold.hotelId ||
            room.roomTypeId !== roomTypeId ||
            !room.isActive ||
            room.status !== "available"
        );

        if (invalidRoom) {
          throw new AppError(
            "One or more rooms reserved by this hold are no longer available. Please search for availability again.",
            409
          );
        }

        // 6. Recalculate pricing on the server.
        const quotation = await quotationService.createQuotation({
          hotelId: hold.hotelId,
          roomTypeId,
          checkInDate: hold.checkInDate,
          checkOutDate: hold.checkOutDate,
          adults: hold.adults,
          children: hold.children,
          roomCount: hold.roomCount,
        });

        // 7. Normalize guest information.
        const suppliedGuests = input.guests ?? [];

        const primaryAlreadyIncluded = suppliedGuests.some(
          (guest) =>
            guest.firstName.trim().toLowerCase() ===
              primaryFirstName.toLowerCase() &&
            guest.lastName.trim().toLowerCase() ===
              primaryLastName.toLowerCase()
        );

        const guests: GuestInput[] = primaryAlreadyIncluded
          ? suppliedGuests
          : [primaryGuest, ...suppliedGuests];

        const normalizedGuests = guests.map((guest) => {
          const firstName = guest.firstName.trim();
          const lastName = guest.lastName.trim();

          const isPrimary =
            firstName.toLowerCase() ===
              primaryFirstName.toLowerCase() &&
            lastName.toLowerCase() === primaryLastName.toLowerCase();

          return {
            firstName,
            lastName,
            email: isPrimary
              ? primaryEmail
              : guest.email?.trim() || undefined,
            phone: isPrimary
              ? primaryPhone
              : guest.phone?.trim() || undefined,
            country: isPrimary
              ? primaryGuest.country?.trim() || undefined
              : guest.country?.trim() || undefined,
            isPrimary,
          };
        });

        const primaryCount = normalizedGuests.filter(
          (guest) => guest.isPrimary
        ).length;

        if (primaryCount !== 1) {
          throw new AppError(
            "Exactly one primary guest must be supplied.",
            400
          );
        }

        if (
          normalizedGuests.some(
            (guest) => !guest.firstName || !guest.lastName
          )
        ) {
          throw new AppError(
            "Every guest must have a first name and last name.",
            400
          );
        }

        const maximumGuests = hold.adults + hold.children;

        if (normalizedGuests.length > maximumGuests) {
          throw new AppError(
            `The booking allows a maximum of ${maximumGuests} guest records.`,
            400
          );
        }

        // 8. Generate a booking reference.
        const bookingReference = this.generateBookingReference();

        // 9. Create the booking.
        const booking = await bookingRepository.createBooking(
          {
            hotelId: hold.hotelId,
            userId: null,
            bookingReference,
            status: "awaiting_payment",
            paymentStatus: "unpaid",
            checkInDate: hold.checkInDate,
            checkOutDate: hold.checkOutDate,
            adults: hold.adults,
            children: hold.children,
            roomCount: hold.roomCount,
            primaryGuestName: `${primaryFirstName} ${primaryLastName}`,
            primaryGuestEmail: primaryEmail,
            primaryGuestPhone: primaryPhone,
            guestCountry: primaryGuest.country?.trim() || null,
            specialRequests: input.specialRequests?.trim() || null,
            subtotal: quotation.pricing.subtotal,
            discountAmount: quotation.pricing.discount,
            taxAmount: quotation.pricing.tax,
            serviceCharge: quotation.pricing.serviceCharge,
            totalAmount: quotation.pricing.total,
            currency: quotation.pricing.currency,
          },
          transaction
        );

        // 10. Assign the held physical rooms to the booking.
        const bookingRooms =
          await bookingRepository.createBookingRooms(
            heldRooms.map((heldRoom) => ({
              bookingId: booking.id,
              roomTypeId: heldRoom.roomTypeId,
              roomId: heldRoom.roomId,
            })),
            transaction
          );

        if (bookingRooms.length !== heldRooms.length) {
          throw new AppError(
            "Unable to assign all reserved rooms to the booking.",
            500
          );
        }

        // 11. Save nightly price snapshots for each assigned room.
        const roomNights = bookingRooms.flatMap((bookingRoom) =>
          quotation.pricing.nightlyBreakdown.map((night) => ({
            bookingRoomId: bookingRoom.id,
            stayDate: night.date,
            nightlyRate: night.nightlyRate,
            rateName: night.rateName,
          }))
        );

        await bookingRepository.createRoomNights(
          roomNights,
          transaction
        );

        // 12. Save guest records.
        await bookingRepository.createBookingGuests(
          normalizedGuests.map((guest) => ({
            bookingId: booking.id,
            bookingRoomId: null,
            firstName: guest.firstName,
            lastName: guest.lastName,
            email: guest.email ?? null,
            phone: guest.phone ?? null,
            country: guest.country ?? null,
            isPrimary: guest.isPrimary,
          })),
          transaction
        );

        // 13. Convert the hold only after all booking records are created.
        await hold.update(
          {
            status: "converted",
            bookingId: booking.id,
          },
          { transaction }
        );

        // 14. Return the booking details.
        return {
          kind: "created" as const,
          data: {
            booking: {
              id: booking.id,
              bookingReference: booking.bookingReference,
              status: booking.status,
              paymentStatus: booking.paymentStatus,
              checkInDate: booking.checkInDate,
              checkOutDate: booking.checkOutDate,
              adults: booking.adults,
              children: booking.children,
              roomCount: booking.roomCount,

              primaryGuest: {
                name: booking.primaryGuestName,
                email: booking.primaryGuestEmail,
                phone: booking.primaryGuestPhone,
                country: booking.guestCountry,
              },

              pricing: {
                subtotal: booking.subtotal,
                discount: booking.discountAmount,
                tax: booking.taxAmount,
                serviceCharge: booking.serviceCharge,
                total: booking.totalAmount,
                currency: booking.currency,
              },

              rooms: bookingRooms.map((room) => ({
                id: room.id,
                roomTypeId: room.roomTypeId,
                roomId: room.roomId,
              })),

              createdAt: booking.createdAt,
            },

            message:
              "Your booking has been created. Complete payment to confirm your reservation.",
          },
        };
      }
    );

    // Throw only after the expired-hold update has committed.
    if (outcome.kind === "expired") {
      throw new AppError(
        "Your booking hold has expired. Please search for availability again.",
        410
      );
    }

    return outcome.data;
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private generateBookingReference(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = randomBytes(8).toString("hex").toUpperCase();

    return `BK-${timestamp}-${random}`;
  }
}

export const bookingService = new BookingService();