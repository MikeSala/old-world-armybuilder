/**
 * Type coercion utilities for safe runtime type conversions
 */

/**
 * Safely converts a value to a string, ensuring it's non-empty after trimming.
 * @param value - The value to convert
 * @returns The trimmed string if valid, undefined otherwise
 */
export const toString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

/**
 * Safely converts a value to a number.
 * @param value - The value to convert
 * @returns The number if valid and finite, undefined otherwise
 */
export const toNumber = (value: unknown): number | undefined => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return undefined;
  return num;
};

/**
 * Converts a value to a boolean.
 * @param value - The value to convert
 * @returns The boolean value
 */
export const toBoolean = (value: unknown): boolean => Boolean(value);

/**
 * Type guard to check if a value is a non-empty string.
 * @param value - The value to check
 * @returns True if value is a non-empty string
 */
export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
