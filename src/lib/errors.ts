// Base application error class
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  abstract readonly isOperational: boolean;

  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = this.constructor.name;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication errors
export class AuthenticationError extends AppError {
  readonly statusCode = 401;
  readonly code = "AUTHENTICATION_ERROR";
  readonly isOperational = true;

  constructor(message = "Authentication required", cause?: Error) {
    super(message, cause);
  }
}

export class AuthorizationError extends AppError {
  readonly statusCode = 403;
  readonly code = "AUTHORIZATION_ERROR";
  readonly isOperational = true;

  constructor(message = "Insufficient permissions", cause?: Error) {
    super(message, cause);
  }
}

// Validation errors
export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly code = "VALIDATION_ERROR";
  readonly isOperational = true;

  constructor(message = "Invalid input data", cause?: Error) {
    super(message, cause);
  }
}

// Resource errors
export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly code = "RESOURCE_NOT_FOUND";
  readonly isOperational = true;

  constructor(resource = "Resource", cause?: Error) {
    super(`${resource} not found`, cause);
  }
}

export class ConflictError extends AppError {
  readonly statusCode = 409;
  readonly code = "RESOURCE_CONFLICT";
  readonly isOperational = true;

  constructor(message = "Resource conflict", cause?: Error) {
    super(message, cause);
  }
}

// Database errors
export class DatabaseError extends AppError {
  readonly statusCode = 500;
  readonly code = "DATABASE_ERROR";
  readonly isOperational = true;

  constructor(message = "Database operation failed", cause?: Error) {
    super(message, cause);
  }
}

// External service errors
export class ExternalServiceError extends AppError {
  readonly statusCode = 502;
  readonly code = "EXTERNAL_SERVICE_ERROR";
  readonly isOperational = true;

  constructor(service: string, cause?: Error) {
    super(`External service ${service} is unavailable`, cause);
  }
}

// Rate limiting errors
export class RateLimitError extends AppError {
  readonly statusCode = 429;
  readonly code = "RATE_LIMIT_EXCEEDED";
  readonly isOperational = true;

  constructor(message = "Rate limit exceeded", cause?: Error) {
    super(message, cause);
  }
}

// Internal server errors
export class InternalServerError extends AppError {
  readonly statusCode = 500;
  readonly code = "INTERNAL_SERVER_ERROR";
  readonly isOperational = false;

  constructor(message = "Internal server error", cause?: Error) {
    super(message, cause);
  }
}
