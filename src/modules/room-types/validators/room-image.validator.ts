
import { z } from "zod";

export const roomTypeImageParamsSchema = z.object({
  roomTypeId: z.string().uuid("Invalid room type ID."),
});

export const roomImageParamsSchema = z.object({
  roomTypeId: z.string().uuid("Invalid room type ID."),
  imageId: z.string().uuid("Invalid image ID."),
});

export const createRoomImageSchema = z.object({
  imageUrl: z.string().url("A valid image URL is required."),
  publicId: z.string().trim().max(255).optional().nullable(),
  altText: z.string().trim().max(255).optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
});

export const updateRoomImageSchema = z.object({
  imageUrl: z.string().url().optional(),
  publicId: z.string().trim().max(255).optional().nullable(),
  altText: z.string().trim().max(255).optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field to update.",
});
