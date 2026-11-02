
import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { roomTypeService } from "../services/room-type.service";
import {
  assignAmenitiesSchema,
  createRoomTypeSchema,
  roomTypeIdSchema,
  roomTypeQuerySchema,
  updateRoomTypeSchema,
} from "../validators/room-type.validator";

export class RoomTypeController {
  create: RequestHandler = asyncHandler(async (req, res) => {
    const input = createRoomTypeSchema.parse(req.body);
    const roomType = await roomTypeService.create(input);

    return sendSuccess(
      res,
      "Room type created successfully.",
      roomType,
      201
    );
  });

  getPublic: RequestHandler = asyncHandler(async (req, res) => {
    const query = roomTypeQuerySchema.parse({
      hotelId:
        typeof req.query.hotelId === "string"
          ? req.query.hotelId
          : undefined,
    });

    const roomTypes = await roomTypeService.getPublicRoomTypes(
      query.hotelId
    );

    return sendSuccess(
      res,
      "Room types retrieved successfully.",
      roomTypes
    );
  });

  getAllForStaff: RequestHandler = asyncHandler(async (req, res) => {
    const query = roomTypeQuerySchema.parse({
      hotelId:
        typeof req.query.hotelId === "string"
          ? req.query.hotelId
          : undefined,
    });

    const roomTypes = await roomTypeService.getAllForStaff(
      query.hotelId
    );

    return sendSuccess(
      res,
      "Room types retrieved successfully.",
      roomTypes
    );
  });

  getById: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = roomTypeIdSchema.parse(req.params);
    const roomType = await roomTypeService.getPublicById(id);

    return sendSuccess(
      res,
      "Room type retrieved successfully.",
      roomType
    );
  });

  update: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = roomTypeIdSchema.parse(req.params);
    const input = updateRoomTypeSchema.parse(req.body);

    const roomType = await roomTypeService.update(id, input);

    return sendSuccess(
      res,
      "Room type updated successfully.",
      roomType
    );
  });

  deactivate: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = roomTypeIdSchema.parse(req.params);
    const result = await roomTypeService.deactivate(id);

    return sendSuccess(
      res,
      "Room type deactivated successfully.",
      result
    );
  });


  assignAmenities: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = roomTypeIdSchema.parse(req.params);
    const { amenityIds } = assignAmenitiesSchema.parse(req.body);

    const roomType = await roomTypeService.assignAmenities(
        id,
        amenityIds
    );

    return sendSuccess(
        res,
        "Room amenities updated successfully.",
        roomType
    );
    });
}

export const roomTypeController = new RoomTypeController();
