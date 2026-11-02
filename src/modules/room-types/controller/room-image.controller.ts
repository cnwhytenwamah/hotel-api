
import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { AppError } from "../../../utils/app-error";
import { roomImageService } from "../services/room-image.service";
import {
  createRoomImageSchema,
  roomImageParamsSchema,
  roomTypeImageParamsSchema,
  updateRoomImageSchema,
} from "../validators/room-image.validator";

class RoomImageController {
  create: RequestHandler = asyncHandler(async (req, res) => {
    const params = roomTypeImageParamsSchema.safeParse(req.params);
    const body = createRoomImageSchema.safeParse(req.body);

    if (!params.success) {
      throw new AppError("Invalid room type ID.", 400);
    }

    if (!body.success) {
      throw new AppError(
        body.error.issues[0]?.message ?? "Invalid image data.",
        400
      );
    }

    const image = await roomImageService.create(
      params.data.roomTypeId,
      body.data
    );

    return sendSuccess(res, "Room image added successfully.", image, 201);
  });

  getAll: RequestHandler = asyncHandler(async (req, res) => {
    const params = roomTypeImageParamsSchema.safeParse(req.params);

    if (!params.success) {
      throw new AppError("Invalid room type ID.", 400);
    }

    const images = await roomImageService.getAll(params.data.roomTypeId);

    return sendSuccess(res, "Room images retrieved successfully.", images);
  });

  update: RequestHandler = asyncHandler(async (req, res) => {
    const params = roomImageParamsSchema.safeParse(req.params);
    const body = updateRoomImageSchema.safeParse(req.body);

    if (!params.success) {
      throw new AppError("Invalid image identifiers.", 400);
    }

    if (!body.success) {
      throw new AppError(
        body.error.issues[0]?.message ?? "Invalid image data.",
        400
      );
    }

    const image = await roomImageService.update(
      params.data.roomTypeId,
      params.data.imageId,
      body.data
    );

    return sendSuccess(res, "Room image updated successfully.", image);
  });

  delete: RequestHandler = asyncHandler(async (req, res) => {
    const params = roomImageParamsSchema.safeParse(req.params);

    if (!params.success) {
      throw new AppError("Invalid image identifiers.", 400);
    }

    const result = await roomImageService.delete(
      params.data.roomTypeId,
      params.data.imageId
    );

    return sendSuccess(res, "Room image deleted successfully.", result);
  });
}

export const roomImageController = new RoomImageController();
