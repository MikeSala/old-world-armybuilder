import { createSlice } from "@reduxjs/toolkit";
import empire from "@/lib/data/domain/units/empire-of-man.json";
import { buildEmpireIndexes } from "@/lib/data/catalog/empire";

const initialIndexes = buildEmpireIndexes(empire);

const initialState = {
  empireRaw: empire,
  empireIdx: initialIndexes,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
});

export default catalogSlice.reducer;
export type CatalogState = ReturnType<typeof catalogSlice.reducer>;
export { initialState as catalogInitialState };
