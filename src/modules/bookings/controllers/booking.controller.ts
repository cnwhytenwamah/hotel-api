
import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { createBookingSchema,} from "../validator/booking.validator";
import { bookingService } from "../services/booking.service";

class BookingController {
  create: RequestHandler = asyncHandler(async (req, res) => {
    
    const input = createBookingSchema.parse(req.body);

    const result = await bookingService.createBooking(input);

    return sendSuccess(
      res,
      "Booking created successfully.",
      result,
      201
    );
  });
}

export const bookingController = new BookingController();
