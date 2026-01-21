"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

type ScreenSizeContextValue = {
  isMobile: boolean;
  isHydrated: boolean;
};

const ScreenSizeContext = React.createContext<ScreenSizeContextValue | null>(null);

const getMediaQuery = () => {
  if (typeof window === "undefined") return null;
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
};

const subscribe = (callback: () => void) => {
  const mediaQuery = getMediaQuery();
  if (!mediaQuery) return () => {};

  const handler = () => callback();

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }

  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
};

const getSnapshot = () => {
  const mediaQuery = getMediaQuery();
  return mediaQuery ? mediaQuery.matches : false;
};

const getServerSnapshot = () => false;

export function ScreenSizeProvider({ children }: { children: React.ReactNode }) {
  const isMobile = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const value = React.useMemo(
    () => ({ isMobile, isHydrated }),
    [isMobile, isHydrated]
  );

  return <ScreenSizeContext.Provider value={value}>{children}</ScreenSizeContext.Provider>;
}

export function useScreenSize() {
  const context = React.useContext(ScreenSizeContext);

  if (!context) {
    throw new Error("useScreenSize must be used within a ScreenSizeProvider");
  }

  return context;
}
