
import { Op, type WhereOptions } from "sequelize";

import { RoomTypeRate } from "../models/room-type-rate.model";

export interface CreateRoomTypeRateData {
  roomTypeId: string;
  name: string;
  startDate: string;
  endDate: string;
  nightlyRate: string;
  minimumStay?: number;
  priority?: number;
}

export interface UpdateRoomTypeRateData {
  name?: string;
  startDate?: string;
  endDate?: string;
  nightlyRate?: string;
  minimumStay?: number;
  priority?: number;
  isActive?: boolean;
}

class RoomTypeRateRepository {
  async create(data: CreateRoomTypeRateData): Promise<RoomTypeRate> {
    return RoomTypeRate.create(data);
  }

  async findById(
    id: string,
    roomTypeId: string
  ): Promise<RoomTypeRate | null> {
    return RoomTypeRate.findOne({
      where: { id, roomTypeId },
    });
  }

  async findAll(roomTypeId: string): Promise<RoomTypeRate[]> {
    return RoomTypeRate.findAll({
      where: { roomTypeId },
      order: [
        ["startDate", "ASC"],
        ["priority", "DESC"],
      ],
    });
  }

  async findConflictingRate(
    roomTypeId: string,
    startDate: string,
    endDate: string,
    priority: number,
    excludeId?: string
  ): Promise<RoomTypeRate | null> {
    const where: WhereOptions = {
      roomTypeId,
      isActive: true,
      priority,
      startDate: { [Op.lt]: endDate },
      endDate: { [Op.gt]: startDate },
    };

    if (excludeId) {
      Object.assign(where, {
        id: { [Op.ne]: excludeId },
      });
    }

    return RoomTypeRate.findOne({ where });
  }

  async findApplicableRates(
    roomTypeId: string,
    date: string
  ): Promise<RoomTypeRate[]> {
    return RoomTypeRate.findAll({
      where: {
        roomTypeId,
        isActive: true,
        startDate: { [Op.lte]: date },
        endDate: { [Op.gt]: date },
      },
      order: [["priority", "DESC"]],
    });
  }

  async updateById(
    id: string,
    roomTypeId: string,
    data: UpdateRoomTypeRateData
  ): Promise<RoomTypeRate | null> {
    const rate = await RoomTypeRate.findOne({
      where: { id, roomTypeId },
    });

    if (!rate) return null;

    await rate.update(data);

    return rate;
  }
}

export const roomTypeRateRepository = new RoomTypeRateRepository();
