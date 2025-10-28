"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rosterReducer from "./slices/rosterSlice";
import catalogReducer from "./slices/catalogSlice";

const rootPersistConfig = {
  key: "wab",
  storage,
  whitelist: ["roster"],
};

const rootReducer = combineReducers({
  roster: rosterReducer,
  catalog: catalogReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
