import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ARMY_UNIT_DATA, DEFAULT_ARMY_ID } from "@/lib/data/catalog/armyData";
import type { NormalizedArmyUnits } from "@/lib/data/catalog/types";

type CatalogState = {
  armyId: string;
  raw: NormalizedArmyUnits;
};

const getArmyData = (armyId: string | null | undefined): NormalizedArmyUnits => {
  if (!armyId) return ARMY_UNIT_DATA[DEFAULT_ARMY_ID];
  return ARMY_UNIT_DATA[armyId] ?? ARMY_UNIT_DATA[DEFAULT_ARMY_ID];
};

const initialState: CatalogState = {
  armyId: DEFAULT_ARMY_ID,
  raw: getArmyData(DEFAULT_ARMY_ID),
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setCatalogArmy(state, action: PayloadAction<string | null | undefined>) {
      const targetId = action.payload ?? DEFAULT_ARMY_ID;
      state.armyId = targetId;
      state.raw = getArmyData(targetId);
    },
  },
});

export const { setCatalogArmy } = catalogSlice.actions;
export default catalogSlice.reducer;
export type { CatalogState };
export { initialState as catalogInitialState };
