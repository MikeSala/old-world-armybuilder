import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

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

type RosterEntry = {
  id: string;
  unitId: string;
  name: string;
  category: CategoryKey;
  points: number;
  notes?: string;
};

type RosterState = {
  draft: RosterDraft;
  ui: {
    errors: ValidationErrors;
    saving: boolean;
    savedAt: number | null;
    pointsInput: string;
  };
};

const initialState: RosterState = {
  draft: {
    armyId: null,
    compositionId: null,
    armyRuleId: null,
    pointsLimit: 0,
    name: "",
    description: "",
    entries: [],
  },
  ui: {
    errors: {},
    saving: false,
    savedAt: null,
    pointsInput: "0",
  },
};

const ensureUi = (state: { ui?: RosterState["ui"] }) => {
  if (!state.ui) {
    state.ui = { ...initialState.ui };
  }
  return state.ui;
};

const ensureEntries = (state: { draft: { entries?: RosterEntry[] } }) => {
  if (!state.draft.entries) {
    state.draft.entries = [];
  }
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
      state.draft.pointsLimit = Math.max(0, a.payload);
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
      ui.pointsInput = String(state.draft.pointsLimit ?? 0);
    },
    upsertEntry(state, a: PayloadAction<RosterEntry>) {
      const entry = a.payload;
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
  upsertEntry,
  removeEntry,
  clearEntries,
} = rosterSlice.actions;
export default rosterSlice.reducer;
export type { RosterDraft, ValidationErrors, RosterState, RosterEntry };
export { initialState as rosterInitialState };
