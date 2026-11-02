
import { Op, type WhereOptions } from "sequelize";

import { RoomType } from "../../room-types/models/room-type.model";
import { Room, type RoomStatus } from "../model/room.model";

export interface CreateRoomData {
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floor?: number | null;
  notes?: string | null;
}

export interface UpdateRoomData {
  roomTypeId?: string;
  roomNumber?: string;
  floor?: number | null;
  status?: RoomStatus;
  notes?: string | null;
  isActive?: boolean;
}

export interface RoomFilters {
  hotelId?: string;
  roomTypeId?: string;
  status?: RoomStatus;
  isActive?: boolean;
}

class RoomRepository {
  async create(data: CreateRoomData): Promise<Room> {
    return Room.create(data);
  }

  async findById(id: string): Promise<Room | null> {
    return Room.findByPk(id, {
      include: [
        {
          model: RoomType,
          as: "roomType",
          attributes: ["id", "name", "slug", "basePrice"],
        },
      ],
    });
  }

  async findAll(filters: RoomFilters = {}): Promise<Room[]> {
    const where: WhereOptions = {};

    if (filters.hotelId) {
      Object.assign(where, { hotelId: filters.hotelId });
    }

    if (filters.roomTypeId) {
      Object.assign(where, { roomTypeId: filters.roomTypeId });
    }

    if (filters.status) {
      Object.assign(where, { status: filters.status });
    }

    if (filters.isActive !== undefined) {
      Object.assign(where, { isActive: filters.isActive });
    }

    return Room.findAll({
      where,
      include: [
        {
          model: RoomType,
          as: "roomType",
          attributes: ["id", "name", "slug", "basePrice"],
        },
      ],
      order: [["roomNumber", "ASC"]],
    });
  }

  async existsByRoomNumber(
    hotelId: string,
    roomNumber: string,
    excludeId?: string
  ): Promise<boolean> {
    const where: WhereOptions = {
      hotelId,
      roomNumber,
    };

    if (excludeId) {
      Object.assign(where, { id: { [Op.ne]: excludeId } });
    }

    return (await Room.count({ where })) > 0;
  }

  async updateById(
    id: string,
    data: UpdateRoomData
  ): Promise<Room | null> {
    const room = await Room.findByPk(id);

    if (!room) {
      return null;
    }

    await room.update(data);

    return this.findById(id);
  }
}

export const roomRepository = new RoomRepository();
