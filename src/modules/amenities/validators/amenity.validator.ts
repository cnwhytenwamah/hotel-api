
import { z } from "zod";

export const createAmenitySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).nullable().optional(),
  icon: z.string().trim().max(100).nullable().optional(),
});

export const updateAmenitySchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    slug: z
      .string()
      .trim()
      .min(2)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    description: z.string().trim().max(500).nullable().optional(),
    icon: z.string().trim().max(100).nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

export const amenityIdSchema = z.object({
  id: z.string().uuid("Invalid amenity ID."),
});

export const assignAmenitiesSchema = z.object({
  amenityIds: z.array(z.string().uuid()).max(100),
});

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityInput = z.infer<typeof updateAmenitySchema>;
