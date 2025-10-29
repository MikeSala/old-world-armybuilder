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

type SelectedOption = {
  id: string;
  name: string;
  points: number;
  group: string;
  note?: string;
  perModel?: boolean;
  baseCost?: number;
};

type RosterEntry = {
  id: string;
  unitId: string;
  name: string;
  category: CategoryKey;
  unitSize: number;
  pointsPerModel: number;
  basePoints: number;
  options: SelectedOption[];
  totalPoints: number;
  notes?: string;
  owned: boolean;
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

const CATEGORY_KEYS: CategoryKey[] = [
  "characters",
  "core",
  "special",
  "rare",
  "mercenaries",
  "allies",
];

const isCategoryKey = (value: unknown): value is CategoryKey =>
  typeof value === "string" && CATEGORY_KEYS.includes(value as CategoryKey);

const normalizeSelectedOption = (option: any): SelectedOption => ({
  id:
    typeof option?.id === "string" && option.id.trim().length > 0
      ? option.id
      : `option-${Math.random().toString(36).slice(2)}`,
  name:
    typeof option?.name === "string" && option.name.trim().length > 0
      ? option.name
      : "Option",
  points: typeof option?.points === "number" ? option.points : 0,
  group:
    typeof option?.group === "string" && option.group.trim().length > 0
      ? option.group
      : "Options",
  note: typeof option?.note === "string" ? option.note : undefined,
  perModel: typeof option?.perModel === "boolean" ? option.perModel : undefined,
  baseCost: typeof option?.baseCost === "number" ? option.baseCost : undefined,
});

const normalizeEntry = (entry: any): RosterEntry => {
  const optionsArray = Array.isArray(entry?.options)
    ? entry.options.map(normalizeSelectedOption)
    : [];
  const rawUnitSize = Number(entry?.unitSize);
  const unitSize = Number.isFinite(rawUnitSize) && rawUnitSize > 0 ? Math.floor(rawUnitSize) : 1;
  const rawPointsPerModel = Number(entry?.pointsPerModel);
  const basePointsSource =
    typeof entry?.basePoints === "number"
      ? entry.basePoints
      : typeof entry?.points === "number"
      ? entry.points
      : 0;
  const pointsPerModel =
    Number.isFinite(rawPointsPerModel) && rawPointsPerModel > 0
      ? rawPointsPerModel
      : unitSize > 0
      ? basePointsSource / unitSize
      : basePointsSource;
  const normalizedPointsPerModel = Number.isFinite(pointsPerModel) ? pointsPerModel : 0;
  const basePoints = Math.max(0, normalizedPointsPerModel * unitSize);
  const optionsPoints = optionsArray.reduce(
    (sum: number, opt: SelectedOption) => sum + opt.points,
    0
  );
  const totalPoints =
    typeof entry?.totalPoints === "number"
      ? entry.totalPoints
      : basePoints + optionsPoints;
  const category = isCategoryKey(entry?.category) ? entry.category : "core";
  const owned = typeof entry?.owned === "boolean" ? entry.owned : false;

  return {
    id:
      typeof entry?.id === "string" && entry.id.trim().length > 0
        ? entry.id
        : `entry-${Math.random().toString(36).slice(2)}`,
    unitId:
      typeof entry?.unitId === "string" && entry.unitId.trim().length > 0
        ? entry.unitId
        : "unknown-unit",
    name:
      typeof entry?.name === "string" && entry.name.trim().length > 0
        ? entry.name
        : "Unknown unit",
    category,
    unitSize,
    pointsPerModel: normalizedPointsPerModel,
    basePoints,
    options: optionsArray,
    totalPoints,
    notes: typeof entry?.notes === "string" ? entry.notes : undefined,
    owned,
  };
};

const ensureEntries = (state: { draft: { entries?: RosterEntry[] } }) => {
  if (!state.draft.entries) {
    state.draft.entries = [];
  }
  state.draft.entries = state.draft.entries.map(normalizeEntry);
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
      ensureEntries(state);
    },
    upsertEntry(state, a: PayloadAction<RosterEntry>) {
      const entry = normalizeEntry(a.payload);
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
