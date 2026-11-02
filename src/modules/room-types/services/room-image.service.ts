
import { AppError } from "../../../utils/app-error";
import { roomTypeRepository } from "../repositories/room-type.repository";
import {
  roomImageRepository,
  type CreateRoomImageData,
  type UpdateRoomImageData,
} from "../repositories/room-image.repository";

class RoomImageService {
  private async ensureRoomTypeExists(roomTypeId: string): Promise<void> {
    const roomType = await roomTypeRepository.findById(roomTypeId);

    if (!roomType || !roomType.isActive) {
      throw new AppError("Room type not found or inactive.", 404);
    }
  }

  async create(roomTypeId: string, data: Omit<CreateRoomImageData, "roomTypeId">) {
    await this.ensureRoomTypeExists(roomTypeId);

    return roomImageRepository.create({
      ...data,
      roomTypeId,
    });
  }

  async getAll(roomTypeId: string) {
    await this.ensureRoomTypeExists(roomTypeId);

    return roomImageRepository.findAll(roomTypeId);
  }

  async update(
    roomTypeId: string,
    imageId: string,
    data: UpdateRoomImageData
  ) {
    const image = await roomImageRepository.findById(imageId, roomTypeId);

    if (!image) {
      throw new AppError("Room image not found.", 404);
    }

    const updatedImage = await roomImageRepository.updateById(
      imageId,
      roomTypeId,
      data
    );

    if (!updatedImage) {
      throw new AppError("Unable to update room image.", 500);
    }

    return updatedImage;
  }

  async delete(roomTypeId: string, imageId: string) {
    const deleted = await roomImageRepository.deleteById(imageId, roomTypeId);

    if (!deleted) {
      throw new AppError("Room image not found.", 404);
    }

    return { id: imageId };
  }
}

export const roomImageService = new RoomImageService();
