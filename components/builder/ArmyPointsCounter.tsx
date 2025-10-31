"use client";

import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  setPoints,
  setPointsInput,
  setValidationErrors,
  rosterInitialState,
} from "@/lib/store/slices/rosterSlice";

type SuggestionMode = "set" | "add";

type Props = {
  dict: {
    armyPointsLabel: string;
    armyPointsSuggestionsLabel: string;
    armyPointsIncreaseAria: string;
    armyPointsDecreaseAria: string;
  };
  step?: number; // default 50
  min?: number; // default 0
  suggestions?: number[]; // default values
  suggestionMode?: SuggestionMode; // "set" | "add" (default "set")
  className?: string;
};

export default function ArmyPointsCounter({
  dict,
  step = 50,
  min = 0,
  suggestions = [0, 500, 1000, 1500, 2000, 3000],
  suggestionMode = "set",
  className,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const rosterState = useSelector((state: RootState) => state.roster) ?? rosterInitialState;
  const { draft, ui } = rosterState;
  const pointsLimit = draft?.pointsLimit ?? rosterInitialState.draft.pointsLimit;
  const pointsInput = ui?.pointsInput ?? String(pointsLimit);
  const errors = ui?.errors ?? rosterInitialState.ui.errors;

  const armyLabel = dict.armyPointsLabel;
  const armySuggestionLabel = dict.armyPointsSuggestionsLabel;
  const increaseAria = dict.armyPointsIncreaseAria.replace("{value}", String(step));
  const decreaseAria = dict.armyPointsDecreaseAria.replace("{value}", String(step));

  const updatePoints = useCallback(
    (next: number) => {
      const clamped = Math.max(min, next);
      dispatch(setPoints(clamped));
      dispatch(setPointsInput(String(clamped)));
      if (errors.points) {
        const nextErrors = { ...errors };
        delete nextErrors.points;
        dispatch(setValidationErrors(nextErrors));
      }
    },
    [dispatch, errors, min]
  );

  const handleInputChange = (raw: string) => {
    dispatch(setPointsInput(raw));

    if (raw.trim() === "") {
      dispatch(setPoints(0));
      return;
    }

    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      updatePoints(Math.round(parsed));
    }
  };

  const increment = () => updatePoints(pointsLimit + step);
  const decrement = () => updatePoints(pointsLimit - step);

  const onSuggestionClick = (s: number) => {
    updatePoints(suggestionMode === "add" ? pointsLimit + s : s);
  };

  return (
    <div className={className}>
      <label className="mb-2 block text-base font-semibold text-slate-100">{armyLabel}:</label>

      <div className="relative flex items-stretch">
        <input
          type="number"
          inputMode="numeric"
          step={step}
          min={min}
          value={pointsInput}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-lg text-slate-900 shadow-inner outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-300"
        />
        <div className="ml-2 flex flex-col">
          <button
            type="button"
            onClick={increment}
            className="rounded-md bg-slate-800 px-2 py-2 text-white shadow hover:bg-slate-700 active:translate-y-px"
            aria-label={increaseAria}
            title={`+${step}`}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={decrement}
            className="mt-2 rounded-md bg-slate-800 px-2 py-2 text-white shadow hover:bg-slate-700 active:translate-y-px"
            aria-label={decreaseAria}
            title={`-${step}`}
          >
            ▼
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-semibold text-slate-100">{armySuggestionLabel}:</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggestionClick(s)}
              className="rounded-md border border-slate-500 px-3 py-1 text-base text-slate-100 shadow-sm hover:bg-slate-200 hover:text-slate-900 active:translate-y-px"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
