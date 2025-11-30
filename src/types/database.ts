// Database models + extended types

import type { OrderItem, Order, Product, Shop, User } from "@prisma/client";

export type { CartItem, OrderItem, Order, Product, Shop, User } from "@prisma/client";

// Re-exporting (using 'export type' for proper TypeScript)
export {
  AccountType,
  DeliveryType,
  IDType,
  OrderStatus,
  PaymentStatus,
  PetGender,
  ProductCategory,
  ShopCategory,
  DeleteReason,
} from "@prisma/client";

/**
 * Helpers to avoid repeating meta fields in many Omit<T, ...> calls.
 */
type MetaFields = "id" | "createdAt" | "updatedAt" | "deletedAt" | "deletedBy" | "deletedReason";

/**
 * Generic create / update helpers
 * - CreateInput<T> removes DB-managed meta fields
 * - UpdateInput<T> makes most fields partial (suitable for patch/update payloads)
 */
export type CreateInput<T> = Omit<T, MetaFields>;
export type UpdateInput<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;

// Extended types with relations
export interface UserWithShop extends User {
  shop?: Shop | null;
}

export interface ShopWithProducts extends Shop {
  products: Product[];
  _count: {
    products: number;
    orders: number;
  };
}

export interface ProductWithShop extends Product {
  shop: Shop;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[];
  customer: User;
  shop: Shop;
}

// Create/Update input types
export type UserCreateInput = CreateInput<User>;
export type ShopCreateInput = CreateInput<Shop>;
export type ProductCreateInput = CreateInput<Product>;

export type UserUpdateInput = UpdateInput<User>;
export type ShopUpdateInput = UpdateInput<Shop>;
export type ProductUpdateInput = UpdateInput<Product>;
