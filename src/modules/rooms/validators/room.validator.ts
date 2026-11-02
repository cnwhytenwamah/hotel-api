
import { z } from "zod";

const roomStatusSchema = z.enum([
  "available",
  "occupied",
  "reserved",
  "cleaning",
  "maintenance",
  "out_of_service",
]);

export const createRoomSchema = z.object({
  hotelId: z.string().uuid("A valid hotel ID is required."),
  roomTypeId: z.string().uuid("A valid room type ID is required."),
  roomNumber: z.string().trim().min(1).max(30),
  floor: z.coerce.number().int().optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const updateRoomSchema = z.object({
  roomTypeId: z.string().uuid().optional(),
  roomNumber: z.string().trim().min(1).max(30).optional(),
  floor: z.coerce.number().int().optional().nullable(),
  status: roomStatusSchema.optional(),
  notes: z.string().trim().max(2000).optional().nullable(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Provide at least one field to update.",
});

export const roomIdSchema = z.object({
  id: z.string().uuid("Invalid room ID."),
});

export const roomQuerySchema = z.object({
  hotelId: z.string().uuid().optional(),
  roomTypeId: z.string().uuid().optional(),
  status: roomStatusSchema.optional(),
  isActive: z.enum(["true", "false"]).optional(),
});
