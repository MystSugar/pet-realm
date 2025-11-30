// Shared types used throughout the application (API responses, pagination)

/**
 * API Response wrapper - every API call returns this.
 * T is the type of `data`. Defaults to `unknown` if not specified.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * ApiError - structured error representation for APIs.
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

/**
 * Pagination - typical parameters for list endpoints.
 * Defaults (server-side): page = 1, limit = 20 (document that on the server).
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Generic paginated response shape.
 * items: the array of results
 * pagination: metadata about the page
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Form handling shapes
 */
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string[]>;
  isValid: boolean;
}

/**
 * Loading states for UI
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * ID type used.
 * Using string is common (e.g. UUID or stringified numeric IDs).
 */
export type ID = string;

/**
 * Optional<T, K>:
 * - Make the keys K in T optional, keep the rest unchanged.
 * Example: Optional<User, "age"> makes age optional on User.
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * RequireAtLeastOne<T, K>:
 * - From T, require that at least one key from K is present.
 * - If K is not provided, it defaults to all keys of T.
 *
 * Example:
 *   type Contact = RequireAtLeastOne<User, "email" | "phone">;
 *   // must provide email or phone (or both)
 */
export type RequireAtLeastOne<T, K extends keyof T = keyof T> = Pick<T, Exclude<keyof T, K>> &
  {
    [P in K]-?: Required<Pick<T, P>> & Partial<Pick<T, Exclude<K, P>>>;
  }[K];
