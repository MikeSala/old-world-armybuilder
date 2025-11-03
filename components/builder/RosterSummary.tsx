"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";
import { removeEntry, toggleEntryOwned } from "@/lib/store/slices/rosterSlice";
import { Button } from "@/components/ui/Button";
import RosterDetailSheet from "@/components/builder/RosterDetailSheet";
import RosterExportControls from "@/components/builder/RosterExportControls";

import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

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

type Props = {
  dict: Dict;
  className?: string;
};

export default function RosterSummary({ dict, className }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { name, description, entries, pointsLimit } = useSelector(
    (state: RootState) => state.roster.draft
  );
  const [showDetailSheet, setShowDetailSheet] = React.useState(false);
  const [autoPrint, setAutoPrint] = React.useState(false);
  const [autoPdf, setAutoPdf] = React.useState(false);
  const [pdfExporting, setPdfExporting] = React.useState(false);
  const [printRoot, setPrintRoot] = React.useState<HTMLElement | null>(null);
  const pdfRestoreSheetRef = React.useRef(false);

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
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        );
        const sheet = document.querySelector(
          ".print-roster-sheet"
        ) as HTMLElement | null;
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
        const sheetEl = document.querySelector(
          ".print-roster-sheet"
        ) as HTMLElement | null;
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

  const overlayElement = (
    <div
      className="print-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 sm:p-8"
      onClick={() => setShowDetailSheet(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="roster-detail-sheet-heading"
    >
      <div onClick={(event) => event.stopPropagation()} className="print-overlay__inner">
        <RosterDetailSheet
          dict={dict}
          autoPrint={autoPrint}
          onPrinted={() => setAutoPrint(false)}
          onClose={() => {
            setShowDetailSheet(false);
            setAutoPrint(false);
          }}
        />
      </div>
    </div>
  );

  const detailSheetOverlay = showDetailSheet
    ? printRoot
      ? createPortal(overlayElement, printRoot)
      : overlayElement
    : null;

  return (
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
                <Button variant="secondary" size="sm" onClick={() => setShowDetailSheet(true)}>
                  {dict.rosterViewSheetButton}
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => {
                    setShowDetailSheet(true);
                    setAutoPrint(true);
                  }}
                >
                  {dict.rosterPrintButton}
                </Button>
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
                const categoryLabel =
                  categoryLabels[category] ?? fallbackCategoryLabel(category);
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
                        const optionNames = entry.options
                          .map((opt) => opt.name)
                          .filter(
                            (value): value is string => Boolean(value && value.trim().length > 0)
                          );
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
                                <span className="font-medium text-amber-100">{entry.name}</span>
                                <label className="flex items-center gap-2 text-xs text-amber-200/80">
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
                                    className="h-4 w-4 rounded border-amber-400 bg-slate-900 text-amber-500 focus:ring-amber-400"
                                  />
                                  <span>{dict.rosterSummaryOwnedLabel}</span>
                                </label>
                              </div>
                              <div className="flex items-center gap-3">
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
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-amber-200/70">
                              {baseCostText}
                              {unitSizeDetail ? ` · ${unitSizeDetail}` : ""}
                            </div>
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
                                        <span className="font-medium">{opt.group}:</span> {opt.name}
                                        {opt.note ? (
                                          <span className="text-amber-200/60"> — {opt.note}</span>
                                        ) : null}
                                      </span>
                                      <span className="text-amber-200/80">{optionCost}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : null}
                            {optionNames.length > 0 ? (
                              <div className="mt-2 text-xs text-amber-200/70">
                                {optionNames.join(", ")}
                              </div>
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
      {detailSheetOverlay}
    </aside>
  );
}
