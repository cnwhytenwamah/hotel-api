
import { z } from "zod";

const guestSchema = z.object({
  firstName: z.string().trim().min(1).max(100),

  lastName: z.string().trim().min(1).max(100),

  email: z
    .string()
    .trim()
    .email("Enter a valid guest email address.")
    .nullable()
    .optional(),

  phone: z
    .string()
    .trim()
    .min(5)
    .max(30)
    .nullable()
    .optional(),

  country: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional(),
});

export const createBookingSchema = z.object({
  holdToken: z
    .string()
    .trim()
    .min(1, "Booking hold token is required."),

  primaryGuest: guestSchema,

  guests: z
    .array(guestSchema)
    .max(50, "Too many guest records were provided.")
    .optional(),

  specialRequests: z
    .string()
    .trim()
    .max(2000)
    .optional(),
});

export const bookingIdSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID."),
});

export const bookingReferenceSchema = z.object({
  bookingReference: z.string().trim().min(1).max(30),
});

export type CreateBookingBody = z.infer<typeof createBookingSchema>;

export type BookingGuestBody = z.infer<typeof guestSchema>;
