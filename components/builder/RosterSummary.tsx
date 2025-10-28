"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";

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
  const { name, description, entries, pointsLimit } = useSelector(
    (state: RootState) => state.roster.draft
  );

  const groups = groupEntriesByCategory(entries ?? []);
  const totalSpent = entries.reduce((sum, entry) => sum + entry.points, 0);

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
                    {items.reduce((sum, entry) => sum + entry.points, 0)} pts
                  </span>
                </div>
                <ul className="space-y-2 text-amber-100/90">
                  {items.map((entry) => (
                    <li key={entry.id} className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2">
                      <span className="font-medium">{entry.name}</span>
                      <span className="text-amber-200/80">{entry.points} pts</span>
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

