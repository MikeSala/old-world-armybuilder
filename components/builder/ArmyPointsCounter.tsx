"use client";

import { useCallback, useId, type KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import type { AppDispatch, RootState } from "@/lib/store";
import { setPoints, setPointsInput, setValidationErrors, rosterInitialState } from "@/lib/store/slices/rosterSlice";

type Props = {
  dict: Pick<
    LocaleDictionary,
    "armyPointsLabel" | "armyPointsIncreaseAria" | "armyPointsDecreaseAria" | "armyPointsPlaceholder"
  >;
  step?: number;
  min?: number;
  className?: string;
  showLabel?: boolean;
};

const MAX_POINTS = 9999;

// helpery
const clamp = (v: number, mn: number, mx: number) => Math.min(mx, Math.max(mn, v));
const parseDigits = (raw: string) => raw.replace(/\D+/g, "").slice(0, 4);

export default function ArmyPointsCounter({
  dict,
  step = 50,
  min = 0,
  className,
  showLabel = true,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { pointsLimit, pointsInput, errors } = useSelector((state: RootState) => {
    const draft = state.roster?.draft ?? rosterInitialState.draft;
    const ui = state.roster?.ui ?? rosterInitialState.ui;
    return {
      pointsLimit: draft.pointsLimit,
      pointsInput: ui.pointsInput ?? String(draft.pointsLimit),
      errors: ui.errors ?? {},
    };
  });
  const hasPointsError = Boolean(errors.points);

  const labelId = useId();

  const armyLabel = dict.armyPointsLabel;
  const increaseAria = dict.armyPointsIncreaseAria.replace("{value}", String(step));
  const decreaseAria = dict.armyPointsDecreaseAria.replace("{value}", String(step));
  const placeholderText = dict.armyPointsPlaceholder;

  const commitPoints = useCallback(
    (nextNumberLike: string | number) => {
      const digits = typeof nextNumberLike === "number" ? String(nextNumberLike) : nextNumberLike;
      const sanitized = parseDigits(digits);
      const parsed = sanitized === "" ? 0 : Number(sanitized);
      const clamped = clamp(Math.round(parsed), min, MAX_POINTS);

      dispatch(setPoints(clamped));
      dispatch(setPointsInput(String(clamped)));

      if (hasPointsError) {
        const nextErrors = { ...errors };
        delete nextErrors.points;
        dispatch(setValidationErrors(nextErrors));
      }
    },
    [dispatch, errors, hasPointsError, min]
  );

  const handleChange = useCallback(
    (raw: string) => {
      dispatch(setPointsInput(raw));
    },
    [dispatch]
  );

  const handleBlur = useCallback(() => {
    commitPoints(pointsInput);
  }, [commitPoints, pointsInput]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        commitPoints(pointsInput);
      } else if (e.key === "Escape") {
        dispatch(setPointsInput(String(pointsLimit)));
      }
    },
    [commitPoints, dispatch, pointsInput, pointsLimit]
  );

  const increment = useCallback(() => commitPoints(pointsLimit + step), [commitPoints, pointsLimit, step]);
  const decrement = useCallback(() => commitPoints(pointsLimit - step), [commitPoints, pointsLimit, step]);

  const canInc = pointsLimit < MAX_POINTS;
  const canDec = pointsLimit > min;

  return (
    <div className={className}>
      {showLabel ? (
        <label id={labelId} className="mb-1 block text-sm font-semibold text-slate-100">
          {armyLabel}:
        </label>
      ) : null}

      <div className="relative flex items-center gap-2">
        <input
          aria-labelledby={labelId}
          type="text"
          inputMode="numeric"
          value={pointsInput}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
          className="w-48 rounded-md border border-amber-300/30 bg-slate-950/70 px-3 py-2 text-sm text-amber-50 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder={placeholderText}
        />
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={increment}
            disabled={!canInc}
            className="rounded-md bg-slate-800 px-2 py-1 text-xs text-white shadow hover:bg-slate-700 active:translate-y-px disabled:opacity-50"
            aria-label={increaseAria}
            title={`+${step}`}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={decrement}
            disabled={!canDec}
            className="rounded-md bg-slate-800 px-2 py-1 text-xs text-white shadow hover:bg-slate-700 active:translate-y-px disabled:opacity-50"
            aria-label={decreaseAria}
            title={`-${step}`}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
