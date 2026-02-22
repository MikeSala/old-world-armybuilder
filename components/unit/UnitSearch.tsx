"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as React from "react";

import type { UnitStatProfile, UnitStatLine } from "@/lib/data/domain/units/units-stats";
import { searchUnitStats, type UnitSearchResult } from "@/lib/data/domain/units/units-stats/search";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import { tDataMaybe } from "@/lib/i18n/data";
import {
  isItalianLocale,
  isFrenchLocale,
  isGermanLocale,
  isPolishLocale,
  translateNameForDict,
  translateTextForDict,
} from "@/lib/i18n/translateLocale";
import {
  ROSTER_STAT_FIELDS,
  ROSTER_STAT_TOOLTIP_KEYS,
  renderStatValue,
} from "@/lib/utils/rosterFormatting";
import { normalizeUnitStatKey } from "@/lib/data/domain/units/units-stats";

import { Button } from "../ui/Button";
import { StatTooltipLabel } from "../ui/StatTooltipLabel";

type Props = {
  dict: LocaleDictionary;
  className?: string;
};

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
    const valueKey = ROSTER_STAT_FIELDS.map((field) => String(norm(profile[field.key]))).join("|");
    const dedupeKey = `${label}::${valueKey}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    result.push({ label, profile, index });
  });

  return result;
};

const statsEqual = (
  a: Pick<UnitStatLine, (typeof ROSTER_STAT_FIELDS)[number]["key"]>,
  b: Pick<UnitStatLine, (typeof ROSTER_STAT_FIELDS)[number]["key"]>
) => ROSTER_STAT_FIELDS.every(({ key }) => norm(a[key]) === norm(b[key]));

const UnitStatsTable = ({ dict, unit }: { dict: LocaleDictionary; unit: UnitStatLine }) => {
  const preferPolishName = isPolishLocale(dict) && typeof unit.name_pl === "string";
  const preferGermanName = isGermanLocale(dict) && typeof unit.name_de === "string";
  const preferFrenchName = isFrenchLocale(dict) && typeof unit.name_fr === "string";
  const preferItalianName = isItalianLocale(dict) && typeof unit.name_it === "string";
  const baseLabelRaw =
    preferItalianName && unit.name_it
      ? unit.name_it
      : preferFrenchName && unit.name_fr
        ? unit.name_fr
        : preferGermanName && unit.name_de
          ? unit.name_de
          : preferPolishName && unit.name_pl
            ? unit.name_pl
            : (unit.name ?? unit.unit ?? dict.rosterDetailUnnamedUnit);
  const baseLabel =
    preferPolishName || preferGermanName || preferFrenchName || preferItalianName
      ? baseLabelRaw
      : translateNameForDict(baseLabelRaw, dict);
  const profileRows = extractProfileRows(unit);
  const hasProfileMatchingBase = profileRows.some(
    ({ profile, label }) =>
      statsEqual(profile, unit) || (label && label.trim() === (baseLabelRaw?.trim() ?? ""))
  );
  const displayBaseRow = !hasProfileMatchingBase;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-stone-200 text-xs dark:divide-stone-400/20">
        <thead className="text-stone-500 dark:text-stone-200/70">
          <tr>
            <th className="px-2 py-1 text-left font-semibold uppercase tracking-wide">
              {dict.rosterDetailStatsModelLabel}
            </th>
            {ROSTER_STAT_FIELDS.map((field) => (
              <th
                key={field.key as string}
                className="px-2 py-1 text-center font-semibold uppercase tracking-wide"
              >
                <StatTooltipLabel
                  abbreviation={field.label}
                  label={dict[ROSTER_STAT_TOOLTIP_KEYS[field.key]]}
                  className="inline-flex w-full justify-center"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayBaseRow ? (
            <tr className="text-stone-800 dark:text-stone-100">
              <th className="px-2 py-2 text-left font-semibold">{baseLabel}</th>
              {ROSTER_STAT_FIELDS.map((field) => (
                <td key={`base-${field.key as string}`} className="px-2 py-2 text-center">
                  {renderStatValue(unit[field.key])}
                </td>
              ))}
            </tr>
          ) : null}
          {profileRows.map(({ label, profile, index }) => (
            <tr key={`${label}-${index}`} className="text-stone-800 dark:text-stone-100">
              <th className="px-2 py-2 text-left font-semibold">
                {label && label.startsWith("Profile ")
                  ? dict.rosterDetailProfileFallback.replace(
                      "{index}",
                      label.replace("Profile ", "")
                    )
                  : label
                    ? translateNameForDict(label, dict)
                    : dict.rosterDetailProfileFallback.replace("{index}", String(index + 1))}
              </th>
              {ROSTER_STAT_FIELDS.map((field) => (
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

const UnitSearchResultBody = ({
  dict,
  result,
}: {
  dict: LocaleDictionary;
  result: UnitSearchResult;
}) => {
  const { line } = result;
  const isPolish = isPolishLocale(dict);
  const isGerman = isGermanLocale(dict);
  const isFrench = isFrenchLocale(dict);
  const isItalian = isItalianLocale(dict);
  const equipment =
    isPolish && Array.isArray(line.equipment_pl)
      ? line.equipment_pl
      : isGerman && Array.isArray(line.equipment_de)
        ? line.equipment_de
        : isFrench && Array.isArray(line.equipment_fr)
          ? line.equipment_fr
          : isItalian && Array.isArray(line.equipment_it)
            ? line.equipment_it
            : Array.isArray(line.equipment)
              ? line.equipment
              : [];
  const rules =
    isPolish && Array.isArray(line.specialRules_pl)
      ? line.specialRules_pl
      : isGerman && Array.isArray(line.specialRules_de)
        ? line.specialRules_de
        : isFrench && Array.isArray(line.specialRules_fr)
          ? line.specialRules_fr
          : isItalian && Array.isArray(line.specialRules_it)
            ? line.specialRules_it
            : Array.isArray(line.specialRules)
              ? line.specialRules
              : [];
  const translatedEquipment =
    (isPolish && Array.isArray(line.equipment_pl)) ||
    (isGerman && Array.isArray(line.equipment_de)) ||
    (isFrench && Array.isArray(line.equipment_fr)) ||
    (isItalian && Array.isArray(line.equipment_it))
      ? equipment
      : equipment.map((item) => translateTextForDict(item, dict));
  const translatedRules =
    (isPolish && Array.isArray(line.specialRules_pl)) ||
    (isGerman && Array.isArray(line.specialRules_de)) ||
    (isFrench && Array.isArray(line.specialRules_fr)) ||
    (isItalian && Array.isArray(line.specialRules_it))
      ? rules
      : rules.map((item) => translateTextForDict(item, dict));

  const infoRows: Array<{ label: string; value: string }> = [];

  if (
    line.unitCategory ||
    line.unitCategory_pl ||
    line.unitCategory_de ||
    line.unitCategory_fr ||
    line.unitCategory_it
  ) {
    infoRows.push({
      label: dict.unitSearchUnitCategoryLabel,
      value:
        isPolish && line.unitCategory_pl
          ? line.unitCategory_pl
          : isGerman && line.unitCategory_de
            ? line.unitCategory_de
            : isFrench && line.unitCategory_fr
              ? line.unitCategory_fr
              : isItalian && line.unitCategory_it
                ? line.unitCategory_it
                : line.unitCategory
                  ? translateTextForDict(line.unitCategory, dict)
                  : "",
    });
  }
  if (
    line.troopType ||
    line.troopType_pl ||
    line.troopType_de ||
    line.troopType_fr ||
    line.troopType_it
  ) {
    infoRows.push({
      label: dict.unitSearchTroopTypeLabel,
      value:
        isPolish && line.troopType_pl
          ? line.troopType_pl
          : isGerman && line.troopType_de
            ? line.troopType_de
            : isFrench && line.troopType_fr
              ? line.troopType_fr
              : isItalian && line.troopType_it
                ? line.troopType_it
                : line.troopType
                  ? translateTextForDict(line.troopType, dict)
                  : "",
    });
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
    <div className="space-y-5">
      {infoRows.length ? (
        <dl className="grid gap-2 sm:grid-cols-2">
          {infoRows.map(({ label, value }) => (
            <div key={`${label}-${value}`} className="flex flex-col gap-1">
              <dt className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-200/70">{label}</dt>
              <dd className="text-sm text-stone-800 dark:text-stone-100">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-200/70">
          {dict.unitSearchProfilesHeading}
        </h4>
        <UnitStatsTable dict={dict} unit={line} />
      </div>

      {equipment.length ? (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-200/70">
            {dict.unitSearchEquipmentLabel}
          </h4>
          <p className="mt-1 text-sm text-stone-700 dark:text-stone-100/80">{translatedEquipment.join(", ")}</p>
        </div>
      ) : null}

      {rules.length ? (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-200/70">
            {dict.rosterDetailSpecialRulesLabel}
          </h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-stone-700 dark:text-stone-100/90">
            {translatedRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

const UnitSearchResultAccordionItem = ({
  dict,
  result,
  value,
}: {
  dict: LocaleDictionary;
  result: UnitSearchResult;
  value: string;
}) => {
  const { line, armyNameKey, armyNameFallback } = result;
  const preferPolishName = isPolishLocale(dict) && typeof line.name_pl === "string";
  const preferGermanName = isGermanLocale(dict) && typeof line.name_de === "string";
  const preferFrenchName = isFrenchLocale(dict) && typeof line.name_fr === "string";
  const preferItalianName = isItalianLocale(dict) && typeof line.name_it === "string";
  const titleSource =
    preferItalianName && line.name_it
      ? line.name_it
      : preferFrenchName && line.name_fr
        ? line.name_fr
        : preferGermanName && line.name_de
          ? line.name_de
          : preferPolishName && line.name_pl
            ? line.name_pl
            : (line.name ?? line.unit ?? null);
  const title = titleSource
    ? preferPolishName || preferGermanName || preferFrenchName || preferItalianName
      ? titleSource
      : translateNameForDict(titleSource, dict)
    : dict.rosterDetailUnnamedUnit;
  const armyLabel = tDataMaybe(armyNameKey, dict, armyNameFallback);

  return (
    <Accordion.Item
      value={value}
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-900 shadow shadow-stone-200/60 dark:border-stone-300/30 dark:bg-stone-800/70 dark:text-stone-100 dark:shadow-stone-900/20"
    >
      <Accordion.Header className="w-full">
        <Accordion.Trigger className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left outline-none transition hover:bg-stone-100 data-[state=open]:border-b data-[state=open]:border-stone-200 dark:hover:bg-stone-800/80 dark:data-[state=open]:border-stone-300/20">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
            {armyLabel ? (
              <span className="text-sm text-stone-500 dark:text-stone-200/70">
                {dict.unitSearchArmyLabel}: {armyLabel}
              </span>
            ) : null}
          </div>
          <ChevronDownIcon
            className="h-5 w-5 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180"
            aria-hidden
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-5 pb-5 pt-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <UnitSearchResultBody dict={dict} result={result} />
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default function UnitSearch({ dict, className }: Props) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<UnitSearchResult[]>([]);

  React.useEffect(() => {
    const trimmed = query.trim();
    const timeout = window.setTimeout(() => {
      if (trimmed.length < 2) {
        setResults([]);
        return;
      }
      setResults(searchUnitStats(trimmed));
    }, 180);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

  const resultMessage = React.useMemo(() => {
    if (query.trim().length < 2) return null;
    if (!results.length) return null;
    return dict.unitSearchResultsCount.replace("{count}", String(results.length));
  }, [dict.unitSearchResultsCount, query, results.length]);

  return (
    <section className={className} aria-labelledby="unit-search-heading">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 text-stone-900 shadow-lg shadow-stone-200/60 dark:border-stone-300/30 dark:bg-stone-800/80 dark:text-stone-100 dark:shadow-stone-900/20">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2
              id="unit-search-heading"
              className="text-2xl font-semibold uppercase tracking-[0.25em] text-stone-700 dark:text-stone-300"
            >
              {dict.unitSearchHeading}
            </h2>
            {query ? (
              <Button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-semibold uppercase tracking-wide text-stone-500 hover:text-stone-800 dark:text-stone-200/70 dark:hover:text-stone-100"
              >
                {dict.unitSearchClearButton}
              </Button>
            ) : null}
          </div>
          <label className="flex flex-col gap-2 text-sm" htmlFor="unit-search-input">
            <span className="text-stone-600 dark:text-stone-200/80">{dict.unitSearchInputLabel}</span>
            <input
              id="unit-search-input"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dict.unitSearchPlaceholder}
              className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 shadow-inner outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-300 dark:border-stone-400/30 dark:bg-stone-900/50 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-300 dark:focus:ring-stone-400"
            />
          </label>
          {resultMessage ? <p className="text-xs text-stone-500 dark:text-stone-200/70">{resultMessage}</p> : null}
        </div>

        {results.length > 0 ? (
          <Accordion.Root type="multiple" className="mt-6 space-y-4">
            {results.map((result) => {
              const base = result.line.name ?? result.line.unit ?? "unit";
              const key = `${result.statsArmyId}-${normalizeUnitStatKey(base)}`;
              return (
                <UnitSearchResultAccordionItem key={key} value={key} dict={dict} result={result} />
              );
            })}
          </Accordion.Root>
        ) : query.trim().length >= 2 ? (
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-200/70">{dict.unitSearchNoResults}</p>
        ) : null}
      </div>
    </section>
  );
}
