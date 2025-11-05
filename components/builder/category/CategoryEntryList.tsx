import { clsx } from "clsx";

import type { RosterEntry } from "@/lib/store/slices/rosterSlice";

import type { Dict } from "./types";

type Props = {
  entries: RosterEntry[];
  dict: Dict;
  onSelect?: (entry: RosterEntry) => void;
  activeEntryId?: string | null;
};

export function CategoryEntryList({ entries, dict, onSelect, activeEntryId }: Props) {
  if (entries.length === 0) return null;

  return (
    <ul className="flex w-full flex-col gap-2">
      {entries.map((entry) => {
        const optionNames = entry.options
          .map((opt) => opt.name)
          .filter((name): name is string => Boolean(name && name.trim().length > 0));
        const unitSummary =
          entry.unitSize > 1
            ? dict.categoryEntryMultipleModels.replace("{count}", String(entry.unitSize))
            : entry.unitSize === 1
              ? dict.categoryEntrySingleModel
              : null;
        const perModelCost = entry.pointsPerModel
          ? dict.categoryEntryPointsPerModel.replace("{value}", String(entry.pointsPerModel))
          : null;
        const totalPointsLabel = dict.categoryPointsValue.replace(
          "{value}",
          String(entry.totalPoints)
        );

        return (
          <li
            key={entry.id}
            className={clsx(
              "w-full rounded-lg border px-3 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 print-bg-white",
              activeEntryId === entry.id
                ? "border-amber-400 bg-slate-900/80"
                : "border-amber-300/10 bg-slate-900/50 hover:border-amber-300/40 hover:bg-slate-900/70",
              onSelect && "cursor-pointer"
            )}
            role={onSelect ? "button" : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-current={activeEntryId === entry.id ? "true" : undefined}
            onClick={() => onSelect?.(entry)}
            onKeyDown={(event) => {
              if (!onSelect) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(entry);
              }
            }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-amber-100">{entry.name}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-200/80">
                {totalPointsLabel}
              </span>
            </div>
            {unitSummary ? (
              <div className="text-xs text-amber-200/70">
                {unitSummary}
                {perModelCost ? ` · ${perModelCost}` : null}
              </div>
            ) : null}
            {optionNames.length > 0 ? (
              <div className="mt-1 text-xs text-amber-200/70">{optionNames.join(", ")}</div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
