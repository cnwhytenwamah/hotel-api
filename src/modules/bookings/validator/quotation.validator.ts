import { z } from "zod";

const isValidDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

export const quotationQuerySchema = z
  .object({
    hotelId: z.string().uuid(),
    roomTypeId: z.string().uuid(),
    checkInDate: z.string().refine(isValidDate, "Invalid check-in date."),
    checkOutDate: z.string().refine(isValidDate, "Invalid check-out date."),
    adults: z.coerce.number().int().min(1).max(100),
    children: z.coerce.number().int().min(0).max(100).default(0),
    roomCount: z.coerce.number().int().min(1).max(20).default(1),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date.",
    path: ["checkOutDate"],
  });