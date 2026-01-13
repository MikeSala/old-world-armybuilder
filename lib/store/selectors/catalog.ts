import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { catalogInitialState } from "@/lib/store/slices/catalogSlice";
import { rosterInitialState } from "@/lib/store/slices/rosterSlice";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { NormalizedArmyUnits, NormalizedArmyUnit } from "@/lib/data/catalog/types";

const CATEGORY_FIELD_MAP: Record<CategoryKey, CategoryKey> = {
  characters: "characters",
  core: "core",
  special: "special",
  rare: "rare",
  mercenaries: "mercenaries",
  allies: "allies",
};

const ARMY_ID_ALIASES: Record<string, string[]> = {
  beastmen: ["beastmen-brayherds"],
  "orc-goblin-tribes": ["orc-and-goblin-tribes"],
};

const expandArmyCandidates = (candidates: string[]): string[] => {
  if (candidates.length === 0) return candidates;
  const expanded = new Set<string>();
  candidates.forEach((candidate) => {
    if (!candidate) return;
    expanded.add(candidate);
    const aliases = ARMY_ID_ALIASES[candidate];
    if (aliases) {
      aliases.forEach((alias) => expanded.add(alias));
    }
  });
  return Array.from(expanded);
};

export const selectCatalogRaw = (s: RootState) => s.catalog?.raw ?? catalogInitialState.raw;
export const selectCatalogArmyId = (s: RootState) => s.catalog?.armyId ?? catalogInitialState.armyId;
export const selectRosterDraft = (s: RootState) => s.roster?.draft ?? rosterInitialState.draft;

const isUnitAllowedForComposition = (
  unit: NormalizedArmyUnit,
  candidateCompositions: string[]
): boolean => {
  const compMap = unit.armyComposition;
  if (!compMap || Object.keys(compMap).length === 0) return true;
  return candidateCompositions.some((comp) => comp && compMap[comp]);
};

export const selectUnitsByCategory = createSelector(
  [selectCatalogRaw, selectRosterDraft],
  (raw: NormalizedArmyUnits, rosterDraft): Record<CategoryKey, NormalizedArmyUnit[]> => {
    const compositionId = rosterDraft?.compositionId ?? null;
    const armyId = rosterDraft?.armyId ?? null;
    const rawCandidates = [compositionId, armyId].filter((id): id is string => Boolean(id));
    const candidates = expandArmyCandidates(rawCandidates);

    const result = {} as Record<CategoryKey, NormalizedArmyUnit[]>;

    (Object.keys(CATEGORY_FIELD_MAP) as CategoryKey[]).forEach((categoryKey) => {
      const field = CATEGORY_FIELD_MAP[categoryKey];
      const units = ((raw as Record<string, unknown>)[field] as NormalizedArmyUnit[] | undefined) ?? [];
      result[categoryKey] = units.filter((unit) => isUnitAllowedForComposition(unit, candidates));
    });

    return result;
  }
);
