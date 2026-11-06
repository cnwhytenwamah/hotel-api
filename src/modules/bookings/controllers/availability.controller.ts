import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { availabilityService } from "../services/availability.service";
import { availabilityQuerySchema } from "../validator/availability.validator";

class AvailabilityController {
  search: RequestHandler = asyncHandler(async (req, res) => {
    const filters = availabilityQuerySchema.parse(req.query);

    const result = await availabilityService.search(filters);

    return sendSuccess(
      res,
      "Room availability retrieved successfully.",
      result
    );
  });
}

export const availabilityController = new AvailabilityController();