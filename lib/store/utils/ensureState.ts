/**
 * Utility functions for ensuring Redux state structure integrity.
 * Used to provide defensive null checks and default values for nested state objects.
 */

import type { RosterEntry } from "@/lib/roster/normalizeEntry";
import { normalizeRosterEntries } from "@/lib/roster/normalizeEntry";

/**
 * UI state structure for roster
 */
export type RosterUIState = {
  errors: Record<string, string>;
  saving: boolean;
  savedAt: number | null;
  pointsInput: string;
  setupCollapsed: boolean;
};

/**
 * Default UI state values
 */
export const DEFAULT_UI_STATE: RosterUIState = {
  errors: {},
  saving: false,
  savedAt: null,
  pointsInput: "2000",
  setupCollapsed: false,
};

/**
 * Ensures UI state object exists and has all required fields.
 * If UI state is missing or incomplete, fills in defaults.
 *
 * @param state - State object that may contain ui property
 * @returns The ensured UI state object
 */
export function ensureUI<T extends { ui?: Partial<RosterUIState> }>(state: T): RosterUIState {
  if (!state.ui) {
    return { ...DEFAULT_UI_STATE };
  }

  return {
    errors: state.ui.errors ?? DEFAULT_UI_STATE.errors,
    saving: state.ui.saving ?? DEFAULT_UI_STATE.saving,
    savedAt: state.ui.savedAt ?? DEFAULT_UI_STATE.savedAt,
    pointsInput: state.ui.pointsInput ?? DEFAULT_UI_STATE.pointsInput,
    setupCollapsed: typeof state.ui.setupCollapsed === "boolean"
      ? state.ui.setupCollapsed
      : DEFAULT_UI_STATE.setupCollapsed,
  };
}

/**
 * Ensures entries array exists and is normalized.
 * If entries are missing, returns empty array.
 * Always normalizes entries to ensure data integrity.
 *
 * @param state - State object that may contain draft.entries
 * @returns Normalized entries array
 */
export function ensureEntries<T extends { draft: { entries?: RosterEntry[] } }>(
  state: T
): RosterEntry[] {
  if (!state.draft.entries) {
    return [];
  }
  return normalizeRosterEntries(state.draft.entries);
}
