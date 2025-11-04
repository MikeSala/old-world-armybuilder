"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/store";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Tooltip.Provider delayDuration={150} skipDelayDuration={100}>
          {children}
        </Tooltip.Provider>
      </PersistGate>
    </Provider>
  );
}
