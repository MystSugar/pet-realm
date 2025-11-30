import { useState, useEffect } from "react";

/**
 * useDebounce Hook
 *
 * Delays updating a value until after a specified delay.
 * Useful for search inputs to avoid excessive API calls.
 */

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay is complete
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Example usage:
 *
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * // Only triggers API call 500ms after user stops typing
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     searchProducts(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
