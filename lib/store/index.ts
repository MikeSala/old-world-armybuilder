"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import catalogReducer from "./slices/catalogSlice";
import clipboardReducer from "./slices/clipboardSlice";
import rosterReducer from "./slices/rosterSlice";

const rootPersistConfig = {
  key: "wab",
  storage,
  whitelist: ["roster", "clipboard"],
};

const rootReducer = combineReducers({
  roster: rosterReducer,
  catalog: catalogReducer,
  clipboard: clipboardReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
