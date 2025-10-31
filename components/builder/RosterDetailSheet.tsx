"use client";

import * as React from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  ORDERED_CATEGORIES,
  selectRosterDetailView,
  type RosterUnitDetail,
  type RosterUnitOptionSummary,
  type RosterUnitStatRow,
  type RosterUnitMetaRow,
} from "@/lib/store/selectors/rosterDetails";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";

type DetailDict = Pick<
  LocaleDictionary,
  | "rosterSummaryDefaultName"
  | "rosterDetailHeading"
  | "rosterDetailEmptyMessage"
  | "rosterPrintButton"
  | "rosterDetailCloseAria"
  | "rosterPointsLimitLabel"
  | "rosterTotalSpentLabel"
  | "rosterDetailStatsMissing"
  | "categoryPointsValue"
  | "categoryCharactersLabel"
  | "categoryCoreLabel"
  | "categorySpecialLabel"
  | "categoryRareLabel"
  | "categoryMercsLabel"
  | "categoryAlliesLabel"
  | "rosterDetailUnitCountSingle"
  | "rosterDetailUnitCountPlural"
  | "rosterDetailModelsLine"
  | "rosterSummaryBaseCost"
  | "rosterDetailOwnedLabel"
  | "rosterDetailOwnedYes"
  | "rosterDetailOwnedNo"
  | "rosterDetailUnnamedUnit"
  | "categoryOptionCostFree"
  | "categoryOptionsDefaultLabel"
  | "categoryOptionCostPerModelSuffix"
  | "rosterDetailStatsModelLabel"
  | "rosterDetailSpecialRulesLabel"
  | "rosterDetailProfileFallback"
  | "rosterDetailMountLabel"
  | "rosterDetailSidebarUnitSize"
  | "rosterDetailSidebarBaseSize"
  | "rosterDetailSidebarArmourValue"
  | "rosterDetailSidebarMountUnitSize"
  | "rosterDetailSidebarMountBaseSize"
  | "rosterDetailSidebarMountArmourValue"
>;

type Props = {
  dict: DetailDict;
  onClose?: () => void;
  onPrinted?: () => void;
  autoPrint?: boolean;
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
};

type StatsTableProps = {
  rows: RosterUnitStatRow[];
  dict: DetailDict;
};

type OptionSummaryListProps = {
  summaries: RosterUnitOptionSummary[];
  dict: DetailDict;
  formatPoints: (value: number | string) => string;
};

type SidebarPanelProps = {
  rules: string[];
  meta: RosterUnitMetaRow[];
  dict: DetailDict;
};

const STAT_FIELDS = [
  { key: "M", label: "M" },
  { key: "WS", label: "WS" },
  { key: "BS", label: "BS" },
  { key: "S", label: "S" },
  { key: "T", label: "T" },
  { key: "W", label: "W" },
  { key: "I", label: "I" },
  { key: "A", label: "A" },
  { key: "Ld", label: "Ld" },
] as const;
type StatFieldKey = (typeof STAT_FIELDS)[number]["key"];

const MUTED_TEXT = "text-xs text-amber-200/70 print:text-gray-600 print:text-[11px]";

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

const renderStatValue = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : value.toFixed(1);
  }
  return value;
};

export default function RosterDetailSheet({
  dict,
  onClose,
  onPrinted,
  autoPrint,
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

  const formatPoints = React.useCallback(
    (value: number | string) => dict.categoryPointsValue.replace("{value}", String(value)),
    [dict.categoryPointsValue]
  );

  const categoryTitles: Record<CategoryKey, string> = React.useMemo(
    () => ({
      characters: dict.categoryCharactersLabel,
      core: dict.categoryCoreLabel,
      special: dict.categorySpecialLabel,
      rare: dict.categoryRareLabel,
      mercenaries: dict.categoryMercsLabel,
      allies: dict.categoryAlliesLabel,
    }),
    [
      dict.categoryCharactersLabel,
      dict.categoryCoreLabel,
      dict.categorySpecialLabel,
      dict.categoryRareLabel,
      dict.categoryMercsLabel,
      dict.categoryAlliesLabel,
    ]
  );

  React.useEffect(() => {
    if (!autoPrint) return;
    const id = window.setTimeout(handlePrint, 50);
    return () => window.clearTimeout(id);
  }, [autoPrint, handlePrint]);

  const categories = React.useMemo<CategorySectionData[]>(() => {
    return ORDERED_CATEGORIES.map((category) => {
      const units = detailView.entryDetailsByCategory[category] ?? [];
      if (!units.length) return null;
      return {
        key: category,
        title: categoryTitles[category],
        total: detailView.totalsByCategory[category] ?? 0,
        units,
      };
    }).filter((section): section is CategorySectionData => section !== null);
  }, [detailView.entryDetailsByCategory, detailView.totalsByCategory, categoryTitles]);

  return (
    <div
      className={clsx(
        "print-roster-sheet relative flex max-h-[90vh] w-full max-w-5xl flex-col gap-6 overflow-y-auto rounded-3xl border border-amber-400/20 bg-slate-950/95 p-6 text-amber-100 shadow-2xl shadow-amber-900/30 print:max-h-none print:max-w-none print:w-full print:rounded-none print:border print:border-gray-300 print:bg-white print:p-6 print:text-black print:shadow-none print:text-sm",
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
        <p className="text-sm text-amber-200/70">{dict.rosterDetailEmptyMessage}</p>
      ) : (
        categories.map((category) => (
          <CategorySection
            key={category.key}
            dict={dict}
            formatPoints={formatPoints}
            category={category}
          />
        ))
      )}
    </div>
  );
}

const RosterDetailHeader = React.memo(function RosterDetailHeader({
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
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300 print:text-gray-700 print:text-[11px]">
            {dict.rosterDetailHeading}
          </p>
          <h2
            id="roster-detail-sheet-heading"
            className="text-2xl font-semibold print:text-gray-900 print:text-xl"
          >
            {safeName}
          </h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-amber-200/80 print:text-gray-700 print:text-xs">
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
            className="h-9 w-9 rounded-full p-0 text-amber-200 hover:bg-amber-500/20"
            aria-label={dict.rosterDetailCloseAria}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-amber-200/70 print:text-gray-600 print:text-[11px]">
        <span>
          {dict.rosterPointsLimitLabel}:{" "}
          <strong className="text-amber-100 print:text-gray-900">
            {formatPoints(pointsLimit)}
          </strong>
        </span>
        <span>
          {dict.rosterTotalSpentLabel}:{" "}
          <strong className="text-amber-100 print:text-gray-900">
            {formatPoints(totalPoints)}
          </strong>
        </span>
      </div>
      {!statsAvailable ? (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200 print:border-gray-300 print:bg-gray-100 print:text-gray-700 print:text-xs print:p-2">
          {dict.rosterDetailStatsMissing}
        </p>
      ) : null}
    </header>
  );
});

const CategorySection = React.memo(function CategorySection({
  dict,
  formatPoints,
  category,
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
      className="space-y-4 rounded-2xl border border-amber-300/20 bg-slate-900/70 p-5 print:space-y-3 print:border-gray-300 print:bg-white print:p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 print:gap-2">
        <h3
          id={`roster-category-${category.key}`}
          className="text-lg font-semibold text-amber-200 print:text-gray-900 print:text-base"
        >
          {category.title}{" "}
          <span className="text-sm text-amber-200/60 print:text-gray-600 print:text-xs">
            [{totalPointsLabel}]
          </span>
        </h3>
        <span className="text-sm text-amber-200/70 print:text-gray-600 print:text-xs">
          {unitCountLabel}
        </span>
      </div>
      <div className="space-y-4 print:space-y-3">
        {category.units.map((unit) => (
          <UnitDetailCard key={unit.id} dict={dict} formatPoints={formatPoints} unit={unit} />
        ))}
      </div>
    </section>
  );
});

const UnitDetailCard = React.memo(function UnitDetailCard({
  dict,
  formatPoints,
  unit,
}: UnitDetailCardProps) {
  const ownedText = unit.owned ? dict.rosterDetailOwnedYes : dict.rosterDetailOwnedNo;
  const unitName =
    unit.name && unit.name.trim().length > 0 ? unit.name : dict.rosterDetailUnnamedUnit;

  return (
    <article className="space-y-3 rounded-xl border border-amber-400/10 bg-slate-950/60 p-4 shadow shadow-amber-900/10 print:space-y-2 print:border-gray-300 print:bg-white print:p-3 print:shadow-none">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between print:gap-2 print:flex-row print:justify-between">
        <div>
          <h4 className="text-base font-semibold text-amber-100 print:text-gray-900 print:text-sm">
            {unitName}{" "}
            <span className="text-sm font-normal text-amber-200/70 print:text-gray-600 print:text-xs">
              [{formatPoints(unit.totalPoints)}]
            </span>
          </h4>
          {unit.unitRole ? (
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/60 print:text-gray-500 print:text-[11px]">
              {unit.unitRole}
            </p>
          ) : null}
          <p className="text-xs text-amber-200/70 print:text-gray-600 print:text-[11px]">
            {formatUnitSummary(unit, dict, formatPoints)}
          </p>
          {unit.notes ? (
            <p className="mt-1 text-xs text-amber-200/60 print:text-gray-500 print:text-[11px]">
              {unit.notes}
            </p>
          ) : null}
        </div>
        <div className={`${MUTED_TEXT} text-right`}>
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
          />
          <StatsTable dict={dict} rows={unit.statRows} />
        </div>
        <SidebarPanel dict={dict} rules={unit.sidebarRules} meta={unit.sidebarMeta} />
      </div>
    </article>
  );
});

const OptionSummaryList = React.memo(function OptionSummaryList({
  summaries,
  dict,
  formatPoints,
}: OptionSummaryListProps) {
  if (!summaries.length) return null;
  return (
    <div className="grid gap-x-3 gap-y-1 text-xs text-amber-200/80 print:text-gray-600 print:text-[11px] sm:grid-cols-[max-content_minmax(0,1fr)_max-content]">
      {summaries.map((summary, idx) => (
        <React.Fragment key={`${summary.group ?? "default"}-${idx}`}>
          <span className="font-semibold text-amber-100 print:text-gray-900">
            {(() => {
              const normalized = summary.group?.trim() ?? "";
              const isDefault = normalized.length === 0 || normalized.toLowerCase() === "options";
              const label = isDefault ? dict.categoryOptionsDefaultLabel : normalized;
              return `${label}:`;
            })()}
          </span>
          <span className="text-amber-100 print:text-gray-900">{summary.items.join(", ")}</span>
          <span className="text-right text-amber-200/70 print:text-gray-600">
            {summary.cost ? formatPoints(summary.cost) : dict.categoryOptionCostFree}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
});

const StatsTable = React.memo(function StatsTable({ rows, dict }: StatsTableProps) {
  const localizeLabel = React.useCallback(
    (label: string) => {
      const profileMatch = label.match(/^Profile (\d+)$/);
      if (profileMatch) {
        return dict.rosterDetailProfileFallback.replace("{index}", profileMatch[1]);
      }
      return label;
    },
    [dict.rosterDetailProfileFallback]
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-amber-400/20 text-xs print:divide-gray-300 print:text-[11px]">
        <thead className="text-amber-200/70 print:text-gray-600">
          <tr>
            <th className="px-2 py-1 text-left font-semibold uppercase tracking-wide print:text-gray-900 print:text-xs">
              {dict.rosterDetailStatsModelLabel}
            </th>
            {STAT_FIELDS.map((field) => (
              <th
                key={field.key}
                className="px-2 py-1 text-center font-semibold uppercase tracking-wide print:text-gray-900 print:text-xs"
              >
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="text-amber-100 print:text-gray-900">
              <th className="px-2 py-2 text-left font-semibold print:text-xs">
                {localizeLabel(row.label)}
              </th>
              {STAT_FIELDS.map((field) => (
                <td
                  key={`${row.label}-${field.key}`}
                  className="px-2 py-2 text-center text-amber-100 print:text-gray-900 print:text-xs"
                >
                  {renderStatValue(row.values[field.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const SidebarPanel = React.memo(function SidebarPanel({ rules, meta, dict }: SidebarPanelProps) {
  if (rules.length === 0 && meta.length === 0) return null;

  const localizeMetaLabel = React.useCallback(
    (label: string) => {
      if (label === "Unit Size") return dict.rosterDetailSidebarUnitSize;
      if (label === "Base Size") return dict.rosterDetailSidebarBaseSize;
      if (label === "Armour Value") return dict.rosterDetailSidebarArmourValue;

      const unitSizeMatch = label.match(/^(.*) Unit Size$/);
      if (unitSizeMatch) {
        const mountLabel =
          unitSizeMatch[1] === "Mount" ? dict.rosterDetailMountLabel : unitSizeMatch[1];
        return dict.rosterDetailSidebarMountUnitSize.replace("{mount}", mountLabel);
      }

      const baseSizeMatch = label.match(/^(.*) Base Size$/);
      if (baseSizeMatch) {
        const mountLabel =
          baseSizeMatch[1] === "Mount" ? dict.rosterDetailMountLabel : baseSizeMatch[1];
        return dict.rosterDetailSidebarMountBaseSize.replace("{mount}", mountLabel);
      }

      const armourMatch = label.match(/^(.*) Armour Value$/);
      if (armourMatch) {
        const mountLabel =
          armourMatch[1] === "Mount" ? dict.rosterDetailMountLabel : armourMatch[1];
        return dict.rosterDetailSidebarMountArmourValue.replace("{mount}", mountLabel);
      }

      return label;
    },
    [
      dict.rosterDetailSidebarUnitSize,
      dict.rosterDetailSidebarBaseSize,
      dict.rosterDetailSidebarArmourValue,
      dict.rosterDetailSidebarMountUnitSize,
      dict.rosterDetailSidebarMountBaseSize,
      dict.rosterDetailSidebarMountArmourValue,
      dict.rosterDetailMountLabel,
    ]
  );

  return (
    <aside className="space-y-3 rounded-lg border border-amber-400/10 bg-slate-900/40 p-3 text-xs print:space-y-2 print:border-gray-300 print:bg-white print:text-[11px]">
      {rules.length ? (
        <div>
          <h5 className="font-semibold uppercase tracking-wide text-amber-200/70 print:text-gray-600 print:text-xs">
            {dict.rosterDetailSpecialRulesLabel}
          </h5>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-amber-100 print:text-gray-900 print:space-y-0.5">
            {rules.map((rule) => (
              <li key={rule} className="print:text-xs">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {meta.length ? (
        <dl className="grid gap-2 sm:grid-cols-2">
          {meta.map((item) => (
            <div key={`${item.label}-${item.value}`} className="flex flex-col gap-0.5">
              <dt className="font-semibold uppercase tracking-wide text-amber-200/70 print:text-gray-600 print:text-xs">
                {localizeMetaLabel(item.label)}
              </dt>
              <dd className="text-amber-100 print:text-gray-900 print:text-xs">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </aside>
  );
});
