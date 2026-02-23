/**
 * Reusable Tailwind CSS class combinations used throughout the application.
 * These constants ensure visual consistency and make it easier to update styles globally.
 */

/**
 * Card/container styles with stone borders and dark backgrounds
 */
export const TAILWIND_CARDS = {
  /** Standard option card - Used in CategoryConfigurator, OptionGroupSection */
  OPTION_CARD: "rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-300/20 dark:bg-stone-800/60",

  /** Detail card with shadow - Used in RosterDetailSheet */
  DETAIL_CARD: "rounded-xl border border-stone-200 bg-white p-4 shadow shadow-stone-200/50 dark:border-stone-400/10 dark:bg-stone-900/60 dark:shadow-stone-900/10",

  /** Main configurator section - Used in CategoryConfigurator */
  CONFIGURATOR_SECTION: "rounded-2xl border border-stone-200 bg-white p-5 text-stone-900 shadow-lg shadow-stone-200/50 dark:border-stone-300/30 dark:bg-stone-800/60 dark:text-stone-100 dark:shadow-stone-900/10",
} as const;

/**
 * Text styling variants
 */
export const TAILWIND_TEXT = {
  /** Muted text for hints and secondary information */
  MUTED: "text-xs text-stone-500 print:text-gray-600 print:text-[11px] dark:text-stone-200/70",

  /** Muted text (shorter variant without print) */
  MUTED_SHORT: "text-xs text-stone-500 dark:text-stone-200/70",

  /** Empty state messages */
  EMPTY_STATE: "text-sm text-stone-500 print:text-gray-700 dark:text-stone-200/60",

  /** Section headings */
  SECTION_HEADING: "text-sm font-semibold uppercase tracking-[0.2em] text-stone-600 dark:text-stone-300",
} as const;

/**
 * Input field styles
 */
export const TAILWIND_INPUTS = {
  /** Search input field - Used in UnitSearch */
  SEARCH: "rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 shadow-inner outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-300 dark:border-stone-400/30 dark:bg-stone-900/50 dark:text-stone-100 dark:focus:border-stone-300 dark:focus:ring-stone-400",
} as const;

/**
 * All Tailwind constants in a single object for convenience
 */
export const TAILWIND = {
  ...TAILWIND_CARDS,
  ...TAILWIND_TEXT,
  ...TAILWIND_INPUTS,
} as const;
