/**
 * Mathematical utility functions
 */

/**
 * Clamps a value between a minimum and maximum value.
 * @param value - The value to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value
 *
 * @example
 * clamp(15, 0, 10) // returns 10
 * clamp(-5, 0, 10) // returns 0
 * clamp(5, 0, 10) // returns 5
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * Ensures a value is non-negative by clamping it to 0 if it's negative.
 * @param value - The value to clamp
 * @returns The value if positive, 0 otherwise
 *
 * @example
 * clampNonNegative(5) // returns 5
 * clampNonNegative(-3) // returns 0
 * clampNonNegative(0) // returns 0
 */
export const clampNonNegative = (value: number): number => Math.max(0, value);
