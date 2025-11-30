// API-specific types (requests, responses, errors)

import type { NextRequest, NextResponse } from "next/server";

// HTTP Methods
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Request context for API routes
export interface RequestContext {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/** API Route Handler type
 * A function that accepts the incoming NextRequest and extra context, and returns a Response.
 */
export type ApiRouteHandler = (request: NextRequest, context: RequestContext) => Promise<NextResponse | Response>;

// Validation error structure
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
