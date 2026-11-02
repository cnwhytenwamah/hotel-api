
import { AppError } from "../../../utils/app-error";
import { amenityRepository } from "../../amenities/repositories/amenity.repository";
import { hotelRepository } from "../../hotels/repositories/hotel.repository";
import { roomTypeRepository } from "../repositories/room-type.repository";
import type {
  CreateRoomTypeInput,
  UpdateRoomTypeInput,
} from "../validators/room-type.validator";

export class RoomTypeService {
  async create(input: CreateRoomTypeInput) {
    const hotel = await hotelRepository.findById(input.hotelId);

    if (!hotel || !hotel.isActive) {
      throw new AppError("Active hotel not found.", 404);
    }

    const slugExists = await roomTypeRepository.existsBySlug(
      input.hotelId,
      input.slug
    );

    if (slugExists) {
      throw new AppError(
        "This room type slug already exists for this hotel.",
        409
      );
    }

    const { roomSizeSqm, ...data } = input;

    return roomTypeRepository.create({
      ...data,
      roomSizeSqm:
        roomSizeSqm == null ? null : roomSizeSqm.toFixed(2),
    });
  }

  async getPublicRoomTypes(hotelId?: string) {
    if (hotelId) {
      const hotel = await hotelRepository.findById(hotelId);

      if (!hotel || !hotel.isActive) {
        throw new AppError("Active hotel not found.", 404);
      }
    }

    return roomTypeRepository.findPublic(hotelId);
  }

  async getAllForStaff(hotelId?: string) {
    return roomTypeRepository.findAll(hotelId);
  }

  async getPublicById(id: string) {
    const roomType = await roomTypeRepository.findPublicById(id);

    if (!roomType) {
      throw new AppError("Room type not found.", 404);
    }

    return roomType;
  }

  async update(id: string, input: UpdateRoomTypeInput) {
    const existing = await roomTypeRepository.findById(id);

    if (!existing) {
      throw new AppError("Room type not found.", 404);
    }

    if (input.slug) {
      const slugExists = await roomTypeRepository.existsBySlug(
        existing.hotelId,
        input.slug,
        id
      );

      if (slugExists) {
        throw new AppError(
          "This room type slug already exists for this hotel.",
          409
        );
      }
    }

    const { roomSizeSqm, ...data } = input;

    const updateData = {
      ...data,
      ...(roomSizeSqm !== undefined
        ? {
            roomSizeSqm:
              roomSizeSqm === null ? null : roomSizeSqm.toFixed(2),
          }
        : {}),
    };

    const updated = await roomTypeRepository.updateById(
      id,
      updateData
    );

    if (!updated) {
      throw new AppError("Unable to update room type.", 500);
    }

    return updated;
  }

  async deactivate(id: string) {
    const roomType = await roomTypeRepository.findById(id);

    if (!roomType) {
      throw new AppError("Room type not found.", 404);
    }

    await roomTypeRepository.updateById(id, { isActive: false });

    return { id, isActive: false };
  }

  async assignAmenities(id: string, amenityIds: string[]) {
    const roomType = await roomTypeRepository.findById(id);

    if (!roomType) {
        throw new AppError("Room type not found.", 404);
    }

    const uniqueIds = [...new Set(amenityIds)];

    const amenities = await amenityRepository.findByIds(uniqueIds);

    if (amenities.length !== uniqueIds.length) {
        throw new AppError(
        "One or more amenities do not exist or are inactive.",
        400
        );
    }

    await amenityRepository.replaceRoomTypeAmenities(id, uniqueIds);

    return roomTypeRepository.findWithAmenities(id);
    }
}

export const roomTypeService = new RoomTypeService();
