/**
 * String manipulation and sanitization utilities
 */

/**
 * Extracts only digits from a string and limits the length.
 * Used for sanitizing numeric input fields.
 *
 * @param raw - The raw input string
 * @param maxLength - Maximum length of the resulting string (default: 4)
 * @returns A string containing only digits, truncated to maxLength
 *
 * @example
 * parseDigits("abc123def456") // returns "1234"
 * parseDigits("1234567", 3) // returns "123"
 */
export const parseDigits = (raw: string, maxLength: number = 4): string =>
  raw.replace(/\D+/g, "").slice(0, maxLength);

/**
 * Formats a dictionary template string by replacing placeholders with values.
 * Placeholders are in the format {key}.
 *
 * @param template - The template string with {key} placeholders
 * @param values - Object with key-value pairs to replace in the template
 * @returns The formatted string
 *
 * @example
 * formatTemplate("Hello {name}, you have {count} messages", { name: "John", count: 5 })
 * // returns "Hello John, you have 5 messages"
 */
export const formatTemplate = (
  template: string,
  values: Record<string, string | number>
): string =>
  Object.entries(values).reduce(
    (acc, [key, val]) => acc.replace(`{${key}}`, String(val)),
    template
  );
