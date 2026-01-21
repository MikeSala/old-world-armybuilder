"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { ARMIES } from "@/lib/data/armies/armies";
import type { AppDispatch } from "@/lib/store";
import { setArmy, setSetupCollapsed } from "@/lib/store/slices/rosterSlice";

export function ArmyFromUrlInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;

    const armyParam = searchParams.get("army");

    // Set army from URL param if it exists and is valid
    if (armyParam) {
      const armyExists = ARMIES.some((a) => a.id === armyParam);
      if (armyExists) {
        dispatch(setArmy(armyParam));
        dispatch(setSetupCollapsed(false));
        hasInitialized.current = true;
      }
    }
  }, [searchParams, dispatch]);

  return null;
}
