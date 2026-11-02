
import { sequelize } from "../../../config/database";
import { RoomImage } from "../models/room-image.model";

export interface CreateRoomImageData {
  roomTypeId: string;
  imageUrl: string;
  publicId?: string | null;
  altText?: string | null;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface UpdateRoomImageData {
  imageUrl?: string;
  publicId?: string | null;
  altText?: string | null;
  displayOrder?: number;
  isPrimary?: boolean;
}

class RoomImageRepository {
  async create(data: CreateRoomImageData): Promise<RoomImage> {
    return sequelize.transaction(async (transaction) => {
      if (data.isPrimary) {
        await RoomImage.update(
          { isPrimary: false },
          {
            where: { roomTypeId: data.roomTypeId },
            transaction,
          }
        );
      }

      return RoomImage.create(data, { transaction });
    });
  }

  async findById(id: string, roomTypeId: string): Promise<RoomImage | null> {
    return RoomImage.findOne({
      where: { id, roomTypeId },
    });
  }

  async findAll(roomTypeId: string): Promise<RoomImage[]> {
    return RoomImage.findAll({
      where: { roomTypeId },
      order: [
        ["isPrimary", "DESC"],
        ["displayOrder", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
  }

  async updateById(
    id: string,
    roomTypeId: string,
    data: UpdateRoomImageData
  ): Promise<RoomImage | null> {
    return sequelize.transaction(async (transaction) => {
      const image = await RoomImage.findOne({
        where: { id, roomTypeId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!image) return null;

      if (data.isPrimary) {
        await RoomImage.update(
          { isPrimary: false },
          {
            where: { roomTypeId },
            transaction,
          }
        );
      }

      await image.update(data, { transaction });

      return image;
    });
  }

  async deleteById(id: string, roomTypeId: string): Promise<boolean> {
    const deleted = await RoomImage.destroy({
      where: { id, roomTypeId },
    });

    return deleted > 0;
  }
}

export const roomImageRepository = new RoomImageRepository();
