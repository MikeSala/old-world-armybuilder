/**
 * Redux selectors for roster data
 *
 * Note: For memoization, wrap these selectors in useMemo at the component level,
 * or use a memoization library like reselect if needed for complex derived state.
 */

import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { RosterEntry } from "@/lib/roster/normalizeEntry";

/**
 * Type for grouped roster entries by category
 */
export type GroupedEntries = Partial<Record<CategoryKey, RosterEntry[]>>;

/**
 * Groups roster entries by their category.
 * This is a pure function that can be used directly or as a Redux selector.
 *
 * Performance note: This function creates a new object on each call.
 * For optimal performance, wrap calls in useMemo with entries as dependency:
 *
 * @example
 * // In a component:
 * const grouped = React.useMemo(
 *   () => groupEntriesByCategory(entries),
 *   [entries]
 * );
 *
 * @param entries - Array of roster entries to group
 * @returns Object with entries grouped by category key
 *
 * @example
 * const entries = [
 *   { category: 'core', ... },
 *   { category: 'special', ... },
 *   { category: 'core', ... }
 * ]
 * groupEntriesByCategory(entries)
 * // returns { core: [...], special: [...] }
 */
export const groupEntriesByCategory = (entries: RosterEntry[]): GroupedEntries =>
  entries.reduce<GroupedEntries>((acc, entry) => {
    const bucket = acc[entry.category] ?? [];
    bucket.push(entry);
    acc[entry.category] = bucket;
    return acc;
  }, {});
