import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { catalogInitialState } from "@/lib/store/slices/catalogSlice";
import { rosterInitialState } from "@/lib/store/slices/rosterSlice";
import type { ArmyUnitsRaw } from "@/lib/data/catalog/armyData";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

type ArmyUnit = {
  id?: string;
  name_en?: string;
  points?: number;
  armyComposition?: Record<string, { category?: string } | undefined>;
  [key: string]: unknown;
};

type UnitsByCategory = Record<CategoryKey, ArmyUnit[]>;

const CATEGORY_FIELD_MAP: Record<CategoryKey, keyof ArmyUnitsRaw> = {
  characters: "characters",
  core: "core",
  special: "special",
  rare: "rare",
  mercenaries: "mercenaries",
  allies: "allies",
};

export const selectCatalogRaw = (s: RootState) => s.catalog?.raw ?? catalogInitialState.raw;
export const selectCatalogArmyId = (s: RootState) => s.catalog?.armyId ?? catalogInitialState.armyId;
export const selectRosterDraft = (s: RootState) => s.roster?.draft ?? rosterInitialState.draft;

const isUnitAllowedForComposition = (
  unit: ArmyUnit,
  candidateCompositions: string[]
): boolean => {
  const compMap = unit.armyComposition;
  if (!compMap || Object.keys(compMap).length === 0) return true;
  return candidateCompositions.some((comp) => comp && compMap[comp]);
};

export const selectUnitsByCategory = createSelector(
  [selectCatalogRaw, selectRosterDraft],
  (raw: ArmyUnitsRaw, rosterDraft): UnitsByCategory => {
    const compositionId = rosterDraft?.compositionId ?? null;
    const armyId = rosterDraft?.armyId ?? null;
    const candidates = [compositionId, armyId].filter((id): id is string => Boolean(id));

    const result = {} as UnitsByCategory;

    (Object.keys(CATEGORY_FIELD_MAP) as CategoryKey[]).forEach((categoryKey) => {
      const field = CATEGORY_FIELD_MAP[categoryKey];
      const units = ((raw as Record<string, unknown>)[field] as ArmyUnit[] | undefined) ?? [];
      result[categoryKey] = units.filter((unit) => isUnitAllowedForComposition(unit, candidates));
    });

    return result;
  }
);

export type { ArmyUnit, UnitsByCategory };
