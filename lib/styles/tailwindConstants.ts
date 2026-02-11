/**
 * Reusable Tailwind CSS class combinations used throughout the application.
 * These constants ensure visual consistency and make it easier to update styles globally.
 */

/**
 * Card/container styles with stone borders and dark backgrounds
 */
export const TAILWIND_CARDS = {
  /** Standard option card - Used in CategoryConfigurator, OptionGroupSection */
  OPTION_CARD: "rounded-xl border border-stone-300/20 bg-stone-800/60 p-4",

  /** Detail card with shadow - Used in RosterDetailSheet */
  DETAIL_CARD: "rounded-xl border border-stone-400/10 bg-stone-900/60 p-4 shadow shadow-stone-900/10",

  /** Main configurator section - Used in CategoryConfigurator */
  CONFIGURATOR_SECTION: "rounded-2xl border border-stone-300/30 bg-stone-800/60 p-5 text-stone-100 shadow-lg shadow-stone-900/10",
} as const;

/**
 * Text styling variants
 */
export const TAILWIND_TEXT = {
  /** Muted text for hints and secondary information */
  MUTED: "text-xs text-stone-200/70 print:text-gray-600 print:text-[11px]",

  /** Muted text (shorter variant without print) */
  MUTED_SHORT: "text-xs text-stone-200/70",

  /** Empty state messages */
  EMPTY_STATE: "text-sm text-stone-200/60 print:text-gray-700",

  /** Section headings */
  SECTION_HEADING: "text-sm font-semibold uppercase tracking-[0.2em] text-stone-300",
} as const;

/**
 * Input field styles
 */
export const TAILWIND_INPUTS = {
  /** Search input field - Used in UnitSearch */
  SEARCH: "rounded-xl border border-stone-400/30 bg-stone-900/50 px-4 py-3 text-base text-stone-100 shadow-inner outline-none transition focus:border-stone-300 focus:ring-2 focus:ring-stone-400",
} as const;

/**
 * All Tailwind constants in a single object for convenience
 */
export const TAILWIND = {
  ...TAILWIND_CARDS,
  ...TAILWIND_TEXT,
  ...TAILWIND_INPUTS,
} as const;
