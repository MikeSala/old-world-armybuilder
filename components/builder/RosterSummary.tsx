"use client";

import * as Dialog from "@radix-ui/react-dialog";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import RosterDetailSheet from "@/components/builder/RosterDetailSheet";
import RosterExportControls from "@/components/builder/RosterExportControls";
import { Button } from "@/components/ui/Button";
import { StatTooltipLabel } from "@/components/ui/StatTooltipLabel";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import type { RootState, AppDispatch } from "@/lib/store";
import { selectRosterDetailView, type RosterUnitDetail } from "@/lib/store/selectors/rosterDetails";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";
import { removeEntry, toggleEntryOwned } from "@/lib/store/slices/rosterSlice";

type Dict = LocaleDictionary;

type GroupedEntries = Partial<Record<CategoryKey, RosterEntry[]>>;

function groupEntriesByCategory(entries: RosterEntry[]): GroupedEntries {
  return entries.reduce<GroupedEntries>((acc, entry) => {
    const bucket = acc[entry.category] ?? [];
    bucket.push(entry);
    acc[entry.category] = bucket;
    return acc;
  }, {});
}

const fallbackCategoryLabel = (category: string): string =>
  category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const SUMMARY_STAT_FIELDS = [
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
type SummaryStatFieldKey = (typeof SUMMARY_STAT_FIELDS)[number]["key"];

const SUMMARY_STAT_TOOLTIP_KEYS: Record<SummaryStatFieldKey, keyof LocaleDictionary> = {
  M: "rosterDetailStatNameM",
  WS: "rosterDetailStatNameWS",
  BS: "rosterDetailStatNameBS",
  S: "rosterDetailStatNameS",
  T: "rosterDetailStatNameT",
  W: "rosterDetailStatNameW",
  I: "rosterDetailStatNameI",
  A: "rosterDetailStatNameA",
  Ld: "rosterDetailStatNameLd",
};

const renderStatValue = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : value.toFixed(1);
  }
  return value;
};

type Props = {
  dict: Dict;
  className?: string;
};

export default function RosterSummary({ dict, className }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { name, description, entries, pointsLimit } = useSelector(
    (state: RootState) => state.roster.draft
  );
  const detailView = useSelector(selectRosterDetailView);
  const [showDetailSheet, setShowDetailSheet] = React.useState(false);
  const [autoPdf, setAutoPdf] = React.useState(false);
  const [pdfExporting, setPdfExporting] = React.useState(false);
  const [printRoot, setPrintRoot] = React.useState<HTMLElement | null>(null);
  const pdfRestoreSheetRef = React.useRef(false);
  const [expandedEntryIds, setExpandedEntryIds] = React.useState<string[]>([]);

  const toggleEntryDetails = React.useCallback((id: string) => {
    setExpandedEntryIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  }, []);

  const detailByEntryId = React.useMemo(() => {
    const map = new Map<string, RosterUnitDetail>();
    Object.values(detailView.entryDetailsByCategory).forEach((details) => {
      if (!details) return;
      details.forEach((detail) => {
        map.set(detail.id, detail);
      });
    });
    return map;
  }, [detailView.entryDetailsByCategory]);

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

  const isStatsAvailable = detailView.statsAvailable;

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const node = document.getElementById("print-root");
    setPrintRoot(node);
  }, []);

  React.useEffect(() => {
    if (!showDetailSheet) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showDetailSheet]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!autoPdf || !showDetailSheet) return;
    let cancelled = false;

    const capture = async () => {
      try {
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const sheet = document.querySelector(".print-roster-sheet") as HTMLElement | null;
        if (!sheet) return;

        sheet.classList.add("pdf-capture");
        const captureScale = Math.max(window.devicePixelRatio || 1, 2);
        const canvas = await html2canvas(sheet, {
          scale: captureScale,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        if (cancelled) return;

        const orientation = canvas.width >= canvas.height ? "l" : "p";
        const pdf = new jsPDF({ orientation, unit: "pt", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const renderScale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const renderWidth = imgWidth * renderScale;
        const renderHeight = imgHeight * renderScale;
        const marginX = (pageWidth - renderWidth) / 2;
        const marginY = (pageHeight - renderHeight) / 2;

        const imageData = canvas.toDataURL("image/png", 1.0);
        pdf.addImage(
          imageData,
          "PNG",
          marginX,
          marginY,
          renderWidth,
          renderHeight,
          undefined,
          "FAST"
        );
        pdf.save("roster.pdf");
      } catch (error) {
        console.error("Failed to export roster PDF", error);
      } finally {
        const sheetEl = document.querySelector(".print-roster-sheet") as HTMLElement | null;
        if (sheetEl) {
          sheetEl.classList.remove("pdf-capture");
        }
        if (!cancelled) {
          setPdfExporting(false);
          setAutoPdf(false);
          if (!pdfRestoreSheetRef.current) {
            setShowDetailSheet(false);
          }
          pdfRestoreSheetRef.current = false;
        }
      }
    };

    capture();

    return () => {
      cancelled = true;
      pdfRestoreSheetRef.current = false;
      setPdfExporting(false);
      setAutoPdf(false);
    };
  }, [autoPdf, showDetailSheet]);

  const formatPoints = React.useCallback(
    (value: number) => dict.categoryPointsValue.replace("{value}", String(value)),
    [dict.categoryPointsValue]
  );

  const categoryLabels = React.useMemo(
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

  const normalizedEntries = React.useMemo(() => {
    return entries.map((entry) => {
      const legacyPoints = (entry as unknown as { points?: number }).points;
      const basePoints =
        typeof entry.basePoints === "number"
          ? entry.basePoints
          : typeof legacyPoints === "number"
            ? legacyPoints
            : 0;
      const options = Array.isArray(entry.options) ? entry.options : [];
      const optionsPoints = options.reduce((sum, opt) => sum + (opt.points ?? 0), 0);
      const totalPoints =
        typeof entry.totalPoints === "number" ? entry.totalPoints : basePoints + optionsPoints;
      const unitSize =
        typeof entry.unitSize === "number" && entry.unitSize > 0 ? entry.unitSize : 1;
      const pointsPerModel =
        typeof entry.pointsPerModel === "number" && entry.pointsPerModel > 0
          ? entry.pointsPerModel
          : unitSize > 0
            ? basePoints / unitSize
            : basePoints;

      return {
        ...entry,
        basePoints,
        totalPoints,
        options,
        owned: Boolean(entry.owned),
        unitSize,
        pointsPerModel,
      };
    });
  }, [entries]);

  const groups = React.useMemo(
    () => groupEntriesByCategory(normalizedEntries),
    [normalizedEntries]
  );
  const totalSpent = React.useMemo(
    () => normalizedEntries.reduce((sum, entry) => sum + entry.totalPoints, 0),
    [normalizedEntries]
  );
  const hasEntries = normalizedEntries.length > 0;

  const handlePdfExport = React.useCallback(() => {
    if (pdfExporting) return;
    pdfRestoreSheetRef.current = showDetailSheet;
    setPdfExporting(true);
    if (!showDetailSheet) {
      setShowDetailSheet(true);
    }
    setAutoPdf(true);
  }, [pdfExporting, showDetailSheet]);

  const handleDialogOpenChange = React.useCallback(
    (open: boolean) => {
      setShowDetailSheet(open);
      if (!open) {
        setAutoPdf(false);
        setPdfExporting(false);
        pdfRestoreSheetRef.current = false;
      }
    },
    [setAutoPdf, setPdfExporting]
  );

  return (
    <Dialog.Root open={showDetailSheet} onOpenChange={handleDialogOpenChange}>
      <aside className={className} aria-labelledby="roster-summary-heading">
        <div className="rounded-2xl border border-amber-300/30 bg-slate-900/80 p-6 text-amber-100 shadow-lg shadow-amber-900/15 print:hidden">
          <header className="mb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
                  {dict.rosterSummaryHeading}
                </p>
                <h2 id="roster-summary-heading" className="mt-1 text-2xl font-semibold">
                  {name || dict.rosterSummaryDefaultName}
                </h2>
                {description ? (
                  <p className="mt-2 text-sm text-amber-200/70">{description}</p>
                ) : null}
              </div>
              {hasEntries ? (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <RosterExportControls
                  dict={dict}
                  variant="inline"
                  triggerVariant="accent"
                  onPdfExport={handlePdfExport}
                  pdfExporting={pdfExporting}
                />
              </div>
            ) : null}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-amber-200">
              <span>{dict.rosterPointsLimitLabel}</span>
              <span className="font-semibold">{formatPoints(pointsLimit)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-amber-200">
              <span>{dict.rosterTotalSpentLabel}</span>
              <span className="font-semibold">{formatPoints(totalSpent)}</span>
            </div>
          </header>

          {!hasEntries ? (
            <p className="text-sm text-amber-200/60">{dict.rosterSummaryEmptyMessage}</p>
          ) : (
            <ul className="space-y-5 text-sm">
              {(Object.entries(groups) as Array<[CategoryKey, RosterEntry[]]>).map(
                ([category, items]) => {
                  const categoryLabel = categoryLabels[category] ?? fallbackCategoryLabel(category);
                  const categoryPoints = formatPoints(
                    items.reduce((sum, entry) => sum + entry.totalPoints, 0)
                  );

                  return (
                    <li key={category} className="rounded-xl bg-slate-800/60 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold text-amber-200">{categoryLabel}</span>
                        <span className="text-amber-200/70">{categoryPoints}</span>
                      </div>
                      <ul className="space-y-2 text-amber-100/90">
                        {items.map((entry) => {
                          const detail = detailByEntryId.get(entry.id);
                          const isExpanded = expandedEntryIds.includes(entry.id);
                          const statsRows = detail?.statRows ?? [];
                          const specialRules = detail?.sidebarRules ?? [];
                          const metaEntries = detail
                            ? detail.sidebarMeta.map((item) => ({
                                label: localizeMetaLabel(item.label),
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
                            formatPoints(entry.basePoints)
                          );
                          const unitSizeDetail =
                            entry.unitSize > 1
                              ? `${dict.categoryEntryMultipleModels.replace(
                                  "{count}",
                                  String(entry.unitSize)
                                )} @ ${dict.categoryEntryPointsPerModel.replace(
                                  "{value}",
                                  String(entry.pointsPerModel)
                                )}`
                              : null;
                          const entryPointsLabel = formatPoints(entry.totalPoints);

                          return (
                            <li key={entry.id} className="rounded-lg bg-slate-900/60 px-3 py-2">
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium text-amber-100">
                                    {entry.unitSize} {entry.name}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 md:ml-auto">
                                  <span className="text-amber-200/80">{entryPointsLabel}</span>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => dispatch(removeEntry(entry.id))}
                                    aria-label={dict.rosterSummaryRemoveAria.replace(
                                      "{unit}",
                                      entry.name
                                    )}
                                  >
                                    {dict.rosterSummaryRemoveButton}
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => toggleEntryDetails(entry.id)}
                                    aria-expanded={isExpanded}
                                    className="text-xs uppercase tracking-wide text-amber-300 hover:text-amber-100"
                                  >
                                    {detailsLabel}
                                  </Button>
                                  <label className="flex flex-row-reverse items-center gap-2 text-xs text-amber-100 print:text-gray-600 md:ml-auto">
                                    <input
                                      type="checkbox"
                                      checked={entry.owned}
                                      onChange={(event) =>
                                        dispatch(
                                          toggleEntryOwned({
                                            id: entry.id,
                                            owned: event.target.checked,
                                          })
                                        )
                                      }
                                      className="h-4 w-4 rounded border-amber-100 bg-slate-900 text-amber-500 focus:ring-amber-400"
                                    />
                                    <span>{dict.rosterSummaryOwnedLabel}</span>
                                  </label>
                                </div>
                              </div>

                              <div className="mt-1 text-xs text-amber-200/70">
                                {baseCostText}
                                {unitSizeDetail ? ` · ${unitSizeDetail}` : ""}
                              </div>
                              {isExpanded ? (
                                detail ? (
                                  <div className="mt-3 space-y-3 rounded-lg border border-amber-400/20 bg-slate-950/60 p-3 text-xs text-amber-100">
                                    {statsRows.length ? (
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-amber-400/20 text-xs">
                                          <thead className="text-amber-200/70">
                                            <tr>
                                              <th className="px-2 py-1 text-left font-semibold uppercase tracking-wide">
                                                {dict.rosterDetailStatsModelLabel}
                                              </th>
                                              {SUMMARY_STAT_FIELDS.map((field) => (
                                                <th
                                                  key={field.key}
                                                  className="px-2 py-1 text-center font-semibold uppercase tracking-wide"
                                                >
                                                  <StatTooltipLabel
                                                    abbreviation={field.label}
                                                    label={
                                                      dict[SUMMARY_STAT_TOOLTIP_KEYS[field.key]]
                                                    }
                                                    className="inline-flex w-full justify-center"
                                                  />
                                                </th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {statsRows.map((row) => (
                                              <tr key={row.label} className="text-amber-100">
                                                <th className="px-2 py-2 text-left font-semibold">
                                                  {row.label}
                                                </th>
                                                {SUMMARY_STAT_FIELDS.map((field) => (
                                                  <td
                                                    key={`${row.label}-${field.key}`}
                                                    className="px-2 py-2 text-center"
                                                  >
                                                    {renderStatValue(row.values[field.key])}
                                                  </td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <p className="text-amber-200/70">
                                        {isStatsAvailable
                                          ? dict.rosterDetailStatsMissing
                                          : dict.rosterDetailStatsMissing}
                                      </p>
                                    )}

                                    {specialRules.length || filteredMeta.length ? (
                                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                                        {specialRules.length ? (
                                          <div className="flex-1 space-y-1">
                                            <h5 className="font-semibold uppercase tracking-wide text-amber-200/70">
                                              {dict.rosterDetailSpecialRulesLabel}
                                            </h5>
                                            <p className="text-amber-100">
                                              {specialRules.join(", ")}
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
                                                <dt className="font-semibold uppercase tracking-wide text-amber-200/70">
                                                  {meta.label}
                                                </dt>
                                                <dd className="text-amber-100">{meta.value}</dd>
                                              </div>
                                            ))}
                                          </dl>
                                        ) : null}
                                      </div>
                                    ) : null}
                                  </div>
                                ) : (
                                  <div className="mt-3 rounded-lg border border-amber-200/20 bg-slate-900/40 p-3 text-xs text-amber-200/70">
                                    {dict.rosterDetailStatsMissing}
                                  </div>
                                )
                              ) : null}
                              {entry.options.length ? (
                                <ul className="mt-2 space-y-1 text-xs text-amber-200/70">
                                  {entry.options.map((opt) => {
                                    const optionCost = opt.points
                                      ? `${formatPoints(opt.points)}${
                                          opt.perModel && typeof opt.baseCost === "number"
                                            ? ` (${formatPoints(opt.baseCost)}${
                                                dict.categoryOptionCostPerModelSuffix
                                              })`
                                            : ""
                                        }`
                                      : dict.categoryOptionCostFree;
                                    return (
                                      <li
                                        key={opt.id}
                                        className="flex items-center justify-between gap-3"
                                      >
                                        <span>
                                          <span className="font-medium">{opt.group}:</span>{" "}
                                          <span className=" text-amber-100">{opt.name}</span>
                                          {opt.note ? (
                                            <span className="text-amber-100"> — {opt.note}</span>
                                          ) : null}
                                        </span>
                                        <span className="text-amber-200/80">{optionCost}</span>
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
                }
              )}
            </ul>
          )}
        </div>
      </aside>
      <Dialog.Portal container={printRoot ?? undefined}>
        {showDetailSheet ? (
          <>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/80 data-[state=open]:animate-fade-in" />
            <Dialog.Content className="print-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8 focus:outline-none">
              <div className="print-overlay__inner relative z-10">
                <Dialog.Title className="sr-only">{dict.rosterDetailHeading}</Dialog.Title>
                <Dialog.Description className="sr-only">
                  {dict.rosterDetailEmptyMessage}
                </Dialog.Description>
                <RosterDetailSheet
                  dict={dict}
                  onClose={() => {
                    setShowDetailSheet(false);
                    setAutoPdf(false);
                    setPdfExporting(false);
                    pdfRestoreSheetRef.current = false;
                  }}
                />
              </div>
            </Dialog.Content>
          </>
        ) : null}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
