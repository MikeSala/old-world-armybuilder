import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { rosterInitialState } from "../slices/rosterSlice";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

const blankTotals = (): Record<CategoryKey, number> => ({
  characters: 0,
  core: 0,
  special: 0,
  rare: 0,
  mercenaries: 0,
  allies: 0,
});

const selectDraft = (state: RootState) => state.roster?.draft ?? rosterInitialState.draft;

export const selectSpentByCategory = createSelector([selectDraft], (draft) => {
  const totals = blankTotals();

  if (!draft?.entries?.length) {
    return totals;
  }

  for (const entry of draft.entries) {
    const points =
      (entry as any)?.totalPoints ?? (entry as any)?.points ?? (entry as any)?.basePoints ?? 0;
    const category = (entry as any)?.category;
    if (category in totals) {
      totals[category as CategoryKey] += points;
    }
  }

  return totals;
});
