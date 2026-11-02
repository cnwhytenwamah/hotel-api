
import { AppError } from "../../../utils/app-error";
import { hotelRepository } from "../../hotels/repositories/hotel.repository";
import { roomTypeRepository } from "../../room-types/repositories/room-type.repository";
import {
  roomRepository,
  type CreateRoomData,
  type RoomFilters,
  type UpdateRoomData,
} from "../repositories/room.repository";

class RoomService {
  async create(data: CreateRoomData) {
    const hotel = await hotelRepository.findById(data.hotelId);

    if (!hotel || !hotel.isActive) {
      throw new AppError("Hotel not found or inactive.", 404);
    }

    const roomType = await roomTypeRepository.findById(data.roomTypeId);

    if (!roomType || !roomType.isActive) {
      throw new AppError("Room type not found or inactive.", 404);
    }

    if (roomType.hotelId !== data.hotelId) {
      throw new AppError(
        "The selected room type does not belong to this hotel.",
        400
      );
    }

    const roomNumberExists = await roomRepository.existsByRoomNumber(
      data.hotelId,
      data.roomNumber
    );

    if (roomNumberExists) {
      throw new AppError(
        "A room with this number already exists in this hotel.",
        409
      );
    }

    return roomRepository.create(data);
  }

  async getAll(filters: RoomFilters = {}) {
    return roomRepository.findAll(filters);
  }

  async getById(id: string) {
    const room = await roomRepository.findById(id);

    if (!room) {
      throw new AppError("Room not found.", 404);
    }

    return room;
  }

  async update(id: string, data: UpdateRoomData) {
    const existingRoom = await roomRepository.findById(id);

    if (!existingRoom) {
      throw new AppError("Room not found.", 404);
    }

    if (data.roomNumber) {
      const roomNumberExists = await roomRepository.existsByRoomNumber(
        existingRoom.hotelId,
        data.roomNumber,
        id
      );

      if (roomNumberExists) {
        throw new AppError(
          "A room with this number already exists in this hotel.",
          409
        );
      }
    }

    if (data.roomTypeId) {
      const roomType = await roomTypeRepository.findById(data.roomTypeId);

      if (
        !roomType ||
        !roomType.isActive ||
        roomType.hotelId !== existingRoom.hotelId
      ) {
        throw new AppError(
          "The selected room type is invalid for this hotel.",
          400
        );
      }
    }

    const updatedRoom = await roomRepository.updateById(id, data);

    if (!updatedRoom) {
      throw new AppError("Unable to update room.", 500);
    }

    return updatedRoom;
  }

  async deactivate(id: string) {
    const room = await roomRepository.findById(id);

    if (!room) {
      throw new AppError("Room not found.", 404);
    }

    await room.update({ isActive: false });

    return roomRepository.findById(id);
  }
}

export const roomService = new RoomService();
