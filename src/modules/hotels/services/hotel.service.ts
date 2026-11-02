
import { AppError } from "../../../utils/app-error";
import { hotelRepository } from "../repositories/hotel.repository";
import type { CreateHotelInput, UpdateHotelInput,} from "../validators/hotel.validator";

export class HotelService {
  async createHotel(input: CreateHotelInput) {
    const slugExists = await hotelRepository.existsBySlug(input.slug);

    if (slugExists) {
      throw new AppError("A hotel with this slug already exists.", 409);
    }

    return hotelRepository.create(input);
  }

  async getPublicHotels() {
    return hotelRepository.findActive();
  }

  async getHotelById(id: string) {
    const hotel = await hotelRepository.findById(id);

    if (!hotel || !hotel.isActive) {
      throw new AppError("Hotel not found.", 404);
    }

    return hotel;
  }

  async getHotelBySlug(slug: string) {
    const hotel = await hotelRepository.findBySlug(slug);

    if (!hotel || !hotel.isActive) {
      throw new AppError("Hotel not found.", 404);
    }

    return hotel;
  }

  async getAllHotelsForStaff() {
    return hotelRepository.findAll();
  }

  async updateHotel(id: string, input: UpdateHotelInput) {
    const hotel = await hotelRepository.findById(id);

    if (!hotel) {
      throw new AppError("Hotel not found.", 404);
    }

    if (input.slug) {
      const slugExists = await hotelRepository.existsBySlug(
        input.slug,
        id
      );

      if (slugExists) {
        throw new AppError("A hotel with this slug already exists.", 409);
      }
    }

    const updatedHotel = await hotelRepository.updateById(id, input);

    if (!updatedHotel) {
      throw new AppError("Unable to update hotel.", 500);
    }

    return updatedHotel;
  }
}

export const hotelService = new HotelService();
