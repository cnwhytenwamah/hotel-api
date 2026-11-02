
import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { AppError } from "../../../utils/app-error";
import { roomTypeRateService } from "../services/room-type-rate.service";
import {
  createRoomTypeRateSchema,
  roomTypeRateParamsSchema,
  updateRoomTypeRateSchema,
} from "../validators/room-type-rate.validator";

class RoomTypeRateController {
  create: RequestHandler = asyncHandler(async (req, res) => {
    const roomTypeId = req.params.roomTypeId;

    if (typeof roomTypeId !== "string") {
      throw new AppError("Invalid room type ID.", 400);
    }

    const body = createRoomTypeRateSchema.safeParse(req.body);

    if (!body.success) {
      throw new AppError(
        body.error.issues[0]?.message ?? "Invalid rate data.",
        400
      );
    }

    const rate = await roomTypeRateService.create(roomTypeId, body.data);

    return sendSuccess(res, "Room rate created successfully.", rate, 201);
  });

  getAll: RequestHandler = asyncHandler(async (req, res) => {
    const roomTypeId = req.params.roomTypeId;

    if (typeof roomTypeId !== "string") {
      throw new AppError("Invalid room type ID.", 400);
    }

    const rates = await roomTypeRateService.getAll(roomTypeId);

    return sendSuccess(res, "Room rates retrieved successfully.", rates);
  });

  update: RequestHandler = asyncHandler(async (req, res) => {
    const params = roomTypeRateParamsSchema.safeParse(req.params);
    const body = updateRoomTypeRateSchema.safeParse(req.body);

    if (!params.success) {
      throw new AppError("Invalid rate identifiers.", 400);
    }

    if (!body.success) {
      throw new AppError(
        body.error.issues[0]?.message ?? "Invalid rate data.",
        400
      );
    }

    const rate = await roomTypeRateService.update(
      params.data.roomTypeId,
      params.data.rateId,
      body.data
    );

    return sendSuccess(res, "Room rate updated successfully.", rate);
  });

  deactivate: RequestHandler = asyncHandler(async (req, res) => {
    const params = roomTypeRateParamsSchema.safeParse(req.params);

    if (!params.success) {
      throw new AppError("Invalid rate identifiers.", 400);
    }

    const rate = await roomTypeRateService.deactivate(
      params.data.roomTypeId,
      params.data.rateId
    );

    return sendSuccess(res, "Room rate deactivated successfully.", rate);
  });
}

export const roomTypeRateController = new RoomTypeRateController();
