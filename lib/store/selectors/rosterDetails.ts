import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import {
  rosterInitialState,
  type RosterEntry,
  type SelectedOption,
} from "@/lib/store/slices/rosterSlice";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import {
  buildUnitStatIndex,
  getArmyUnitStats,
  normalizeUnitStatKey,
  type UnitStatLine,
} from "@/lib/data/domain/units/units-stats";

const selectDraft = (state: RootState) => state.roster?.draft ?? rosterInitialState.draft;

const normalizeOptions = (entry: RosterEntry): SelectedOption[] =>
  Array.isArray(entry.options) ? entry.options.map((option) => ({ ...option })) : [];

const normalizeRosterEntry = (entry: RosterEntry) => {
  const options = normalizeOptions(entry);
  const optionsPoints = options.reduce((sum, opt) => sum + (opt.points ?? 0), 0);
  const legacyPoints = (entry as unknown as { points?: number }).points;
  const basePoints =
    typeof entry.basePoints === "number"
      ? entry.basePoints
      : typeof legacyPoints === "number"
      ? legacyPoints
      : 0;
  const unitSize =
    typeof entry.unitSize === "number" && entry.unitSize > 0 ? Math.floor(entry.unitSize) : 1;
  const pointsPerModel =
    typeof entry.pointsPerModel === "number" && entry.pointsPerModel > 0
      ? entry.pointsPerModel
      : unitSize > 0
      ? basePoints / unitSize
      : basePoints;
  const totalPoints =
    typeof entry.totalPoints === "number" ? entry.totalPoints : basePoints + optionsPoints;

  return {
    ...entry,
    options,
    basePoints,
    unitSize,
    pointsPerModel,
    totalPoints,
    owned: Boolean(entry.owned),
  };
};

export type NormalizedRosterEntry = ReturnType<typeof normalizeRosterEntry>;

export type RosterEntryWithStats = NormalizedRosterEntry & {
  stats: UnitStatLine | null;
};

export type RosterDetailView = {
  name: string;
  description: string;
  armyId: string | null;
  compositionId: string | null;
  pointsLimit: number;
  entries: RosterEntryWithStats[];
  entriesByCategory: Partial<Record<CategoryKey, RosterEntryWithStats[]>>;
  totalsByCategory: Partial<Record<CategoryKey, number>>;
  totalPoints: number;
  statsAvailable: boolean;
};

export const ORDERED_CATEGORIES: CategoryKey[] = [
  "characters",
  "core",
  "special",
  "rare",
  "mercenaries",
  "allies",
];

const expandKeyVariants = (raw: string | null | undefined): string[] => {
  if (!raw || typeof raw !== "string") return [];
  const base = normalizeUnitStatKey(raw);
  if (!base) return [];

  const variants = new Set<string>();
  variants.add(base);

  const tryAdd = (candidate: string | null | undefined) => {
    if (!candidate) return;
    if (candidate.length === 0) return;
    variants.add(candidate);
  };

  if (base.endsWith("ies") && base.length > 3) {
    tryAdd(`${base.slice(0, -3)}y`);
  }

  if (base.endsWith("men") && base.length > 3) {
    tryAdd(`${base.slice(0, -3)}man`);
  }

  if (base.endsWith("ves") && base.length > 3) {
    tryAdd(`${base.slice(0, -3)}f`);
  }

  if (base.endsWith("s") && base.length > 3) {
    tryAdd(base.slice(0, -1));
  }

  return Array.from(variants);
};

export const selectRosterDetailView = createSelector([selectDraft], (draft): RosterDetailView => {
  const statsList = getArmyUnitStats(draft?.armyId);
  const statsIndex = buildUnitStatIndex(statsList);
  const entries = Array.isArray(draft?.entries) ? draft.entries : [];

  const entriesWithStats = entries.map((entry) => {
    const normalized = normalizeRosterEntry(entry);
    const candidateKeys = new Set<string>();
    expandKeyVariants(normalized.name).forEach((key) => candidateKeys.add(key));
    expandKeyVariants(normalized.unitId).forEach((key) => candidateKeys.add(key));

    let matchedStats: UnitStatLine | undefined;
    for (const candidate of candidateKeys) {
      const found = statsIndex.get(candidate);
      if (found) {
        matchedStats = found;
        break;
      }
    }

    return {
      ...normalized,
      stats: matchedStats ?? null,
    };
  });

  const totalsByCategory: Partial<Record<CategoryKey, number>> = {};
  const entriesByCategory: Partial<Record<CategoryKey, RosterEntryWithStats[]>> = {};
  let totalPoints = 0;

  entriesWithStats.forEach((entry) => {
    const category = entry.category;
    const existingList = entriesByCategory[category] ?? [];
    existingList.push(entry);
    entriesByCategory[category] = existingList;

    const previousTotal = totalsByCategory[category] ?? 0;
    totalsByCategory[category] = previousTotal + entry.totalPoints;
    totalPoints += entry.totalPoints;
  });

  const sortedEntriesByCategory = ORDERED_CATEGORIES.reduce<
    Partial<Record<CategoryKey, RosterEntryWithStats[]>>
  >((acc, category) => {
    if (entriesByCategory[category]?.length) {
      acc[category] = entriesByCategory[category]!;
    }
    return acc;
  }, {});

  return {
    name: draft?.name ?? "",
    description: draft?.description ?? "",
    armyId: draft?.armyId ?? null,
    compositionId: draft?.compositionId ?? null,
    pointsLimit: draft?.pointsLimit ?? 0,
    entries: entriesWithStats,
    entriesByCategory: sortedEntriesByCategory,
    totalsByCategory,
    totalPoints,
    statsAvailable: Boolean(statsList && statsList.length > 0),
  };
});
