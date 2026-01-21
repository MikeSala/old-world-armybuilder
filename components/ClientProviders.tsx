"use client";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ScreenSizeProvider } from "@/components/layout/ScreenSizeContext";
import { store, persistor } from "@/lib/store";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Tooltip.Provider delayDuration={150} skipDelayDuration={100}>
          <ScreenSizeProvider>{children}</ScreenSizeProvider>
        </Tooltip.Provider>
      </PersistGate>
    </Provider>
  );
}
