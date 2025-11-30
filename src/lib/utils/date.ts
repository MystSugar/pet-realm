/**
 * Date Utilities for Pet Realm
 *
 * Handles Maldivian timezone and business-specific date operations
 */

// Maldivian timezone offset (UTC+5)
export const MALDIVES_TIMEZONE = "Indian/Maldives";

// Get current date in Maldivian timezone
export function getMaldivesDate(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: MALDIVES_TIMEZONE }));
}

// Format date for display (Maldivian format)
export function formatDate(date: Date | string, format: "short" | "long" | "time" = "short"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: MALDIVES_TIMEZONE,
  };

  switch (format) {
    case "short":
      options.day = "2-digit";
      options.month = "2-digit";
      options.year = "numeric";
      return dateObj.toLocaleDateString("en-GB", options); // DD/MM/YYYY

    case "long":
      options.day = "numeric";
      options.month = "long";
      options.year = "numeric";
      return dateObj.toLocaleDateString("en-US", options); // January 1, 2024

    case "time":
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.hour12 = true;
      return dateObj.toLocaleTimeString("en-US", options); // 2:30 PM

    default:
      return dateObj.toLocaleDateString("en-GB", options);
  }
}

// Calculate relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = getMaldivesDate();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

  return formatDate(dateObj, "short");
}

// Check if date is today (Maldivian timezone)
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = getMaldivesDate();

  return dateObj.toDateString() === today.toDateString();
}

// Check if date is this week (starts Sunday)
export function isThisWeek(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = getMaldivesDate();
  const weekStart = new Date(today);

  // Get Sunday of current week
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
  weekStart.setDate(today.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return dateObj >= weekStart && dateObj <= weekEnd;
}
