import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import { Prisma } from "@prisma/client";
import { AppError, InternalServerError, ValidationError } from "./errors";

// Standard API error response format
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
    timestamp: string;
    details?: unknown;
  };
}

// VALIDATION UTILITIES
// Extract user-friendly error messages from Zod errors
export function formatZodError(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const field = issue.path.join(".");
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(issue.message);
  });

  return fieldErrors;
}

// Validate data with Zod schema and throw ValidationError on failure
export function validateWithZod<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = formatZodError(error);
      const firstError = Object.values(fieldErrors)[0]?.[0] || "Validation failed";
      throw new ValidationError(firstError);
    }
    throw error;
  }
}

// Safely validate without throwing (returns result object)
export function safeValidateWithZod<T>(schema: ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }

  return {
    success: false,
    data: null,
    errors: formatZodError(result.error),
  };
}

// API ERROR HANDLING
// Standard API error response format
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
    timestamp: string;
    details?: unknown;
  };
}

// Format error for API response
function formatErrorResponse(message: string, code: string, statusCode: number, details?: unknown): ErrorResponse {
  return {
    error: {
      message,
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === "development" ? details : undefined,
    },
  };
}

// Handle Zod validation errors
function handleZodError(error: ZodError): ErrorResponse {
  const details = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
  }));

  return formatErrorResponse("Validation failed", "VALIDATION_ERROR", 400, details);
}

// Handle Prisma database errors
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): ErrorResponse {
  switch (error.code) {
    case "P2002":
      // Unique constraint violation
      return formatErrorResponse("Resource already exists", "RESOURCE_CONFLICT", 409, { field: error.meta?.target });

    case "P2025":
      // Record not found
      return formatErrorResponse("Resource not found", "RESOURCE_NOT_FOUND", 404);

    case "P2003":
      // Foreign key constraint
      return formatErrorResponse("Invalid reference", "INVALID_REFERENCE", 400, { field: error.meta?.field_name });

    default:
      return formatErrorResponse("Database operation failed", "DATABASE_ERROR", 500);
  }
}

// Main error handler function
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  // Log error for debugging
  // eslint-disable-next-line no-console
  console.error("API Error:", error);

  // Handle custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(formatErrorResponse(error.message, error.code, error.statusCode), { status: error.statusCode });
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errorResponse = handleZodError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorResponse = handlePrismaError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }

  // Handle generic Prisma errors
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return NextResponse.json(formatErrorResponse("Database error", "DATABASE_ERROR", 500), { status: 500 });
  }

  // Handle unknown errors
  const internalError = new InternalServerError(
    process.env.NODE_ENV === "development" ? (error as Error)?.message || "Unknown error" : "Something went wrong"
  );

  return NextResponse.json(formatErrorResponse(internalError.message, internalError.code, internalError.statusCode), { status: 500 });
}

// Utility wrapper for API routes
export function withErrorHandling<T extends unknown[], R>(handler: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R | NextResponse<ErrorResponse>> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
