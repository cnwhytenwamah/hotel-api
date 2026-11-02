
import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { AppError } from "../../../utils/app-error";
import { roomService } from "../services/room.service";
import {
  createRoomSchema,
  roomIdSchema,
  roomQuerySchema,
  updateRoomSchema,
} from "../validators/room.validator";

class RoomController {
  create: RequestHandler = asyncHandler(async (req, res) => {
    const parsed = createRoomSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid room data.", 400);
    }

    const room = await roomService.create(parsed.data);

    return sendSuccess(res, "Room created successfully.", room, 201);
  });

  getAll: RequestHandler = asyncHandler(async (req, res) => {
    const parsed = roomQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid query parameters.", 400);
    }

    const filters = {
      ...parsed.data,
      isActive:
        parsed.data.isActive === undefined
          ? undefined
          : parsed.data.isActive === "true",
    };

    const rooms = await roomService.getAll(filters);

    return sendSuccess(res, "Rooms retrieved successfully.", rooms);
  });

  getById: RequestHandler = asyncHandler(async (req, res) => {
    const parsed = roomIdSchema.safeParse(req.params);

    if (!parsed.success) {
      throw new AppError("Invalid room ID.", 400);
    }

    const room = await roomService.getById(parsed.data.id);

    return sendSuccess(res, "Room retrieved successfully.", room);
  });

  update: RequestHandler = asyncHandler(async (req, res) => {
    const params = roomIdSchema.safeParse(req.params);
    const body = updateRoomSchema.safeParse(req.body);

    if (!params.success) {
      throw new AppError("Invalid room ID.", 400);
    }

    if (!body.success) {
      throw new AppError(body.error.issues[0]?.message ?? "Invalid room data.", 400);
    }

    const room = await roomService.update(params.data.id, body.data);

    return sendSuccess(res, "Room updated successfully.", room);
  });

  deactivate: RequestHandler = asyncHandler(async (req, res) => {
    const parsed = roomIdSchema.safeParse(req.params);

    if (!parsed.success) {
      throw new AppError("Invalid room ID.", 400);
    }

    const room = await roomService.deactivate(parsed.data.id);

    return sendSuccess(res, "Room deactivated successfully.", room);
  });
}

export const roomController = new RoomController();
