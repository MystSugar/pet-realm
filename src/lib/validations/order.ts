import { z } from "zod";
import { DeliveryType, OrderStatus, PaymentStatus } from "@/types";
import { locationSchema, atollSchema } from "./common";

// Order creation (from cart)
export const createOrderSchema = z
  .object({
    deliveryType: z.nativeEnum(DeliveryType, {
      message: "Delivery type is required",
    }),
    deliveryAddress: z.string().min(10, "Delivery address must be at least 10 characters long").optional(),
    deliveryIsland: locationSchema.optional(),
    deliveryAtoll: atollSchema.optional(),
    paymentMethod: z.string().min(1, "Payment method is required"),
    contactNumber: z.string().min(7, "Contact number must be at least 7 digits long"),
    specialInstructions: z.string().max(500, "Special instructions cannot exceed 500 characters").optional(),
  })
  .refine(
    (data) => {
      // If delivery is selected, address and location must be provided
      if (data.deliveryType === DeliveryType.DELIVERY) {
        return data.deliveryAddress && data.deliveryIsland && data.deliveryAtoll;
      }
      return true;
    },
    {
      message: "Delivery address, island, and atoll are required for delivery orders",
      path: ["deliveryAddress"],
    }
  );

// Order status update (shop owners)
export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    message: "Please select a valid order status",
  }),
});

// Payment status update (shop owners)
export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.nativeEnum(PaymentStatus, {
    message: "Please select a valid payment status",
  }),
});

// Payment receipt upload
export const uploadReceiptSchema = z.object({
  receiptUrl: z.string().url("Please upload a valid receipt image"),
});

// Typescript types
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UploadReceiptInput = z.infer<typeof uploadReceiptSchema>;
