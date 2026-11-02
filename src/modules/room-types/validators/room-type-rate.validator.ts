
import { z } from "zod";

const dateSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  "Date must use YYYY-MM-DD format."
);

const nightlyRateSchema = z.coerce
  .number()
  .positive("Nightly rate must be greater than zero.")
  .transform((value) => value.toFixed(2));

const rateFields = {
  name: z.string().trim().min(2).max(150),
  startDate: dateSchema,
  endDate: dateSchema,
  nightlyRate: nightlyRateSchema,
  minimumStay: z.coerce.number().int().min(1).max(365),
  priority: z.coerce.number().int().min(0).max(1000),
};

export const createRoomTypeRateSchema = z.object({
  name: rateFields.name,
  startDate: rateFields.startDate,
  endDate: rateFields.endDate,
  nightlyRate: rateFields.nightlyRate,
  minimumStay: rateFields.minimumStay.optional(),
  priority: rateFields.priority.optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be later than start date.",
  path: ["endDate"],
});

export const updateRoomTypeRateSchema = z.object({
  name: rateFields.name.optional(),
  startDate: rateFields.startDate.optional(),
  endDate: rateFields.endDate.optional(),
  nightlyRate: rateFields.nightlyRate.optional(),
  minimumStay: rateFields.minimumStay.optional(),
  priority: rateFields.priority.optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field to update.",
});

export const roomTypeRateParamsSchema = z.object({
  roomTypeId: z.string().uuid(),
  rateId: z.string().uuid(),
});
