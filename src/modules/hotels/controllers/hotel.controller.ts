
import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { hotelService } from "../services/hotel.service";
import { createHotelSchema, hotelIdSchema, hotelSlugSchema, updateHotelSchema,} from "../validators/hotel.validator";
import { AppError } from "../../../utils/app-error";

export class HotelController {
  create: RequestHandler = asyncHandler(async (req, res) => {
    const input = createHotelSchema.parse(req.body);
    const hotel = await hotelService.createHotel(input);

    return sendSuccess(res, "Hotel created successfully.", hotel, 201);
  });

  getPublicHotels: RequestHandler = asyncHandler(async (_req, res) => {
    const hotels = await hotelService.getPublicHotels();

    return sendSuccess(res, "Hotels retrieved successfully.", hotels);
  });

  getAllForStaff: RequestHandler = asyncHandler(async (_req, res) => {
    const hotels = await hotelService.getAllHotelsForStaff();

    return sendSuccess(res, "Hotels retrieved successfully.", hotels);
  });

  getById: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = hotelIdSchema.parse(req.params);
    const hotel = await hotelService.getHotelById(id);

    return sendSuccess(res, "Hotel retrieved successfully.", hotel);
  });

  getBySlug: RequestHandler = asyncHandler(async (req, res) => {
    const { slug } = hotelSlugSchema.parse(req.params);


    if (typeof slug !== "string") {
    throw new AppError("Invalid hotel slug.", 400);
    }

    const hotel = await hotelService.getHotelBySlug(slug);

    return sendSuccess(res, "Hotel retrieved successfully.", hotel);
  });


  update: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = hotelIdSchema.parse(req.params);
    const input = updateHotelSchema.parse(req.body);

    const hotel = await hotelService.updateHotel(id, input);

    return sendSuccess(res, "Hotel updated successfully.", hotel);
  });
}

export const hotelController = new HotelController();