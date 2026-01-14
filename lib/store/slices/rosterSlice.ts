import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  normalizeRosterEntry,
  normalizeRosterEntries,
  type RosterEntry,
  type SelectedOption,
} from "@/lib/roster/normalizeEntry";
import { clampNonNegative } from "@/lib/utils/math";

type RosterDraft = {
  armyId: string | null;
  compositionId: string | null;
  armyRuleId: string | null;
  pointsLimit: number;
  name: string;
  description: string;
  entries: RosterEntry[];
};
type ValidationErrors = {
  army?: string;
  points?: string;
};

type RosterState = {
  draft: RosterDraft;
  ui: {
    errors: ValidationErrors;
    saving: boolean;
    savedAt: number | null;
    pointsInput: string;
    setupCollapsed: boolean;
  };
};

const DEFAULT_POINTS_LIMIT = 2000;

const initialState: RosterState = {
  draft: {
    armyId: null,
    compositionId: null,
    armyRuleId: null,
    pointsLimit: DEFAULT_POINTS_LIMIT,
    name: "",
    description: "",
    entries: [],
  },
  ui: {
    errors: {},
    saving: false,
    savedAt: null,
    pointsInput: String(DEFAULT_POINTS_LIMIT),
    setupCollapsed: false,
  },
};

const ensureUi = (state: { ui?: RosterState["ui"] }) => {
  if (!state.ui) {
    state.ui = { ...initialState.ui };
  }
  if (typeof state.ui.setupCollapsed !== "boolean") {
    state.ui.setupCollapsed = initialState.ui.setupCollapsed;
  }
  return state.ui;
};

const ensureEntries = (state: { draft: { entries?: RosterEntry[] } }) => {
  if (!state.draft.entries) {
    state.draft.entries = [];
  }
  state.draft.entries = normalizeRosterEntries(state.draft.entries);
  return state.draft.entries;
};

const rosterSlice = createSlice({
  name: "roster",
  initialState,
  reducers: {
    setArmy(state, a: PayloadAction<string | null>) {
      const next = a.payload ?? null;
      const prev = state.draft.armyId ?? null;
      // Update armyId always
      state.draft.armyId = next;
      // Reset composition ONLY if the army really changed
      if (prev !== next) {
        state.draft.compositionId = null;
        state.draft.entries = [];
      }
    },
    setComposition(state, a: PayloadAction<string | null>) {
      state.draft.compositionId = a.payload;
    },
    setArmyRule(state, a: PayloadAction<string | null>) {
      state.draft.armyRuleId = a.payload;
    },
    setPoints(state, a: PayloadAction<number>) {
      state.draft.pointsLimit = clampNonNegative(a.payload);
    },
    setName(state, a: PayloadAction<string>) {
      state.draft.name = a.payload;
    },
    setDescription(state, a: PayloadAction<string>) {
      state.draft.description = a.payload;
    },
    loadDraft(state, a: PayloadAction<Partial<RosterDraft>>) {
      state.draft = { ...state.draft, ...a.payload };
      const ui = ensureUi(state);
      ui.pointsInput = String(state.draft.pointsLimit ?? DEFAULT_POINTS_LIMIT);
      ensureEntries(state);
    },
    upsertEntry(state, a: PayloadAction<RosterEntry>) {
      const entry = normalizeRosterEntry(a.payload);
      const entries = ensureEntries(state);
      const idx = entries.findIndex((e) => e.id === entry.id);
      if (idx >= 0) {
        entries[idx] = entry;
      } else {
        entries.push(entry);
      }
    },
    removeEntry(state, a: PayloadAction<string>) {
      const entries = ensureEntries(state);
      state.draft.entries = entries.filter((e) => e.id !== a.payload);
    },
    clearEntries(state) {
      state.draft.entries = [];
    },
    setValidationErrors(state, a: PayloadAction<ValidationErrors>) {
      const ui = ensureUi(state);
      ui.errors = a.payload;
    },
    setSaving(state, a: PayloadAction<boolean>) {
      const ui = ensureUi(state);
      ui.saving = a.payload;
    },
    setSavedAt(state, a: PayloadAction<number | null>) {
      const ui = ensureUi(state);
      ui.savedAt = a.payload;
    },
    setPointsInput(state, a: PayloadAction<string>) {
      const ui = ensureUi(state);
      ui.pointsInput = a.payload;
    },
    setSetupCollapsed(state, a: PayloadAction<boolean>) {
      const ui = ensureUi(state);
      ui.setupCollapsed = a.payload;
    },
    toggleEntryOwned(state, a: PayloadAction<{ id: string; owned: boolean }>) {
      const entries = ensureEntries(state);
      const target = entries.find((entry) => entry.id === a.payload.id);
      if (target) target.owned = a.payload.owned;
    },
  },
});

export const {
  setArmy,
  setComposition,
  setArmyRule,
  setPoints,
  setName,
  setDescription,
  loadDraft,
  setValidationErrors,
  setSaving,
  setSavedAt,
  setPointsInput,
  setSetupCollapsed,
  upsertEntry,
  removeEntry,
  clearEntries,
  toggleEntryOwned,
} = rosterSlice.actions;
export default rosterSlice.reducer;
export type { RosterDraft, ValidationErrors, RosterState, RosterEntry, SelectedOption };
export { initialState as rosterInitialState };
export { normalizeRosterEntry, normalizeRosterEntries } from "@/lib/roster/normalizeEntry";
