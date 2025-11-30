import { z } from "zod";
import { ShopCategory } from "@/types";
import { phoneSchema, emailSchema, locationSchema, atollSchema } from "./common";

// Shop setup/creation
export const createShopSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(100, "Name cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  phone: phoneSchema,
  email: emailSchema.optional(),

  // Location
  island: locationSchema,
  atoll: atollSchema,
  address: z.string().min(5, "Address must be at least 5 characters long").max(200, "Address cannot exceed 200 characters"),

  category: z.nativeEnum(ShopCategory, { message: "Please select a valid shop category" }),

  // Business details
  license: z.string().max(50, "License number cannot exceed 50 characters").optional(),
  businessHours: z.string().max(100, "Business hours cannot exceed 100 characters").optional(),

  // Delivery
  deliveryAreas: z.array(locationSchema).default([]),
  deliveryFee: z.coerce.number().min(0, "Delivery fee must be a non-negative number").default(0),
});

// Shop update
export const updateShopSchema = createShopSchema.partial();

// Shop status update (admin only)
export const updateShopStatusSchema = z.object({
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// TypeScript types
export type CreateShopInput = z.infer<typeof createShopSchema>;
export type UpdateShopInput = z.infer<typeof updateShopSchema>;
export type UpdateShopStatusInput = z.infer<typeof updateShopStatusSchema>;
