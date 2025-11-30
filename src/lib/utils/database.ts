/**
 * Database Utilities for Prisma
 *
 * Common database operations and query helpers
 */

import { Prisma } from "@prisma/client";

// Standard pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Pagination result type
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Calculate pagination offset and limit
export function getPaginationParams(params: PaginationParams = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20)); // Max 100 items per page
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
    sortBy: params.sortBy || "createdAt",
    sortOrder: params.sortOrder || ("desc" as const),
  };
}

// Create pagination response
export function createPaginationResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResult<T> {
  const pages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  };
}

// Generate order by clause for Prisma
export function createOrderBy(sortBy: string, sortOrder: "asc" | "desc") {
  return {
    [sortBy]: sortOrder,
  };
}

// Safe database operation wrapper
export async function safeDbOperation<T>(operation: () => Promise<T>, errorMessage: string = "Database operation failed"): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(`Database Error: ${errorMessage}`, error);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      switch (error.code) {
        case "P2002":
          throw new Error("A record with this information already exists");
        case "P2025":
          throw new Error("Record not found");
        case "P2003":
          throw new Error("Invalid reference to related record");
        default:
          throw new Error(`Database error: ${error.message}`);
      }
    }

    throw new Error(errorMessage);
  }
}

// Build search filter for text fields
export function buildTextSearch(searchTerm?: string, fields: string[] = ["name"]) {
  if (!searchTerm) return {};

  // Create OR condition for multiple fields
  const orConditions = fields.map((field) => ({
    [field]: {
      contains: searchTerm,
      mode: "insensitive" as const,
    },
  }));

  return orConditions.length === 1 ? orConditions[0] : { OR: orConditions };
}

// Build date range filter
export function buildDateRangeFilter(
  startDate?: string | Date,
  endDate?: string | Date,
  field: string = "createdAt"
): Record<string, { gte?: Date; lte?: Date }> {
  const filter: Record<string, { gte?: Date; lte?: Date }> = {};

  if (startDate || endDate) {
    filter[field] = {};

    if (startDate) {
      filter[field].gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      filter[field].lte = end;
    }
  }

  return filter;
}

// Build price range filter
export function buildPriceRangeFilter(minPrice?: number, maxPrice?: number, field: string = "price"): Record<string, { gte?: number; lte?: number }> {
  const filter: Record<string, { gte?: number; lte?: number }> = {};

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter[field] = {};

    if (minPrice !== undefined) {
      filter[field].gte = minPrice;
    }

    if (maxPrice !== undefined) {
      filter[field].lte = maxPrice;
    }
  }

  return filter;
}

// Soft delete helper
export function softDelete() {
  return {
    deletedAt: new Date(),
  };
}

// Check if record is soft deleted
export function isNotDeleted() {
  return {
    deletedAt: null,
  };
}

// Generate unique slug for database records
export async function generateUniqueSlug<T>(
  baseSlug: string,
  checkExists: (slug: string) => Promise<T | null>,
  maxAttempts: number = 100
): Promise<string> {
  let slug = baseSlug;
  let attempt = 0;

  while (attempt < maxAttempts) {
    const existing = await checkExists(slug);

    if (!existing) {
      return slug;
    }

    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  throw new Error("Unable to generate unique slug");
}
