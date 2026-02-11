"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";
import { StatsTable } from "@/components/builder/StatsTable";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import type { OptionLabelByUnitId } from "@/lib/builder/unitHelpers";
import {
  formatOptionGroupLabel,
  localizeMetaLabel,
} from "@/lib/utils/rosterFormatting";
import { TAILWIND_TEXT } from "@/lib/styles/tailwindConstants";
import type { RosterEntry } from "@/lib/roster/normalizeEntry";
import type { RosterUnitDetail } from "@/lib/store/selectors/rosterDetails";
import {
  isItalianLocale,
  isFrenchLocale,
  isGermanLocale,
  isPolishLocale,
  translateNameForDict,
  translateTextForDict,
} from "@/lib/i18n/translateLocale";

type Dict = LocaleDictionary;

type GroupedEntries = Partial<Record<CategoryKey, RosterEntry[]>>;

type Props = {
  dict: Dict;
  groupedEntries: GroupedEntries;
  categoryLabels: Record<CategoryKey, string>;
  detailByEntryId: Map<string, RosterUnitDetail>;
  expandedEntryIds: string[];
  unitLabelById?: Map<string, string>;
  optionLabelByUnitId?: OptionLabelByUnitId;
  onToggleDetails: (id: string) => void;
  onRemoveEntry: (id: string) => void;
  onToggleOwned: (id: string, owned: boolean) => void;
  formatPointsFor: (value: number | string) => string;
};

const fallbackCategoryLabel = (category: string): string =>
  category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatOptionCost = (
  opt: RosterEntry["options"][number],
  dict: Dict,
  formatPointsFor: (value: number | string) => string
) => {
  if (!opt.points) return dict.categoryOptionCostFree;
  const baseCostSuffix =
    opt.perModel && typeof opt.baseCost === "number"
      ? ` (${formatPointsFor(opt.baseCost)}${dict.categoryOptionCostPerModelSuffix})`
      : "";
  return `${formatPointsFor(opt.points)}${baseCostSuffix}`;
};

export function RosterSummaryList({
  dict,
  groupedEntries,
  categoryLabels,
  detailByEntryId,
  expandedEntryIds,
  unitLabelById,
  optionLabelByUnitId,
  onToggleDetails,
  onRemoveEntry,
  onToggleOwned,
  formatPointsFor,
}: Props) {
  const groups = React.useMemo(
    () => Object.entries(groupedEntries) as Array<[CategoryKey, RosterEntry[]]>,
    [groupedEntries]
  );

  if (groups.length === 0) {
    return (
      <p className={TAILWIND_TEXT.EMPTY_STATE}>
        {dict.rosterSummaryEmptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-5 text-sm print:space-y-4">
      {groups.map(([category, items]) => {
        const categoryLabel = categoryLabels[category] ?? fallbackCategoryLabel(category);
        const categoryPoints = formatPointsFor(items.reduce((sum, entry) => sum + entry.totalPoints, 0));

        return (
          <li
            key={category}
            className="rounded-xl bg-stone-700/60 p-4 print:break-inside-avoid print:border print:border-gray-300 print:bg-white print:shadow-none"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-stone-200 print:text-gray-900">
                {categoryLabel}
              </span>
              <span className="text-stone-200/70 print:text-gray-800">{categoryPoints}</span>
            </div>
            <ul className="space-y-2 text-stone-100/90 print:text-gray-900">
              {items.map((entry) => {
                const entryName =
                  unitLabelById?.get(entry.unitId) ?? translateNameForDict(entry.name, dict);
                const detail = detailByEntryId.get(entry.id);
                const optionMap = optionLabelByUnitId?.get(entry.unitId);
                const isExpanded = expandedEntryIds.includes(entry.id);
                const statsRows = detail?.statRows ?? [];
                const isPolish = isPolishLocale(dict);
                const isGerman = isGermanLocale(dict);
                const isFrench = isFrenchLocale(dict);
                const isItalian = isItalianLocale(dict);
                const usePolishRules = isPolish && detail?.sidebarRulesPl?.length;
                const useGermanRules = isGerman && detail?.sidebarRulesDe?.length;
                const useFrenchRules = isFrench && detail?.sidebarRulesFr?.length;
                const useItalianRules = isItalian && detail?.sidebarRulesIt?.length;
                const specialRules = usePolishRules
                  ? detail?.sidebarRulesPl ?? []
                  : useGermanRules
                    ? detail?.sidebarRulesDe ?? []
                    : useFrenchRules
                      ? detail?.sidebarRulesFr ?? []
                      : useItalianRules
                        ? detail?.sidebarRulesIt ?? []
                      : detail?.sidebarRules ?? [];
                const translatedRules =
                  usePolishRules || useGermanRules || useFrenchRules || useItalianRules
                  ? specialRules
                  : specialRules.map((rule) => translateTextForDict(rule, dict));
                const metaEntries = detail
                  ? detail.sidebarMeta.map((item) => ({
                      label: localizeMetaLabel(item.label, dict),
                      value: item.value,
                    }))
                  : [];
                const filteredMeta = metaEntries.filter(
                  (item) => item.value && String(item.value).trim().length > 0
                );
                const detailsLabel = isExpanded
                  ? dict.rosterSummaryHideDetails
                  : dict.rosterSummaryShowDetails;

                const baseCostText = dict.rosterSummaryBaseCost.replace(
                  "{value}",
                  formatPointsFor(entry.basePoints)
                );
                const unitSizeDetail =
                  entry.unitSize > 1
                    ? dict.categoryEntryMultipleModels.replace("{count}", String(entry.unitSize)) +
                      " @ " +
                      dict.categoryEntryPointsPerModel.replace("{value}", String(entry.pointsPerModel))
                    : null;
                const entryPointsLabel = formatPointsFor(entry.totalPoints);
                const ownedStatusLabel = entry.owned
                  ? dict.rosterExportOwnedYes
                  : dict.rosterExportOwnedNo;

                return (
                  <li
                    key={entry.id}
                    className="rounded-lg bg-stone-800/60 px-3 py-2 print:break-inside-avoid print:border print:border-gray-300 print:bg-white print:shadow-none"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between print:gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-stone-100 print:text-gray-900">
                          {entry.unitSize} {entryName}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:ml-auto print:gap-2">
                        <span className="text-stone-200/80 print:font-semibold print:text-gray-900">
                          {entryPointsLabel}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onRemoveEntry(entry.id)}
                          aria-label={dict.rosterSummaryRemoveAria.replace("{unit}", entryName)}
                          className="print:hidden"
                        >
                          {dict.rosterSummaryRemoveButton}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onToggleDetails(entry.id)}
                          aria-expanded={isExpanded}
                          className="print:hidden text-xs uppercase tracking-wide text-stone-300 hover:text-stone-100"
                        >
                          {detailsLabel}
                        </Button>
                        <label className="flex flex-row-reverse items-center gap-2 text-xs text-stone-100 print:hidden md:ml-auto">
                          <input
                            type="checkbox"
                            checked={entry.owned}
                            onChange={(event) => onToggleOwned(entry.id, event.target.checked)}
                            className="h-4 w-4 rounded border-stone-100 bg-stone-800 text-stone-500 focus:ring-stone-400"
                          />
                          <span>{dict.rosterSummaryOwnedLabel}</span>
                        </label>
                        <span className="hidden text-xs text-gray-700 print:inline">
                          {dict.rosterSummaryOwnedLabel}: {ownedStatusLabel}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 text-xs text-stone-200/70 print:font-medium print:text-gray-700">
                      {baseCostText}
                      {unitSizeDetail ? ` · ${unitSizeDetail}` : ""}
                    </div>
                    {isExpanded ? (
                      detail ? (
                        <div className="mt-3 space-y-3 rounded-lg border border-stone-400/20 bg-stone-900/60 p-3 text-xs text-stone-200/70 print:break-inside-avoid print:border-gray-300 print:bg-gray-100">
                          {statsRows.length ? (
                            <StatsTable rows={statsRows} dict={dict} />
                          ) : (
                            <p className="text-stone-200/70 print:text-gray-700">
                              {dict.rosterDetailStatsMissing}
                            </p>
                          )}

                          {specialRules.length || filteredMeta.length ? (
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                              {specialRules.length ? (
                                <div className="flex-1 space-y-1">
                                  <h5 className="font-semibold uppercase tracking-wide text-stone-200/70 print:text-gray-700">
                                    {dict.rosterDetailSpecialRulesLabel}
                                  </h5>
                                  <p className="text-stone-100 print:text-gray-900">
                                    {translatedRules.join(", ")}
                                  </p>
                                </div>
                              ) : null}
                              {filteredMeta.length ? (
                                <dl className="flex flex-1 flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
                                  {filteredMeta.map((meta) => (
                                    <div
                                      key={`${meta.label}-${meta.value}`}
                                      className="flex flex-col gap-0.5"
                                    >
                                      <dt className="font-semibold uppercase tracking-wide text-stone-200/70 print:text-gray-700">
                                        {meta.label}
                                      </dt>
                                      <dd className="text-stone-100 print:text-gray-900">
                                        {meta.value}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="mt-3 rounded-lg border border-stone-200/20 bg-stone-800/40 p-3 text-xs text-stone-200/70 print:border-gray-300 print:bg-gray-100 print:text-gray-700">
                          {dict.rosterDetailStatsMissing}
                        </div>
                      )
                    ) : null}
                    {entry.options.length ? (
                      <ul className="mt-2 space-y-1 text-xs text-stone-200/70 print:text-gray-700">
                        {entry.options.map((opt) => {
                          const optionCost = formatOptionCost(opt, dict, formatPointsFor);
                          const optionInfo = opt.sourceId ? optionMap?.get(opt.sourceId) : null;
                          const groupSource =
                            opt.group && opt.group.trim().length > 0
                              ? opt.group
                              : optionInfo?.groupKey ?? "";
                          const optionGroupLabel = formatOptionGroupLabel(groupSource, dict);
                          const optionName = optionInfo?.label ?? translateTextForDict(opt.name, dict);
                          const optionNote = optionInfo?.note ?? (opt.note
                            ? translateTextForDict(opt.note, dict)
                            : undefined);
                          return (
                            <li
                              key={opt.id}
                              className="flex items-center justify-between gap-3 print:break-inside-avoid print:grid print:grid-cols-[minmax(0,1fr)_auto] print:gap-2"
                            >
                              <span className="print:text-gray-900">
                                <span className="font-medium text-stone-200/70 print:text-gray-900">
                                  {optionGroupLabel}
                                </span>{" "}
                                <span className=" text-stone-100 print:text-gray-900">{optionName}</span>
                                {optionNote ? (
                                  <span className="text-stone-200/70 print:text-gray-900">
                                    {" "}
                                    — {optionNote}
                                  </span>
                                ) : null}
                              </span>
                              <span className="text-stone-100 print:text-gray-900">{optionCost}</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
