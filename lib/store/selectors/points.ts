import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { rosterInitialState } from "../slices/rosterSlice";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import { normalizeRosterEntry } from "@/lib/roster/normalizeEntry";

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
    const normalized = normalizeRosterEntry(entry);
    totals[normalized.category] += normalized.totalPoints;
  }

  return totals;
});
