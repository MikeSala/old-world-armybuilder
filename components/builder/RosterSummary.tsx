"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";
import { removeEntry, toggleEntryOwned } from "@/lib/store/slices/rosterSlice";
import { Button } from "@/components/ui/Button";

type GroupedEntries = Record<string, RosterEntry[]>;

function groupEntriesByCategory(entries: RosterEntry[]): GroupedEntries {
  return entries.reduce<GroupedEntries>((acc, entry) => {
    const bucket = acc[entry.category] ?? [];
    bucket.push(entry);
    acc[entry.category] = bucket;
    return acc;
  }, {});
}

function formatCategoryLabel(category: string): string {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function RosterSummary({ className }: { className?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { name, description, entries, pointsLimit } = useSelector(
    (state: RootState) => state.roster.draft
  );

  const normalizedEntries = entries.map((entry) => {
    const legacyPoints = (entry as unknown as { points?: number }).points;
    const basePoints =
      typeof entry.basePoints === "number"
        ? entry.basePoints
        : typeof legacyPoints === "number"
        ? legacyPoints
        : 0;
    const options = Array.isArray(entry.options) ? entry.options : [];
    const optionsPoints = options.reduce((sum, opt) => sum + opt.points, 0);
    const totalPoints =
      typeof entry.totalPoints === "number" ? entry.totalPoints : basePoints + optionsPoints;

    return {
      ...entry,
      basePoints,
      totalPoints,
      options,
      owned: Boolean(entry.owned),
    };
  });

  const groups = groupEntriesByCategory(normalizedEntries);
  const totalSpent = normalizedEntries.reduce((sum, entry) => sum + entry.totalPoints, 0);

  return (
    <aside className={className} aria-labelledby="roster-summary-heading">
      <div className="rounded-2xl border border-amber-300/30 bg-slate-900/80 p-6 text-amber-100 shadow-lg shadow-amber-900/15">
        <header className="mb-4">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Roster Summary</p>
          <h2 id="roster-summary-heading" className="mt-1 text-2xl font-semibold">
            {name || "Untitled roster"}
          </h2>
          {description ? (
            <p className="mt-2 text-sm text-amber-200/70">{description}</p>
          ) : null}
          <div className="mt-3 flex items-center justify-between text-sm text-amber-200">
            <span>Points limit</span>
            <span className="font-semibold">{pointsLimit}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-amber-200">
            <span>Total spent</span>
            <span className="font-semibold">{totalSpent}</span>
          </div>
        </header>

        {entries.length === 0 ? (
          <p className="text-sm text-amber-200/60">
            No units selected yet. Use the category panels to add entries to your roster.
          </p>
        ) : (
          <ul className="space-y-5 text-sm">
            {Object.entries(groups).map(([category, items]) => (
              <li key={category} className="rounded-xl bg-slate-800/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-amber-200">
                    {formatCategoryLabel(category)}
                  </span>
                  <span className="text-amber-200/70">
                    {items.reduce((sum, entry) => sum + entry.totalPoints, 0)} pts
                  </span>
                </div>
                <ul className="space-y-2 text-amber-100/90">
                  {items.map((entry) => (
                    <li key={entry.id} className="rounded-lg bg-slate-900/60 px-3 py-2">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-amber-100">{entry.name}</span>
                          <label className="flex items-center gap-2 text-xs text-amber-200/80">
                            <input
                              type="checkbox"
                              checked={entry.owned}
                              onChange={(event) =>
                                dispatch(toggleEntryOwned({ id: entry.id, owned: event.target.checked }))
                              }
                              className="h-4 w-4 rounded border-amber-400 bg-slate-900 text-amber-500 focus:ring-amber-400"
                            />
                            <span>I own this unit</span>
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-200/80">{entry.totalPoints} pts</span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => dispatch(removeEntry(entry.id))}
                            aria-label={`Remove ${entry.name}`}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-amber-200/70">
                        Base cost: {entry.basePoints} pts
                      </div>
                      {entry.options.length ? (
                        <ul className="mt-2 space-y-1 text-xs text-amber-200/70">
                          {entry.options.map((opt) => (
                            <li key={opt.id} className="flex items-center justify-between gap-3">
                              <span>
                                <span className="font-medium">{opt.group}:</span> {opt.name}
                                {opt.note ? <span className="text-amber-200/60"> — {opt.note}</span> : null}
                              </span>
                              <span className="text-amber-200/80">
                                {opt.points ? `${opt.points} pts` : "free"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
