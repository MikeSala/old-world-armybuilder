"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import RosterDetailSheet from "@/components/builder/RosterDetailSheet";
import RosterExportControls from "@/components/builder/RosterExportControls";
import { RosterSummaryList } from "@/components/builder/RosterSummaryList";
import { useRosterExport } from "@/components/builder/hooks/useRosterExport";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import type { RootState, AppDispatch } from "@/lib/store";
import { normalizeRosterEntry, type RosterEntry } from "@/lib/roster/normalizeEntry";
import { selectRosterDetailView, type RosterUnitDetail } from "@/lib/store/selectors/rosterDetails";
import { removeEntry, toggleEntryOwned } from "@/lib/store/slices/rosterSlice";
import { buildCategoryLabels, formatPointsValue } from "@/lib/utils/rosterFormatting";

type Dict = LocaleDictionary;

type GroupedEntries = Partial<Record<CategoryKey, RosterEntry[]>>;

const groupEntriesByCategory = (entries: RosterEntry[]): GroupedEntries =>
  entries.reduce<GroupedEntries>((acc, entry) => {
    const bucket = acc[entry.category] ?? [];
    bucket.push(entry);
    acc[entry.category] = bucket;
    return acc;
  }, {});

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
  const [expandedEntryIds, setExpandedEntryIds] = React.useState<string[]>([]);
  const {
    showDetailSheet,
    pdfExporting,
    printRoot,
    handleDialogOpenChange,
    handlePdfExport,
    handlePrintExport,
    closeDetailSheet,
  } = useRosterExport();

  const toggleEntryDetails = React.useCallback((id: string) => {
    setExpandedEntryIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  }, []);

  const detailByEntryId = React.useMemo(() => {
    const map = new Map<string, RosterUnitDetail>();
    Object.values(detailView.entryDetailsByCategory).forEach((details) =>
      details?.forEach((detail) => map.set(detail.id, detail))
    );
    return map;
  }, [detailView.entryDetailsByCategory]);

  const isStatsAvailable = detailView.statsAvailable;

  const categoryLabels = React.useMemo(() => buildCategoryLabels(dict), [dict]);

  const normalizedEntries = React.useMemo(
    () => entries.map((entry) => normalizeRosterEntry(entry)),
    [entries]
  );

  const groups = React.useMemo(
    () => groupEntriesByCategory(normalizedEntries),
    [normalizedEntries]
  );
  const totalSpent = React.useMemo(
    () => normalizedEntries.reduce((sum, entry) => sum + entry.totalPoints, 0),
    [normalizedEntries]
  );
  const hasEntries = normalizedEntries.length > 0;

  const handleRemoveEntry = React.useCallback(
    (id: string) => dispatch(removeEntry(id)),
    [dispatch]
  );

  const handleOwnedChange = React.useCallback(
    (id: string, owned: boolean) => dispatch(toggleEntryOwned({ id, owned })),
    [dispatch]
  );

  const formatPointsFor = (value: number | string) => formatPointsValue(value, dict);

  const buildPdfFilename = React.useCallback(
    (rawName: string | null | undefined) => {
      const base = rawName && rawName.trim().length > 0 ? rawName.trim() : dict.rosterSummaryDefaultName;
      const slug = base
        .toLowerCase()
        .replace(/[^a-z0-9\s._-]/gi, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/\.pdf$/i, "");
      return `${slug || "rozpiska"}-rozpiski.pdf`;
    },
    [dict.rosterSummaryDefaultName]
  );

  return (
    <Dialog.Root open={showDetailSheet} onOpenChange={handleDialogOpenChange}>
      <aside
        className={clsx("print-summary-content print-bg-white print:text-black", className)}
        aria-labelledby="roster-summary-heading"
      >
        <div className="rounded-2xl border border-amber-300/30 bg-slate-900/80 p-6 text-amber-100 shadow-lg shadow-amber-900/15 print-bg-white">
          <header className="mb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-amber-400 print:text-gray-700">
                  {dict.rosterSummaryHeading}
                </p>
                <h2
                  id="roster-summary-heading"
                  className="mt-1 text-2xl font-semibold print:text-gray-900"
                >
                  {name || dict.rosterSummaryDefaultName}
                </h2>
                {description ? (
                  <p className="mt-2 text-sm text-amber-200/70 print:text-gray-700">
                    {description}
                  </p>
                ) : null}
              </div>
              {hasEntries ? (
                <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
                  <RosterExportControls
                    dict={dict}
                    variant="inline"
                    triggerVariant="accent"
                    onPdfExport={(fileName) => handlePdfExport(fileName ?? buildPdfFilename(name))}
                    pdfExporting={pdfExporting}
                    onPrintExport={handlePrintExport}
                  />
                </div>
              ) : null}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-amber-200 print:text-gray-800">
              <span>{dict.rosterPointsLimitLabel}</span>
              <span className="font-semibold">{formatPointsFor(pointsLimit)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-amber-200 print:text-gray-800">
              <span>{dict.rosterTotalSpentLabel}</span>
              <span className="font-semibold">{formatPointsFor(totalSpent)}</span>
            </div>
          </header>

          {hasEntries ? (
            <RosterSummaryList
              dict={dict}
              groupedEntries={groups}
              categoryLabels={categoryLabels}
              detailByEntryId={detailByEntryId}
              expandedEntryIds={expandedEntryIds}
              onToggleDetails={toggleEntryDetails}
              onRemoveEntry={handleRemoveEntry}
              onToggleOwned={handleOwnedChange}
              formatPointsFor={formatPointsFor}
            />
          ) : (
            <p className="text-sm text-amber-200/60 print:text-gray-700">
              {dict.rosterSummaryEmptyMessage}
            </p>
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
                <RosterDetailSheet dict={dict} onClose={closeDetailSheet} />
              </div>
            </Dialog.Content>
          </>
        ) : null}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
