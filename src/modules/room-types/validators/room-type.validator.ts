import { z } from "zod";

const roomTypeFields = {
  hotelId: z.string().uuid("Invalid hotel ID."),
  name: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(10000).nullable().optional(),
  basePrice: z.coerce
    .number()
    .positive("Base price must be greater than zero.")
    .transform((value) => value.toFixed(2)),
  maxAdults: z.number().int().min(1).max(20).default(2),
  maxChildren: z.number().int().min(0).max(20).default(0),
  maxOccupancy: z.number().int().min(1).max(30).default(2),
  bedType: z.string().trim().max(80).nullable().optional(),
  bedCount: z.number().int().min(1).max(20).default(1),
  roomSizeSqm: z.number().positive().nullable().optional(),
};

export const createRoomTypeSchema = z
  .object(roomTypeFields)
  .refine(
    (data) =>
      data.maxOccupancy >= data.maxAdults &&
      data.maxOccupancy <= data.maxAdults + data.maxChildren,
    {
      message:
        "Maximum occupancy must be at least the adult limit and cannot exceed adults plus children.",
      path: ["maxOccupancy"],
    }
  );

export const updateRoomTypeSchema = z
  .object({
    name: roomTypeFields.name.optional(),
    slug: roomTypeFields.slug.optional(),
    description: roomTypeFields.description,
    basePrice: roomTypeFields.basePrice.optional(),
    maxAdults: roomTypeFields.maxAdults.optional(),
    maxChildren: roomTypeFields.maxChildren.optional(),
    maxOccupancy: roomTypeFields.maxOccupancy.optional(),
    bedType: roomTypeFields.bedType,
    bedCount: roomTypeFields.bedCount.optional(),
    roomSizeSqm: roomTypeFields.roomSizeSqm,
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

export const roomTypeIdSchema = z.object({
  id: z.string().uuid("Invalid room type ID."),
});

export const roomTypeQuerySchema = z.object({
  hotelId: z.string().uuid().optional(),
});

export const assignAmenitiesSchema = z.object({
  amenityIds: z
    .array(z.string().uuid("Invalid amenity ID."))
    .min(1, "At least one amenity is required."),
});

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;
export type AssignAmenitiesInput = z.infer<typeof assignAmenitiesSchema>;
