import { z } from "zod";

// Reusable validation patterns
export const emailSchema = z.string().email({ message: "Please enter a valid email address" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

export const phoneSchema = z.string().regex(/^[79]\d{6}$/, { message: "Please enter a valid phone number" });

export const idNumberSchema = z
  .string()
  .min(7, { message: "ID Number must be at least 7 characters long" })
  .max(10, { message: "ID Number must be at most 10 characters long" })
  .regex(/^[A-Za-z0-9]+$/, { message: "ID Number can only contain letters and numbers" });

// Maldivian location validation
export const locationSchema = z.enum(["Male'", "Hulhumale Phase 1", "Hulhumale Phase 2", "Villimale"] as const, {
  message: "Please select a valid location",
});

export const atollSchema = z.enum(["K"] as const, {
  message: "Please select a valid atoll",
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().min(1, { message: "Page number must be at least 1" }).default(1),
  limit: z.coerce.number().min(1, { message: "Limit must be at least 1" }).max(100, { message: "Limit cannot exceed 100" }).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// API response helpers
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });
