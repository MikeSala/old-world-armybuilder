import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { catalogInitialState } from "@/lib/store/slices/catalogSlice";
import { rosterInitialState } from "@/lib/store/slices/rosterSlice";
import type { EmpireRaw } from "@/lib/data/catalog/empire";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

type EmpireUnit = {
  id?: string;
  name_en?: string;
  points?: number;
  armyComposition?: Record<string, { category?: string } | undefined>;
  [key: string]: unknown;
};

type EmpireUnitsByCategory = Record<CategoryKey, EmpireUnit[]>;

const CATEGORY_FIELD_MAP: Record<CategoryKey, keyof EmpireRaw> = {
  characters: "characters",
  core: "core",
  special: "special",
  rare: "rare",
  mercenaries: "mercenaries",
  allies: "allies",
};

const DEFAULT_COMPOSITION_IDS = ["empire-of-man"];

export const selectEmpireRaw = (s: RootState) => s.catalog?.empireRaw ?? catalogInitialState.empireRaw;
export const selectEmpireIdx = (s: RootState) => s.catalog?.empireIdx ?? catalogInitialState.empireIdx;
export const selectRosterDraft = (s: RootState) => s.roster?.draft ?? rosterInitialState.draft;

const isUnitAllowedForComposition = (
  unit: EmpireUnit,
  candidateCompositions: string[]
): boolean => {
  const compMap = unit.armyComposition;
  if (!compMap || Object.keys(compMap).length === 0) return true;
  return candidateCompositions.some((comp) => comp && compMap[comp]);
};

export const selectEmpireUnitsByCategory = createSelector(
  [selectEmpireRaw, selectRosterDraft],
  (raw: EmpireRaw, rosterDraft): EmpireUnitsByCategory => {
    const compositionId = rosterDraft?.compositionId ?? null;
    const armyId = rosterDraft?.armyId ?? null;
    const candidates = [
      compositionId,
      armyId,
      ...DEFAULT_COMPOSITION_IDS,
    ].filter((id): id is string => Boolean(id));

    const result = {} as EmpireUnitsByCategory;

    (Object.keys(CATEGORY_FIELD_MAP) as CategoryKey[]).forEach((categoryKey) => {
      const field = CATEGORY_FIELD_MAP[categoryKey];
      const units = ((raw as Record<string, unknown>)[field] as EmpireUnit[] | undefined) ?? [];
      result[categoryKey] = units.filter((unit) => isUnitAllowedForComposition(unit, candidates));
    });

    return result;
  }
);

export type { EmpireUnit, EmpireUnitsByCategory };
