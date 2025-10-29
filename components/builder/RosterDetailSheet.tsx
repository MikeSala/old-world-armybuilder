"use client";

import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  ORDERED_CATEGORIES,
  selectRosterDetailView,
  type RosterEntryWithStats,
} from "@/lib/store/selectors/rosterDetails";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { UnitStatLine, StatValue } from "@/lib/data/domain/units/units-stats";

type Props = {
  onClose?: () => void;
  className?: string;
};

type StatFieldKey = "M" | "WS" | "BS" | "S" | "T" | "W" | "I" | "A" | "Ld";

const STAT_FIELDS: Array<{ key: StatFieldKey; label: string }> = [
  { key: "M", label: "M" },
  { key: "WS", label: "WS" },
  { key: "BS", label: "BS" },
  { key: "S", label: "S" },
  { key: "T", label: "T" },
  { key: "W", label: "W" },
  { key: "I", label: "I" },
  { key: "A", label: "A" },
  { key: "Ld", label: "Ld" },
];

const CATEGORY_TITLES: Record<CategoryKey, string> = {
  characters: "Characters",
  core: "Core",
  special: "Special",
  rare: "Rare",
  mercenaries: "Mercenaries",
  allies: "Allies",
};

const formatOptionCost = (points?: number | null, perModel?: boolean, baseCost?: number) => {
  if (!points) return "free";
  if (perModel && baseCost) {
    return `${points} pts (${baseCost} pts/model)`;
  }
  return `${points} pts`;
};

const formatUnitSummary = (entry: RosterEntryWithStats) => {
  const parts: string[] = [];
  parts.push(`Base cost: ${entry.basePoints} pts`);
  if (entry.unitSize > 1) {
    parts.push(`${entry.unitSize} models @ ${entry.pointsPerModel} pts`);
  }
  return parts.join(" · ");
};

const renderStatValue = (value: StatValue | undefined) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : value.toFixed(1);
  }
  return value;
};

const formatArray = (values: string[] | undefined) => {
  if (!Array.isArray(values) || values.length === 0) return null;
  return values.filter((item) => typeof item === "string" && item.trim().length > 0);
};

const infoFields: Array<{ key: keyof UnitStatLine; label: string }> = [
  { key: "unitCategory", label: "Category" },
  { key: "troopType", label: "Troop Type" },
  { key: "baseSize", label: "Base Size" },
  { key: "unitSize", label: "Unit Size" },
  { key: "armourValue", label: "Armour Value" },
];

const joinClasses = (...values: Array<string | undefined | null | false>) =>
  values.filter(Boolean).join(" ");

export default function RosterDetailSheet({ onClose, className }: Props) {
  const detailView = useSelector(selectRosterDetailView);

  const hasEntries = detailView.entries.length > 0;

  return (
    <div
      className={joinClasses(
        "relative flex max-h-[90vh] w-full max-w-5xl flex-col gap-6 overflow-y-auto rounded-3xl border border-amber-400/20 bg-slate-950/95 p-6 text-amber-100 shadow-2xl shadow-amber-900/30",
        className
      )}
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Roster Sheet</p>
            <h2 id="roster-detail-sheet-heading" className="text-2xl font-semibold">
              {detailView.name || "Untitled roster"}
            </h2>
            {detailView.description ? (
              <p className="mt-1 max-w-2xl text-sm text-amber-200/80">{detailView.description}</p>
            ) : null}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 rounded-full p-0 text-amber-200 hover:bg-amber-500/20"
            aria-label="Close roster sheet"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-amber-200/70">
          <span>
            Points limit: <strong className="text-amber-100">{detailView.pointsLimit}</strong>
          </span>
          <span>
            Total spent: <strong className="text-amber-100">{detailView.totalPoints}</strong>
          </span>
        </div>
        {!detailView.statsAvailable ? (
          <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            Statystyki jednostek dla wybranej armii nie są jeszcze kompletne. Jednostki bez danych
            pokażą placeholder.
          </p>
        ) : null}
      </header>

      {!hasEntries ? (
        <p className="text-sm text-amber-200/70">
          Dodaj jednostki do rosteru, aby zobaczyć ich szczegóły i statystyki.
        </p>
      ) : null}

      {ORDERED_CATEGORIES.filter(
        (category) => detailView.entriesByCategory[category]?.length
      ).map((category) => {
        const categoryEntries = detailView.entriesByCategory[category]!;
        const categoryTotal = detailView.totalsByCategory[category] ?? 0;
        return (
          <section
            key={category}
            aria-labelledby={`roster-category-${category}`}
            className="space-y-4 rounded-2xl border border-amber-300/20 bg-slate-900/70 p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3
                id={`roster-category-${category}`}
                className="text-lg font-semibold text-amber-200"
              >
                {CATEGORY_TITLES[category]}{" "}
                <span className="text-sm text-amber-200/60">[{categoryTotal} pts]</span>
              </h3>
              <span className="text-sm text-amber-200/70">
                {categoryEntries.length} unit{categoryEntries.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="space-y-4">
              {categoryEntries.map((entry) => {
                const stats = entry.stats ?? null;
                const statsName = stats?.name ?? stats?.unit ?? entry.name;
                const infoItems = infoFields
                  .map(({ key, label }) => {
                    const value = stats?.[key];
                    if (value === null || value === undefined || value === "") return null;
                    if (Array.isArray(value)) return null;
                    return { label, value: typeof value === "number" ? String(value) : String(value) };
                  })
                  .filter((item): item is { label: string; value: string } => item !== null);
                const equipmentList = formatArray(stats?.equipment);
                const rulesList = formatArray(stats?.specialRules);

                return (
                  <article
                    key={entry.id}
                    className="space-y-3 rounded-xl border border-amber-400/10 bg-slate-950/60 p-4 shadow shadow-amber-900/10"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-amber-100">
                          {entry.name}{" "}
                          <span className="text-sm font-normal text-amber-200/70">
                            [{entry.totalPoints} pts]
                          </span>
                        </h4>
                        <p className="text-xs text-amber-200/70">{formatUnitSummary(entry)}</p>
                      {entry.notes ? (
                        <p className="mt-1 text-xs text-amber-200/60">{entry.notes}</p>
                      ) : null}
                    </div>
                    <div className="text-right text-xs text-amber-200/70">
                      <span>Owned: {entry.owned ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  {entry.options.length ? (
                    <ul className="space-y-1 text-xs text-amber-200/80">
                      {entry.options.map((option) => (
                        <li key={option.id} className="flex flex-wrap justify-between gap-3">
                          <span>
                            <span className="font-semibold">{option.group}:</span> {option.name}
                            {option.note ? (
                              <span className="text-amber-200/60"> — {option.note}</span>
                            ) : null}
                          </span>
                          <span>{formatOptionCost(option.points, option.perModel, option.baseCost)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-amber-400/20 text-xs">
                      <thead className="text-amber-200/70">
                        <tr>
                          <th className="px-2 py-1 text-left font-semibold uppercase tracking-wide">
                            Model
                          </th>
                          {STAT_FIELDS.map((field) => (
                            <th
                              key={field.key}
                              className="px-2 py-1 text-center font-semibold uppercase tracking-wide"
                            >
                              {field.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="px-2 py-2 text-left font-semibold text-amber-100">
                            {statsName}
                          </th>
                          {STAT_FIELDS.map((field) => (
                            <td key={field.key as string} className="px-2 py-2 text-center">
                              {renderStatValue(entry.stats?.[field.key])}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    {entry.stats?.type || stats?.troopType ? (
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-amber-200/60">
                        {stats?.type ?? stats?.troopType ?? ""}
                      </p>
                    ) : (
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-amber-200/40">
                        Brak danych o typie jednostki
                      </p>
                    )}
                  </div>
                    {infoItems.length || (equipmentList && equipmentList.length) || (rulesList && rulesList.length) ? (
                      <div className="space-y-3 rounded-lg border border-amber-400/10 bg-slate-900/40 p-3 text-xs">
                        {infoItems.length ? (
                          <dl className="grid gap-2 sm:grid-cols-2">
                            {infoItems.map((item) => (
                              <div key={item.label} className="flex flex-col">
                                <dt className="font-semibold uppercase tracking-wide text-amber-200/70">
                                  {item.label}
                                </dt>
                                <dd className="text-amber-100">{item.value}</dd>
                              </div>
                            ))}
                          </dl>
                        ) : null}
                        {equipmentList && equipmentList.length ? (
                          <div>
                            <h5 className="font-semibold uppercase tracking-wide text-amber-200/70">
                              Equipment
                            </h5>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-amber-100">
                              {equipmentList.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {rulesList && rulesList.length ? (
                          <div>
                            <h5 className="font-semibold uppercase tracking-wide text-amber-200/70">
                              Special Rules
                            </h5>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-amber-100">
                              {rulesList.map((rule) => (
                                <li key={rule}>{rule}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
