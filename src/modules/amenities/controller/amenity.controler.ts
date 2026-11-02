import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import {
  amenityIdSchema,
  createAmenitySchema,
  updateAmenitySchema,
} from "../validators/amenity.validator";
import { amenityService } from "../services/amenity.repository";

export class AmenityController {
  create: RequestHandler = asyncHandler(async (req, res) => {
    const input = createAmenitySchema.parse(req.body);
    const amenity = await amenityService.create(input);

    return sendSuccess(res, "Amenity created successfully.", amenity, 201);
  });

  getPublic: RequestHandler = asyncHandler(async (_req, res) => {
    const amenities = await amenityService.getPublicAmenities();

    return sendSuccess(
      res,
      "Amenities retrieved successfully.",
      amenities
    );
  });

  getAllForStaff: RequestHandler = asyncHandler(async (_req, res) => {
    const amenities = await amenityService.getAll();

    return sendSuccess(
      res,
      "Amenities retrieved successfully.",
      amenities
    );
  });

  update: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = amenityIdSchema.parse(req.params);
    const input = updateAmenitySchema.parse(req.body);

    const amenity = await amenityService.update(id, input);

    return sendSuccess(res, "Amenity updated successfully.", amenity);
  });

  deactivate: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = amenityIdSchema.parse(req.params);
    const result = await amenityService.deactivate(id);

    return sendSuccess(
      res,
      "Amenity deactivated successfully.",
      result
    );
  });
}

export const amenityController = new AmenityController();