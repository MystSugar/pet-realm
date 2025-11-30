/**
 * Currency Utilities for Maldivian Rufiyaa (MVR)
 *
 * Handles all currency formatting and calculations for Pet Realm
 */

// Maldivian Rufiyaa currency code
export const CURRENCY_CODE = "MVR";
export const CURRENCY_SYMBOL = "MVR";

// Format price in Maldivian Rufiyaa
export function formatPrice(
  amount: number | string,
  options: {
    showCurrency?: boolean;
    showDecimals?: boolean;
  } = {}
): string {
  const { showCurrency = true, showDecimals = true } = options;

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return "MVR 0.00";

  // Format with commas and decimals
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(numAmount);

  return showCurrency ? `${CURRENCY_SYMBOL} ${formatted}` : formatted;
}

// Parse price string to number
export function parsePrice(priceString: string): number {
  // Remove currency symbol and non-numeric characters except decimal point
  const cleanString = priceString.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
}

// Maldivian goods and services tax (TGST) rate
export const TAX_RATE = 0.08; // 8%

// Calculate total with tax
export function calculateTotal(subtotal: number, includeTax: boolean = true): number {
  return includeTax ? subtotal + subtotal * TAX_RATE : subtotal;
}

// Check if price is valid
export function isValidPrice(price: number): boolean {
  return typeof price === "number" && !isNaN(price) && price >= 0;
}

// Format price range
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}
