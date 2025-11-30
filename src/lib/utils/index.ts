/**
 * Utility Library Index
 *
 * Centralized exports for all Pet Realm utilities
 */

// Re-export all utilities
export * from "./format";
export * from "./date";
export * from "./currency";
export * from "./database";
export * from "./api";
export * from "./image";

// Re-export commonly used utilities with convenient aliases
export { formatPrice as price } from "./currency";
export { formatDate as date, formatRelativeTime as timeAgo } from "./date";
export { createSlug as slug, truncateText as truncate, capitalizeWords as capitalize } from "./format";
export { validateImageFile as validateImage, generateImageFilename as imageFilename } from "./image";
export { createSuccessResponse as success, createErrorResponse as error } from "./api";
export { getPaginationParams as paginate } from "./database";
