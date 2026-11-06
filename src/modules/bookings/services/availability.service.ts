import { AppError } from "../../../utils/app-error";
import {
  availabilityRepository,
  AvailabilitySearch,
} from "../repositories/availability.repository";

class AvailabilityService {
  async search(filters: AvailabilitySearch) {
    const nights = this.calculateNights(
      filters.checkInDate,
      filters.checkOutDate
    );

    const results = await availabilityRepository.search(filters);

    return {
      search: {
        hotelId: filters.hotelId,
        roomTypeId: filters.roomTypeId ?? null,
        checkInDate: filters.checkInDate,
        checkOutDate: filters.checkOutDate,
        adults: filters.adults,
        children: filters.children,
        roomCount: filters.roomCount,
      },
      nights,
      availableRoomTypes: results.map((roomType) => ({
        ...roomType,
        availableRooms: Number(roomType.availableRooms),
        basePrice: roomType.basePrice,
      })),
      totalRoomTypes: results.length,
    };
  }

  private calculateNights(checkInDate: string, checkOutDate: string): number {
    const checkIn = new Date(`${checkInDate}T00:00:00.000Z`).getTime();
    const checkOut = new Date(`${checkOutDate}T00:00:00.000Z`).getTime();

    const nights = Math.round(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );

    if (nights < 1) {
      throw new AppError("The selected stay must be at least one night.", 400);
    }

    return nights;
  }
}

export const availabilityService = new AvailabilityService();