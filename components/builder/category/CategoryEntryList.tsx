import { clsx } from "clsx";

import type { OptionLabelByUnitId } from "@/lib/builder/unitHelpers";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";
import { translateNameForDict, translateTextForDict } from "@/lib/i18n/translateLocale";

import type { Dict } from "./types";

type Props = {
  entries: RosterEntry[];
  dict: Dict;
  unitLabelById?: Map<string, string>;
  optionLabelByUnitId?: OptionLabelByUnitId;
  onSelect?: (entry: RosterEntry) => void;
  activeEntryId?: string | null;
};

export function CategoryEntryList({
  entries,
  dict,
  unitLabelById,
  optionLabelByUnitId,
  onSelect,
  activeEntryId,
}: Props) {
  if (entries.length === 0) return null;

  return (
    <ul className="flex w-full flex-col gap-2">
      {entries.map((entry) => {
        const optionMap = optionLabelByUnitId?.get(entry.unitId);
        const optionNames = entry.options
          .map((opt) => {
            const optionInfo = opt.sourceId ? optionMap?.get(opt.sourceId) : null;
            if (optionInfo?.label) return optionInfo.label;
            return opt.name ? translateTextForDict(opt.name, dict) : opt.name;
          })
          .filter((name): name is string => Boolean(name && name.trim().length > 0));
        const unitName =
          unitLabelById?.get(entry.unitId) ?? translateNameForDict(entry.name, dict);
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
              "w-full rounded-lg border px-3 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 print-bg-white",
              activeEntryId === entry.id
                ? "border-stone-400 bg-stone-800/80"
                : "border-stone-300/10 bg-stone-800/50 hover:border-stone-300/40 hover:bg-stone-800/70",
              onSelect && "cursor-pointer active:scale-[0.99]"
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
              <span className="text-sm font-semibold text-stone-100">{unitName}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-200/80">
                {totalPointsLabel}
              </span>
            </div>
            {unitSummary ? (
              <div className="text-xs text-stone-200/70">
                {unitSummary}
                {perModelCost ? ` · ${perModelCost}` : null}
              </div>
            ) : null}
            {optionNames.length > 0 ? (
              <div className="mt-1 text-xs text-stone-200/70">{optionNames.join(", ")}</div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
