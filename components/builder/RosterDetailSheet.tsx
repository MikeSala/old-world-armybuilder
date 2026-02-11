"use client";

import { clsx } from "clsx";
import { X } from "lucide-react";
import * as React from "react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/Button";
import { StatsTable } from "@/components/builder/StatsTable";
import type { OptionLabelByUnitId } from "@/lib/builder/unitHelpers";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { DetailDict } from "@/lib/i18n/dictSubsets";
import {
  ORDERED_CATEGORIES,
  selectRosterDetailView,
  type RosterUnitDetail,
  type RosterUnitOptionSummary,
  type RosterUnitStatRow,
  type RosterUnitMetaRow,
} from "@/lib/store/selectors/rosterDetails";
import {
  formatOptionGroupLabel,
  localizeMetaLabel,
  buildCategoryLabels,
  formatPointsValue,
} from "@/lib/utils/rosterFormatting";
import {
  isItalianLocale,
  isFrenchLocale,
  isGermanLocale,
  isPolishLocale,
  translateNameForDict,
  translateTextForDict,
} from "@/lib/i18n/translateLocale";
import { TAILWIND_CARDS, TAILWIND_TEXT } from "@/lib/styles/tailwindConstants";

type Props = {
  dict: DetailDict;
  unitLabelById?: Map<string, string>;
  optionLabelByUnitId?: OptionLabelByUnitId;
  onClose?: () => void;
  onPrinted?: () => void;
  className?: string;
};

type CategorySectionData = {
  key: CategoryKey;
  title: string;
  total: number;
  units: RosterUnitDetail[];
};

type CategorySectionProps = {
  dict: DetailDict;
  formatPoints: (value: number | string) => string;
  category: CategorySectionData;
  unitLabelById?: Map<string, string>;
  optionLabelByUnitId?: OptionLabelByUnitId;
};

type RosterDetailHeaderProps = {
  dict: DetailDict;
  formatPoints: (value: number | string) => string;
  name: string;
  description: string;
  pointsLimit: number;
  totalPoints: number;
  statsAvailable: boolean;
  onPrint: () => void;
  onClose?: () => void;
};

type UnitDetailCardProps = {
  dict: DetailDict;
  formatPoints: (value: number | string) => string;
  unit: RosterUnitDetail;
  unitLabelById?: Map<string, string>;
  optionLabelByUnitId?: OptionLabelByUnitId;
};

type OptionSummaryListProps = {
  summaries: RosterUnitOptionSummary[];
  dict: DetailDict;
  formatPoints: (value: number | string) => string;
  unitId: string;
  optionLabelByUnitId?: OptionLabelByUnitId;
};

type SidebarPanelProps = {
  rules: string[];
  meta: RosterUnitMetaRow[];
  dict: DetailDict;
  translateRules?: boolean;
};


const formatUnitSummary = (
  unit: RosterUnitDetail,
  dict: DetailDict,
  formatPoints: (value: number | string) => string
) => {
  const parts: string[] = [];
  parts.push(dict.rosterSummaryBaseCost.replace("{value}", formatPoints(unit.basePoints)));
  if (unit.unitSize > 1) {
    const modelsLine = dict.rosterDetailModelsLine
      .replace("{count}", String(unit.unitSize))
      .replace("{value}", formatPoints(unit.pointsPerModel));
    parts.push(modelsLine);
  }
  return parts.join(" · ");
};


export default function RosterDetailSheet({
  dict,
  unitLabelById,
  optionLabelByUnitId,
  onClose,
  onPrinted,
  className,
}: Props) {
  const handlePrint = React.useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
      onPrinted?.();
    }
  }, [onPrinted]);

  const detailView = useSelector(selectRosterDetailView);
  const hasEntries = detailView.entries.length > 0;

  const formatPoints = (value: number | string) => formatPointsValue(value, dict);

  const categoryTitles: Record<CategoryKey, string> = buildCategoryLabels(dict);

  const categories: CategorySectionData[] = ORDERED_CATEGORIES.map((category) => {
    const units = detailView.entryDetailsByCategory[category] ?? [];
    if (!units.length) return null;
    return {
      key: category,
      title: categoryTitles[category],
      total: detailView.totalsByCategory[category] ?? 0,
      units,
    };
  }).filter((section): section is CategorySectionData => section !== null);

  return (
    <div
      className={clsx(
        "print-roster-sheet relative flex max-h-[90vh] w-full max-w-5xl flex-col gap-6 overflow-y-auto rounded-3xl border border-stone-400/20 bg-stone-900/95 p-6 text-stone-100 shadow-2xl shadow-stone-900/30 print:max-h-none print:max-w-none print:w-full print:rounded-none print:border print:border-gray-300 print:bg-white print:p-6 print:text-black print:shadow-none print:text-sm",
        className
      )}
      aria-labelledby="roster-detail-sheet-heading"
    >
      <RosterDetailHeader
        dict={dict}
        formatPoints={formatPoints}
        name={detailView.name}
        description={detailView.description}
        pointsLimit={detailView.pointsLimit}
        totalPoints={detailView.totalPoints}
        statsAvailable={detailView.statsAvailable}
        onPrint={handlePrint}
        onClose={onClose}
      />

      {!hasEntries ? (
        <p className="text-sm text-stone-200/70">{dict.rosterDetailEmptyMessage}</p>
      ) : (
        categories.map((category) => (
          <CategorySection
            key={category.key}
            dict={dict}
            formatPoints={formatPoints}
            category={category}
            unitLabelById={unitLabelById}
            optionLabelByUnitId={optionLabelByUnitId}
          />
        ))
      )}
    </div>
  );
}

function RosterDetailHeader({
  dict,
  formatPoints,
  name,
  description,
  pointsLimit,
  totalPoints,
  statsAvailable,
  onPrint,
  onClose,
}: RosterDetailHeaderProps) {
  const safeName = name && name.trim().length > 0 ? name : dict.rosterSummaryDefaultName;

  return (
    <header className="flex flex-col gap-2 print:gap-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-300 print:text-gray-700 print:text-[11px]">
            {dict.rosterDetailHeading}
          </p>
          <h2
            id="roster-detail-sheet-heading"
            className="text-2xl font-semibold print:text-gray-900 print:text-xl"
          >
            {safeName}
          </h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-stone-200/80 print:text-gray-700 print:text-xs">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <Button variant="accent" size="sm" onClick={onPrint}>
            {dict.rosterPrintButton}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 rounded-full p-0 text-stone-200 hover:bg-stone-500/20"
            aria-label={dict.rosterDetailCloseAria}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-stone-200/70 print:text-gray-600 print:text-[11px]">
        <span>
          {dict.rosterPointsLimitLabel}:{" "}
          <strong className="text-stone-100 print:text-gray-900">
            {formatPoints(pointsLimit)}
          </strong>
        </span>
        <span>
          {dict.rosterTotalSpentLabel}:{" "}
          <strong className="text-stone-100 print:text-gray-900">
            {formatPoints(totalPoints)}
          </strong>
        </span>
      </div>
      {!statsAvailable ? (
        <p className="rounded-lg border border-stone-500/40 bg-stone-500/10 p-3 text-sm text-stone-200 print:border-gray-300 print:bg-gray-100 print:text-gray-700 print:text-xs print:p-2">
          {dict.rosterDetailStatsMissing}
        </p>
      ) : null}
    </header>
  );
}

function CategorySection({
  dict,
  formatPoints,
  category,
  unitLabelById,
  optionLabelByUnitId,
}: CategorySectionProps) {
  const unitCount =
    category.units.length === 1
      ? dict.rosterDetailUnitCountSingle
      : dict.rosterDetailUnitCountPlural;
  const unitCountLabel = unitCount.replace("{count}", String(category.units.length));
  const totalPointsLabel = formatPoints(category.total);

  return (
    <section
      aria-labelledby={`roster-category-${category.key}`}
      className="space-y-4 rounded-2xl border border-stone-300/20 bg-stone-800/70 p-5 print:space-y-3 print:border-gray-300 print:bg-white print:p-4 print-avoid-break"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 print:gap-2">
        <h3
          id={`roster-category-${category.key}`}
          className="text-lg font-semibold text-stone-200 print:text-gray-900 print:text-base"
        >
          {category.title}{" "}
          <span className="text-sm text-stone-200/60 print:text-gray-600 print:text-xs">
            [{totalPointsLabel}]
          </span>
        </h3>
        <span className="text-sm text-stone-200/70 print:text-gray-600 print:text-xs">
          {unitCountLabel}
        </span>
      </div>
      <div className="space-y-4 print:space-y-3">
        {category.units.map((unit) => (
          <UnitDetailCard
            key={unit.id}
            dict={dict}
            formatPoints={formatPoints}
            unit={unit}
            unitLabelById={unitLabelById}
            optionLabelByUnitId={optionLabelByUnitId}
          />
        ))}
      </div>
    </section>
  );
}

function UnitDetailCard({
  dict,
  formatPoints,
  unit,
  unitLabelById,
  optionLabelByUnitId,
}: UnitDetailCardProps) {
  const ownedText = unit.owned ? dict.rosterDetailOwnedYes : dict.rosterDetailOwnedNo;
  const unitLabel = unitLabelById?.get(unit.unitId);
  const unitName =
    unitLabel ??
    (unit.name && unit.name.trim().length > 0
      ? translateNameForDict(unit.name, dict)
      : dict.rosterDetailUnnamedUnit);
  const isPolish = isPolishLocale(dict);
  const isGerman = isGermanLocale(dict);
  const isFrench = isFrenchLocale(dict);
  const isItalian = isItalianLocale(dict);
  const unitRole =
    isPolish && unit.unitRolePl
      ? unit.unitRolePl
      : isGerman && unit.unitRoleDe
        ? unit.unitRoleDe
        : isFrench && unit.unitRoleFr
          ? unit.unitRoleFr
          : isItalian && unit.unitRoleIt
            ? unit.unitRoleIt
          : unit.unitRole
            ? translateTextForDict(unit.unitRole, dict)
            : null;
  const unitNotes = unit.notes ? translateTextForDict(unit.notes, dict) : null;
  const usePolishRules = isPolish && unit.sidebarRulesPl?.length;
  const useGermanRules = isGerman && unit.sidebarRulesDe?.length;
  const useFrenchRules = isFrench && unit.sidebarRulesFr?.length;
  const useItalianRules = isItalian && unit.sidebarRulesIt?.length;
  const rules = usePolishRules
    ? unit.sidebarRulesPl ?? []
    : useGermanRules
      ? unit.sidebarRulesDe ?? []
      : useFrenchRules
        ? unit.sidebarRulesFr ?? []
        : useItalianRules
          ? unit.sidebarRulesIt ?? []
        : unit.sidebarRules;

  return (
    <article className={`space-y-3 ${TAILWIND_CARDS.DETAIL_CARD} print:space-y-2 print:border-gray-300 print:bg-white print:p-3 print:shadow-none print-avoid-break`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between print:gap-2 print:flex-row print:justify-between">
        <div>
          <h4 className="text-base font-semibold text-stone-100 print:text-gray-900 print:text-sm">
            {unitName}{" "}
            <span className="text-sm font-normal text-stone-200/70 print:text-gray-600 print:text-xs">
              [{formatPoints(unit.totalPoints)}]
            </span>
          </h4>
          {unitRole ? (
            <p className="text-xs uppercase tracking-[0.2em] text-stone-200/60 print:text-gray-500 print:text-[11px]">
              {unitRole}
            </p>
          ) : null}
          <p className="text-xs text-stone-200/70 print:text-gray-600 print:text-[11px]">
            {formatUnitSummary(unit, dict, formatPoints)}
          </p>
          {unitNotes ? (
            <p className="mt-1 text-xs text-stone-200/60 print:text-gray-500 print:text-[11px]">
              {unitNotes}
            </p>
          ) : null}
        </div>
        <div className={`${TAILWIND_TEXT.MUTED} text-right`}>
          <span>
            {dict.rosterDetailOwnedLabel}: {ownedText}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-6 print:grid print:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] print:gap-4">
        <div className="space-y-4 print:space-y-2">
          <OptionSummaryList
            dict={dict}
            formatPoints={formatPoints}
            summaries={unit.optionSummaries}
            unitId={unit.unitId}
            optionLabelByUnitId={optionLabelByUnitId}
          />
          <StatsTable dict={dict} rows={unit.statRows} />
        </div>
        <SidebarPanel
          dict={dict}
          rules={rules}
          meta={unit.sidebarMeta}
          translateRules={!usePolishRules && !useGermanRules && !useFrenchRules && !useItalianRules}
        />
      </div>
    </article>
  );
}

function OptionSummaryList({
  summaries,
  dict,
  formatPoints,
  unitId,
  optionLabelByUnitId,
}: OptionSummaryListProps) {
  if (!summaries.length) return null;
  const optionMap = optionLabelByUnitId?.get(unitId);
  return (
    <div className="grid gap-x-3 gap-y-1 text-xs text-stone-200/80 print:text-gray-600 print:text-[11px] sm:grid-cols-[max-content_minmax(0,1fr)_max-content]">
      {summaries.map((summary, idx) => (
        <React.Fragment key={`${summary.group ?? "default"}-${idx}`}>
          <span className="font-semibold text-stone-200/70 print:text-gray-900">
            {formatOptionGroupLabel(summary.group ?? "", dict)}
          </span>
          <span className="text-stone-200/70 print:text-gray-900">
            {summary.items
              .map((item) => {
                const optionInfo = item.id ? optionMap?.get(item.id) : null;
                return optionInfo?.label ?? translateTextForDict(item.name, dict);
              })
              .join(", ")}
          </span>
          <span className="text-right text-stone-200/70 print:text-gray-600">
            {summary.cost ? formatPoints(summary.cost) : dict.categoryOptionCostFree}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function SidebarPanel({ rules, meta, dict, translateRules = true }: SidebarPanelProps) {
  const hasContent = rules.length > 0 || meta.length > 0;
  if (!hasContent) return null;

  return (
    <aside className="space-y-3 rounded-lg border border-stone-400/10 bg-stone-800/40 p-3 text-xs print:space-y-2 print:border-gray-300 print:bg-white print:text-[11px]">
      {rules.length ? (
        <div>
          <h5 className="font-semibold uppercase tracking-wide text-stone-200/70 print:text-gray-600 print:text-xs">
            {dict.rosterDetailSpecialRulesLabel}
          </h5>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-stone-100 print:text-gray-900 print:space-y-0.5">
            {rules.map((rule) => (
              <li key={rule} className="print:text-xs">
                {translateRules ? translateTextForDict(rule, dict) : rule}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {meta.length ? (
        <dl className="grid gap-2 sm:grid-cols-2">
          {meta.map((item) => (
            <div key={`${item.label}-${item.value}`} className="flex flex-col gap-0.5">
              <dt className="font-semibold uppercase tracking-wide text-stone-200/70 print:text-gray-600 print:text-xs">
                {localizeMetaLabel(item.label, dict)}
              </dt>
              <dd className="text-stone-100 print:text-gray-900 print:text-xs">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </aside>
  );
}
