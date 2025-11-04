import type { RosterEntry } from "@/lib/store/slices/rosterSlice";

import type { Dict } from "./types";

type Props = {
  entries: RosterEntry[];
  dict: Dict;
};

export function CategoryEntryList({ entries, dict }: Props) {
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
            className="w-full rounded-lg border border-amber-300/10 bg-slate-900/50 px-3 py-2 print-bg-white"
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
