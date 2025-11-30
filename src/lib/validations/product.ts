import { z } from "zod";
import { PetGender, ProductCategory } from "@/types";
import { paginationSchema } from "./common";

// Product creation
export const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(100, "Name must be at most 100 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long").max(1000, "Description must be at most 1000 characters long"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.nativeEnum(ProductCategory, { message: "Please select a valid product category" }),

  tags: z.array(z.string()).max(10, "You can add up to 10 tags"),

  // Pet-specific fields (optional for non-live animals)
  breed: z.string().max(50, "Breed must be at most 50 characters long").optional(),
  age: z.coerce.number().min(0, "Age must be a positive number").optional(),
  gender: z.nativeEnum(PetGender, { message: "Please select a valid gender" }).optional(),
  weight: z.coerce.number().min(0, "Weight must be a positive number").optional(),
  color: z.string().max(30, "Color must be at most 30 characters long").optional(),

  // Live animal specific fields
  isLiveAnimal: z.boolean().default(false),
  vaccinationStatus: z.string().max(200, "Vaccination status must be at most 200 characters long").optional(),
  healthConditions: z.string().max(500, "Health conditions must be at most 500 characters long").optional(),
  specialNeeds: z.string().max(500, "Special needs must be at most 500 characters long").optional(),

  // Inventory
  stock: z.coerce.number().min(0, "Stock must be a non-negative number"),
  lowStockThreshold: z.coerce.number().min(0, "Low stock threshold must be a non-negative number").default(5),

  // Images (URLs from upload)
  imagesURL: z.array(z.string().url()).min(1, "You must upload at least one image").max(10, "You can upload up to 10 images"),
});

// Product update (all fields optional except ID)
export const updateProductSchema = createProductSchema.partial();

// Product filtering/search
export const productFilterSchema = z
  .object({
    category: z.nativeEnum(ProductCategory).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    tags: z.array(z.string()).optional(),
    isLiveAnimal: z.coerce.boolean().optional(),
    shopId: z.string().optional(),
    search: z.string().optional(),
  })
  .merge(paginationSchema);

// TypeScript types
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
