import type { RequestHandler } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { quotationService } from "../services/quotation.service";
import { quotationQuerySchema } from "../validator/quotation.validator";

class QuotationController {
  create: RequestHandler = asyncHandler(async (req, res) => {
    const input = quotationQuerySchema.parse(req.query);

    const quotation = await quotationService.createQuotation(input);

    return sendSuccess(
      res,
      "Booking quotation generated successfully.",
      quotation
    );
  });
}

export const quotationController = new QuotationController();