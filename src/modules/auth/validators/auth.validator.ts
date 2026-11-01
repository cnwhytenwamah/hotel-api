import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters.")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must contain at least 2 characters.")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(150)
    .transform((value) => value.toLowerCase()),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional(),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(72, "Password must not exceed 72 characters.")
    .regex(/[A-Z]/, "Password must contain an uppercase letter.")
    .regex(/[a-z]/, "Password must contain a lowercase letter.")
    .regex(/[0-9]/, "Password must contain a number."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required.")
    .max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;