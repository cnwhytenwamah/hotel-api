import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { bookingHoldService } from "../services/booking-hold.service";
import { bookingHoldTokenSchema, createBookingHoldSchema } from "../validator/booking-hold.validator";

class BookingHoldController {
  create: RequestHandler = asyncHandler(async (req, res) => {
    const input = createBookingHoldSchema.parse(req.body);

    const result = await bookingHoldService.createHold(input);

    return sendSuccess(
      res,
      "Rooms temporarily reserved successfully.",
      result,
      201
    );
  });

  release: RequestHandler = asyncHandler(async (req, res) => {
    const { token } = bookingHoldTokenSchema.parse(req.body);

    const result = await bookingHoldService.releaseHold(token);

    return sendSuccess(
      res,
      result.released
        ? "Booking hold released successfully."
        : "Booking hold has already expired.",
      result
    );
  });
}

export const bookingHoldController = new BookingHoldController();