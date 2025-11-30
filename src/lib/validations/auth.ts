import { z } from "zod";
import { emailSchema, passwordSchema, phoneSchema, idNumberSchema, locationSchema, atollSchema } from "./common";
import { IDType } from "@/types";

// User registration
export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(25, { message: "Name must be at most 25 characters long" }),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    idNumber: idNumberSchema,
    IDType: z.nativeEnum(IDType),
    nationality: z.string().optional(),
    island: locationSchema,
    atoll: atollSchema,
    address: z
      .string()
      .min(10, { message: "Address must be at least 10 characters long" })
      .max(100, { message: "Address must be at most 100 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// User login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

// Password reset request
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

// Password reset
export const passwordResetSchema = z
  .object({
    token: z.string().min(1, { message: "Reset token is required" }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// User profile update
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(25, { message: "Name must be at most 25 characters long" })
    .optional(),
  phone: phoneSchema.optional(),
  island: locationSchema.optional(),
  atoll: atollSchema.optional(),
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters long" })
    .max(100, { message: "Address must be at most 100 characters long" })
    .optional(),
  nationality: z.string().optional(),
});

// TypeScript types from Zod schemas
export type RegisterInputRaw = z.infer<typeof registerSchema>;
export type RegisterInput = Omit<RegisterInputRaw, "confirmPassword">; // Exclude confirmPassword because it's not needed beyond validation

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof passwordResetRequestSchema>;
export type ResetPasswordInput = z.infer<typeof passwordResetSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
