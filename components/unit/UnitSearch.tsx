"use client";

import * as React from "react";
import { searchUnitStats, type UnitSearchResult } from "@/lib/data/domain/units/units-stats/search";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import {
  type UnitStatProfile,
  type UnitStatLine,
  normalizeUnitStatKey,
} from "@/lib/data/domain/units/units-stats";

type StatFieldKey = "M" | "WS" | "BS" | "S" | "T" | "W" | "I" | "A" | "Ld";

type Props = {
  dict: LocaleDictionary;
  className?: string;
};

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

// Normalize single stat value for robust equality checks
const norm = (v: unknown) => {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") {
    const trimmed = v.trim();
    if (trimmed === "" || trimmed === "—" || trimmed === "-") return null;
    const num = Number(trimmed.replace(",", "."));
    if (!Number.isNaN(num)) return num;
    return trimmed;
  }
  return v;
};

const renderStatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }
  return String(value);
};

const extractProfileRows = (
  line: UnitStatLine
): Array<{ label: string; profile: UnitStatProfile; index: number }> => {
  const profiles = Array.isArray(line.profiles) ? line.profiles : [];
  const seen = new Set<string>();
  const result: Array<{ label: string; profile: UnitStatProfile; index: number }> = [];

  profiles.forEach((profile, index) => {
    if (!profile) return;
    const rawName = typeof profile.name === "string" ? profile.name : undefined;
    const label = rawName && rawName.trim().length > 0 ? rawName : `Profile ${index + 1}`;
    const valueKey = STAT_FIELDS.map((field) => String(norm(profile[field.key]))).join("|");
    const dedupeKey = `${label}::${valueKey}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    result.push({ label, profile, index });
  });

  return result;
};

const statsEqual = (a: Pick<UnitStatLine, StatFieldKey>, b: Pick<UnitStatLine, StatFieldKey>) =>
  STAT_FIELDS.every(({ key }) => norm(a[key]) === norm(b[key]));

const UnitStatsTable = ({ dict, unit }: { dict: LocaleDictionary; unit: UnitStatLine }) => {
  const baseLabel = unit.name ?? unit.unit ?? dict.rosterDetailUnnamedUnit;
  const profileRows = extractProfileRows(unit);
  const hasProfileMatchingBase = profileRows.some(
    ({ profile, label }) =>
      statsEqual(profile, unit) || (label && label.trim() === (baseLabel?.trim() ?? ""))
  );
  const displayBaseRow = !hasProfileMatchingBase;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-amber-400/20 text-xs">
        <thead className="text-amber-200/70">
          <tr>
            <th className="px-2 py-1 text-left font-semibold uppercase tracking-wide">
              {dict.rosterDetailStatsModelLabel}
            </th>
            {STAT_FIELDS.map((field) => (
              <th
                key={field.key as string}
                className="px-2 py-1 text-center font-semibold uppercase tracking-wide"
              >
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayBaseRow ? (
            <tr className="text-amber-100">
              <th className="px-2 py-2 text-left font-semibold">{baseLabel}</th>
              {STAT_FIELDS.map((field) => (
                <td key={`base-${field.key as string}`} className="px-2 py-2 text-center">
                  {renderStatValue(unit[field.key])}
                </td>
              ))}
            </tr>
          ) : null}
          {profileRows.map(({ label, profile, index }) => (
            <tr key={`${label}-${index}`} className="text-amber-100">
              <th className="px-2 py-2 text-left font-semibold">
                {label && label.startsWith("Profile ")
                  ? dict.rosterDetailProfileFallback.replace(
                      "{index}",
                      label.replace("Profile ", "")
                    )
                  : label || dict.rosterDetailProfileFallback.replace("{index}", String(index + 1))}
              </th>
              {STAT_FIELDS.map((field) => (
                <td key={`${label}-${field.key as string}`} className="px-2 py-2 text-center">
                  {renderStatValue(profile[field.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UnitSearchResultCard = ({
  dict,
  result,
}: {
  dict: LocaleDictionary;
  result: UnitSearchResult;
}) => {
  const { line, armyName } = result;
  const equipment = Array.isArray(line.equipment) ? line.equipment : [];
  const rules = Array.isArray(line.specialRules) ? line.specialRules : [];

  const infoRows: Array<{ label: string; value: string }> = [];

  if (line.unitCategory) {
    infoRows.push({ label: dict.unitSearchUnitCategoryLabel, value: line.unitCategory });
  }
  if (line.troopType) {
    infoRows.push({ label: dict.unitSearchTroopTypeLabel, value: line.troopType });
  }
  if (line.baseSize) {
    infoRows.push({ label: dict.rosterDetailSidebarBaseSize, value: String(line.baseSize) });
  }
  if (line.unitSize !== undefined && line.unitSize !== null && line.unitSize !== "") {
    infoRows.push({ label: dict.rosterDetailSidebarUnitSize, value: String(line.unitSize) });
  }
  if (line.armourValue !== undefined && line.armourValue !== null && line.armourValue !== "") {
    infoRows.push({ label: dict.rosterDetailSidebarArmourValue, value: String(line.armourValue) });
  }

  return (
    <article className="space-y-4 rounded-2xl border border-amber-300/30 bg-slate-900/70 p-5 text-amber-100 shadow shadow-amber-900/20">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-amber-100">
            {line.name ?? dict.rosterDetailUnnamedUnit}
          </h3>
          {armyName ? (
            <span className="text-sm text-amber-200/70">
              {dict.unitSearchArmyLabel}: {armyName}
            </span>
          ) : null}
        </div>
        {infoRows.length ? (
          <dl className="grid gap-2 sm:grid-cols-2">
            {infoRows.map(({ label, value }) => (
              <div key={`${label}-${value}`} className="flex flex-col gap-1">
                <dt className="text-xs uppercase tracking-wide text-amber-200/70">{label}</dt>
                <dd className="text-sm text-amber-100">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-200/70">
          {dict.unitSearchProfilesHeading}
        </h4>
        <UnitStatsTable dict={dict} unit={line} />
      </div>

      {equipment.length ? (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-200/70">
            {dict.unitSearchEquipmentLabel}
          </h4>
          <p className="mt-1 text-sm text-amber-100/80">{equipment.join(", ")}</p>
        </div>
      ) : null}

      {rules.length ? (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-200/70">
            {dict.rosterDetailSpecialRulesLabel}
          </h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-amber-100/90">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
};

export default function UnitSearch({ dict, className }: Props) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<UnitSearchResult[]>([]);

  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    setResults(searchUnitStats(trimmed));
  }, [query]);

  const resultMessage = React.useMemo(() => {
    if (query.trim().length < 2) return null;
    if (!results.length) return null;
    return dict.unitSearchResultsCount.replace("{count}", String(results.length));
  }, [dict.unitSearchResultsCount, query, results.length]);

  return (
    <section className={className} aria-labelledby="unit-search-heading">
      <div className="space-y-6 rounded-3xl border border-amber-300/30 bg-slate-900/80 p-6 text-amber-100 shadow-lg shadow-amber-900/20">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2
              id="unit-search-heading"
              className="text-2xl font-semibold uppercase tracking-[0.25em] text-amber-300"
            >
              {dict.unitSearchHeading}
            </h2>
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-semibold uppercase tracking-wide text-amber-200/70 hover:text-amber-100"
              >
                {dict.unitSearchClearButton}
              </button>
            ) : null}
          </div>
          <label className="flex flex-col gap-2 text-sm" htmlFor="unit-search-input">
            <span className="text-amber-200/80">{dict.unitSearchInputLabel}</span>
            <input
              id="unit-search-input"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dict.unitSearchPlaceholder}
              className="rounded-xl border border-amber-400/30 bg-slate-950/50 px-4 py-3 text-base text-amber-100 shadow-inner outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400"
            />
          </label>
          {resultMessage ? <p className="text-xs text-amber-200/70">{resultMessage}</p> : null}
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => {
              const base = result.line.name ?? result.line.unit ?? "unit";
              const key = `${result.statsArmyId}-${normalizeUnitStatKey(base)}`;
              return <UnitSearchResultCard key={key} dict={dict} result={result} />;
            })}
          </div>
        ) : query.trim().length >= 2 ? (
          <p className="text-sm text-amber-200/70">{dict.unitSearchNoResults}</p>
        ) : null}
      </div>
    </section>
  );
}
