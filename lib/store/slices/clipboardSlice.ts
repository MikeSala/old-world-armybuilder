import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { normalizeRosterEntries } from "@/lib/roster/normalizeEntry";
import type { RosterDraft } from "@/lib/store/slices/rosterSlice";

const CLIPBOARD_LIMIT = 5;

type ClipboardItem = {
  id: string;
  name: string;
  savedAt: number;
  draft: RosterDraft;
};

type ClipboardState = {
  items: ClipboardItem[];
};

const initialState: ClipboardState = {
  items: [],
};

const normalizeDraft = (draft: RosterDraft): RosterDraft => ({
  armyId: draft.armyId ?? null,
  compositionId: draft.compositionId ?? null,
  armyRuleId: draft.armyRuleId ?? null,
  pointsLimit: Number.isFinite(draft.pointsLimit) ? Math.max(0, draft.pointsLimit) : 0,
  name: draft.name ?? "",
  description: draft.description ?? "",
  entries: normalizeRosterEntries(draft.entries ?? []),
});

const clampItems = (items: ClipboardItem[]) => items.slice(0, CLIPBOARD_LIMIT);

const clipboardSlice = createSlice({
  name: "clipboard",
  initialState,
  reducers: {
    saveToClipboard(state, action: PayloadAction<{ draft: RosterDraft; name?: string }>) {
      const savedAt = Date.now();
      const draft = normalizeDraft(action.payload.draft);
      const name = action.payload.name?.trim() || draft.name || "";
      const nextItems = Array.isArray(state.items) ? state.items : [];
      const item: ClipboardItem = {
        id: `clip-${savedAt}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        savedAt,
        draft,
      };

      state.items = clampItems([item, ...nextItems]);
    },
    removeClipboardItem(state, action: PayloadAction<string>) {
      if (!Array.isArray(state.items)) {
        state.items = [];
        return;
      }
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearClipboard(state) {
      state.items = [];
    },
  },
});

export const { saveToClipboard, removeClipboardItem, clearClipboard } = clipboardSlice.actions;
export default clipboardSlice.reducer;
export type { ClipboardItem, ClipboardState };
export { CLIPBOARD_LIMIT };
export { initialState as clipboardInitialState };
