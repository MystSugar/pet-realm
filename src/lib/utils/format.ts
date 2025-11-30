import { v4 as uuidv4 } from "uuid";

/**
 * String and Number Formatting Utilities
 *
 * Common formatting functions for Pet Realm app
 */

// Capitalize first letter of each word
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// Create URL-friendly slug from text
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Format file size (bytes to human readable)
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
}

// Generate UUID for IDs
export function generateId(): string {
  return uuidv4();
}

// Extract initials from name (for avatars)
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Format phone number (Maldivian format)
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Maldivian phone numbers: +960 XXX-XXXX
  if (digits.startsWith("960") && digits.length === 10) {
    return `+960 ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Local format: XXX-XXXX
  if (digits.length === 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return phone; // Return as-is if format not recognized
}
