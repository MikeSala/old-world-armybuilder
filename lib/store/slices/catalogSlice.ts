import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ARMY_UNIT_DATA, DEFAULT_ARMY_ID, type ArmyUnitsRaw } from "@/lib/data/catalog/armyData";

type CatalogState = {
  armyId: string;
  raw: ArmyUnitsRaw;
};

const getArmyData = (armyId: string | null | undefined): ArmyUnitsRaw => {
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
