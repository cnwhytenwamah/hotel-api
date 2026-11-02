
import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).nullable().optional();

const hotelFields = {
  name: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain lowercase letters, numbers and hyphens.",
    }),
  email: z.string().email().max(150).nullable().optional(),
  phone: optionalText(30),
  description: optionalText(10000),
  website: z.string().url().max(255).nullable().optional(),
  logoUrl: z.string().url().max(500).nullable().optional(),
  address: optionalText(255),
  city: optionalText(100),
  state: optionalText(100),
  country: optionalText(100),
  postalCode: optionalText(30),
  timezone: z.string().trim().min(1).max(60).optional(),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()).optional(),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
};

export const createHotelSchema = z.object(hotelFields);

export const updateHotelSchema = z
  .object({
    ...hotelFields,
    isActive: z.boolean().optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

export const hotelIdSchema = z.object({
  id: z.string().uuid("Invalid hotel ID."),
});

export const hotelSlugSchema = z.object({
  slug: z.string().min(1, "Hotel slug is required."),
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
