import type { RosterEntry } from "@/lib/store/slices/rosterSlice";

type Props = {
  entries: RosterEntry[];
};

export function CategoryEntryList({ entries }: Props) {
  if (entries.length === 0) return null;

  return (
    <ul className="space-y-2">
      {entries.map((entry) => {
        const optionNames = entry.options
          .map((opt) => opt.name)
          .filter((name): name is string => Boolean(name && name.trim().length > 0));
        const unitSummary =
          entry.unitSize > 1
            ? `${entry.unitSize} models`
            : entry.unitSize === 1
              ? "Single model"
              : null;

        return (
          <li
            key={entry.id}
            className="rounded-lg border border-amber-300/10 bg-slate-900/50 px-3 py-2"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-amber-100">{entry.name}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-200/80">
                {entry.totalPoints} pts
              </span>
            </div>
            {unitSummary ? (
              <div className="text-xs text-amber-200/70">
                {unitSummary}
                {entry.pointsPerModel ? ` · ${entry.pointsPerModel} pts per model` : null}
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
