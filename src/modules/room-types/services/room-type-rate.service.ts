
import { AppError } from "../../../utils/app-error";
import { roomTypeRepository } from "../repositories/room-type.repository";
import {
  roomTypeRateRepository,
  type CreateRoomTypeRateData,
  type UpdateRoomTypeRateData,
} from "../repositories/room-type-rate.repository";

class RoomTypeRateService {
  private async ensureRoomTypeExists(roomTypeId: string): Promise<void> {
    const roomType = await roomTypeRepository.findById(roomTypeId);

    if (!roomType || !roomType.isActive) {
      throw new AppError("Room type not found or inactive.", 404);
    }
  }

  private async ensureNoEqualPriorityConflict(
    roomTypeId: string,
    startDate: string,
    endDate: string,
    priority: number,
    excludeId?: string
  ): Promise<void> {
    const conflict = await roomTypeRateRepository.findConflictingRate(
      roomTypeId,
      startDate,
      endDate,
      priority,
      excludeId
    );

    if (conflict) {
      throw new AppError(
        "This date range overlaps another active rate with the same priority. Change the dates or priority.",
        409
      );
    }
  }

  async create(
    roomTypeId: string,
    data: Omit<CreateRoomTypeRateData, "roomTypeId">
  ) {
    await this.ensureRoomTypeExists(roomTypeId);

    const priority = data.priority ?? 0;

    await this.ensureNoEqualPriorityConflict(
      roomTypeId,
      data.startDate,
      data.endDate,
      priority
    );

    return roomTypeRateRepository.create({
      ...data,
      roomTypeId,
      priority,
    });
  }

  async getAll(roomTypeId: string) {
    await this.ensureRoomTypeExists(roomTypeId);

    return roomTypeRateRepository.findAll(roomTypeId);
  }

  async update(
    roomTypeId: string,
    rateId: string,
    data: UpdateRoomTypeRateData
  ) {
    const existing = await roomTypeRateRepository.findById(
      rateId,
      roomTypeId
    );

    if (!existing) {
      throw new AppError("Room rate not found.", 404);
    }

    const nextStartDate = data.startDate ?? existing.startDate;
    const nextEndDate = data.endDate ?? existing.endDate;
    const nextPriority = data.priority ?? existing.priority;

    if (nextEndDate <= nextStartDate) {
      throw new AppError("End date must be later than start date.", 400);
    }

    // Check conflicts when the rate remains active or is being activated.
    const willBeActive = data.isActive ?? existing.isActive;

    if (willBeActive) {
      await this.ensureNoEqualPriorityConflict(
        roomTypeId,
        nextStartDate,
        nextEndDate,
        nextPriority,
        rateId
      );
    }

    const updated = await roomTypeRateRepository.updateById(
      rateId,
      roomTypeId,
      data
    );

    if (!updated) {
      throw new AppError("Unable to update room rate.", 500);
    }

    return updated;
  }

  async deactivate(roomTypeId: string, rateId: string) {
    const rate = await roomTypeRateRepository.findById(rateId, roomTypeId);

    if (!rate) {
      throw new AppError("Room rate not found.", 404);
    }

    const updated = await roomTypeRateRepository.updateById(
      rateId,
      roomTypeId,
      { isActive: false }
    );

    return updated;
  }

  async getApplicableRates(roomTypeId: string, date: string) {
    await this.ensureRoomTypeExists(roomTypeId);

    return roomTypeRateRepository.findApplicableRates(roomTypeId, date);
  }
}

export const roomTypeRateService = new RoomTypeRateService();
