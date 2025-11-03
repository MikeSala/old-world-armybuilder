"use client";

import { useMemo, useCallback } from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { Download } from "lucide-react";
import type { RootState } from "@/lib/store";
import { ARMIES, ARMY_RULES, type Army, type ArmyRule } from "@/lib/data/armies/armies";
import { Button } from "@/components/ui/Button";
import type { ButtonVariant, ButtonSize } from "@/components/ui/Button";
import type { RosterDraft, RosterEntry } from "@/lib/store/slices/rosterSlice";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import { DropdownMenu, Theme } from "@radix-ui/themes";

type ExportDict = Pick<
  LocaleDictionary,
  | "rosterSummaryDefaultName"
  | "rosterExportUnknownArmy"
  | "rosterExportTitle"
  | "rosterExportDescription"
  | "rosterExportMenuPdf"
  | "rosterExportMenuJson"
  | "rosterExportMenuCsv"
  | "rosterExportMenuPrint"
  | "rosterExportArmyLabel"
  | "rosterExportCompositionLabel"
  | "rosterExportArmyRuleLabel"
  | "rosterPointsLimitLabel"
  | "rosterExportTotalPointsLabel"
  | "rosterExportUnitsHeading"
  | "rosterDetailModelsLine"
  | "rosterSummaryBaseCost"
  | "categoryOptionCostFree"
  | "categoryOptionCostPerModelSuffix"
  | "categoryOptionsDefaultLabel"
  | "rosterExportPerModelSuffix"
  | "rosterExportOptionNoteLabel"
  | "rosterExportUnitNotesLabel"
  | "rosterExportGeneratedLabel"
  | "categoryPointsValue"
  | "categoryCharactersLabel"
  | "categoryCoreLabel"
  | "categorySpecialLabel"
  | "categoryRareLabel"
  | "categoryMercsLabel"
  | "categoryAlliesLabel"
  | "rosterExportOwnedYes"
  | "rosterExportOwnedNo"
  | "rosterExportUnnamedUnit"
  | "rosterExportCsvHeaderCategory"
  | "rosterExportCsvHeaderUnit"
  | "rosterExportCsvHeaderUnitSize"
  | "rosterExportCsvHeaderPointsPerModel"
  | "rosterExportCsvHeaderBasePoints"
  | "rosterExportCsvHeaderOptions"
  | "rosterExportCsvHeaderTotalPoints"
  | "rosterExportCsvHeaderOwned"
  | "rosterExportCsvOptionFreeSuffix"
  | "rosterExportAriaLabel"
  | "rosterDownloadButton"
>;
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";

type ExportPayload = {
  metadata: {
    generatedAt: string;
    formatVersion: string;
  };
  roster: {
    name: string;
    description: string;
    army: { id: string | null; name: string };
    composition: { id: string | null; name: string | null };
    rule: { id: string | null; name: string | null };
    pointsLimit: number;
    totalPoints: number;
  };
  entries: Array<{
    id: string;
    unitId: string;
    name: string;
    category: string;
    unitSize: number;
    pointsPerModel: number;
    basePoints: number;
    options: Array<{
      group: string;
      name: string;
      points: number;
      note?: string;
      perModel?: boolean;
      baseCost?: number;
    }>;
    totalPoints: number;
    notes?: string;
    owned: boolean;
  }>;
};

function slugifyFilename(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function resolveArmy(draft: RosterDraft): {
  army: Army | undefined;
  compositionName: string | null;
} {
  if (!draft.armyId) return { army: undefined, compositionName: null };
  const army = ARMIES.find((candidate) => candidate.id === draft.armyId);
  const compositionName =
    army?.compositions?.find((c) => c.id === draft.compositionId)?.name ?? null;
  return { army, compositionName };
}

function resolveRule(draft: RosterDraft): ArmyRule | undefined {
  if (!draft.armyRuleId) return undefined;
  return ARMY_RULES.find((rule) => rule.id === draft.armyRuleId);
}

function normalizeEntries(entries: RosterEntry[]) {
  return entries.map((entry) => {
    const options = Array.isArray(entry.options) ? entry.options : [];
    const optionsPoints = options.reduce((sum, opt) => sum + opt.points, 0);
    const legacyPoints = (entry as unknown as { points?: number }).points;
    const basePoints =
      typeof entry.basePoints === "number"
        ? entry.basePoints
        : typeof legacyPoints === "number"
          ? legacyPoints
          : 0;
    const unitSize = typeof entry.unitSize === "number" && entry.unitSize > 0 ? entry.unitSize : 1;
    const pointsPerModel =
      typeof entry.pointsPerModel === "number" && entry.pointsPerModel > 0
        ? entry.pointsPerModel
        : unitSize > 0
          ? basePoints / unitSize
          : basePoints;
    const totalPoints =
      typeof entry.totalPoints === "number" ? entry.totalPoints : basePoints + optionsPoints;

    return {
      id: entry.id,
      unitId: entry.unitId,
      name: entry.name,
      category: entry.category,
      unitSize,
      pointsPerModel,
      basePoints,
      options: options.map((opt) => ({
        group: opt.group,
        name: opt.name,
        points: opt.points,
        note: opt.note,
        perModel:
          typeof (opt as { perModel?: boolean }).perModel === "boolean"
            ? (opt as { perModel?: boolean }).perModel
            : undefined,
        baseCost:
          typeof (opt as { baseCost?: number }).baseCost === "number"
            ? (opt as { baseCost?: number }).baseCost
            : undefined,
      })),
      totalPoints,
      notes: entry.notes,
      owned: Boolean(entry.owned),
    };
  });
}

function buildExportPayload(draft: RosterDraft, dict: ExportDict): ExportPayload {
  const { army, compositionName } = resolveArmy(draft);
  const armyRule = resolveRule(draft);
  const normalizedEntries = normalizeEntries(draft.entries ?? []);
  const totalPoints = normalizedEntries.reduce((sum, entry) => sum + entry.totalPoints, 0);

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      formatVersion: "1.0.0",
    },
    roster: {
      name: draft.name && draft.name.trim().length > 0 ? draft.name : dict.rosterSummaryDefaultName,
      description: draft.description || "",
      army: {
        id: army?.id ?? draft.armyId ?? null,
        name: army?.name ?? draft.armyId ?? dict.rosterExportUnknownArmy,
      },
      composition: {
        id: draft.compositionId ?? null,
        name: compositionName,
      },
      rule: {
        id: draft.armyRuleId ?? null,
        name: armyRule?.name ?? null,
      },
      pointsLimit: draft.pointsLimit,
      totalPoints,
    },
    entries: normalizedEntries,
  };
}

function buildCsvExport(payload: ExportPayload, dict: ExportDict): string {
  const header = [
    dict.rosterExportCsvHeaderCategory,
    dict.rosterExportCsvHeaderUnit,
    dict.rosterExportCsvHeaderUnitSize,
    dict.rosterExportCsvHeaderPointsPerModel,
    dict.rosterExportCsvHeaderBasePoints,
    dict.rosterExportCsvHeaderOptions,
    dict.rosterExportCsvHeaderTotalPoints,
    dict.rosterExportCsvHeaderOwned,
  ];

  const categoryLabels: Record<CategoryKey, string> = {
    characters: dict.categoryCharactersLabel,
    core: dict.categoryCoreLabel,
    special: dict.categorySpecialLabel,
    rare: dict.categoryRareLabel,
    mercenaries: dict.categoryMercsLabel,
    allies: dict.categoryAlliesLabel,
  };

  const rows = payload.entries.map((entry) => {
    const categoryLabel = categoryLabels[entry.category as CategoryKey] ?? entry.category ?? "";
    const unitName =
      entry.name && entry.name.trim().length > 0 ? entry.name : dict.rosterExportUnnamedUnit;
    const options = entry.options
      .map((opt) => {
        const groupLabel = opt.group?.trim().length ? opt.group : dict.categoryOptionsDefaultLabel;
        if (!opt.points)
          return `${groupLabel}: ${opt.name} ${dict.rosterExportCsvOptionFreeSuffix}`;
        const perModelNote =
          opt.perModel && opt.baseCost
            ? ` | ${dict.rosterExportPerModelSuffix.replace("{value}", String(opt.baseCost))}`
            : "";
        return `${groupLabel}: ${opt.name} (${opt.points})${perModelNote}`;
      })
      .join("; ");
    return [
      categoryLabel,
      unitName,
      String(entry.unitSize),
      String(entry.pointsPerModel),
      String(entry.basePoints),
      options,
      String(entry.totalPoints),
      entry.owned ? dict.rosterExportOwnedYes : dict.rosterExportOwnedNo,
    ];
  });

  return [header, ...rows]
    .map((cols) => cols.map((col) => `"${(col ?? "").toString().replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

type Props = {
  dict: ExportDict;
  className?: string;
  variant?: ButtonVariant | "inline";
  triggerLabel?: string;
  triggerVariant?: ButtonVariant;
  triggerSize?: ButtonSize;
  onPdfExport?: () => Promise<void> | void;
  pdfExporting?: boolean;
  onPrintExport?: () => Promise<void> | void;
};

export default function RosterExportControls({
  dict,
  className,
  variant,
  triggerLabel,
  triggerVariant,
  triggerSize = "sm",
  onPdfExport,
  pdfExporting,
  onPrintExport,
}: Props) {
  const draft = useSelector((state: RootState) => state.roster.draft);
  const payload = useMemo(() => buildExportPayload(draft, dict), [draft, dict]);

  const isEmpty = payload.entries.length === 0;

  const effectiveTriggerLabel = triggerLabel ?? dict.rosterDownloadButton;

  const handleExportJson = useCallback(() => {
    const filename = `${slugifyFilename(payload.roster.name)}-roster.json`;
    triggerDownload(filename, JSON.stringify(payload, null, 2), "application/json");
  }, [payload]);

  const handleExportCsv = useCallback(() => {
    const filename = `${slugifyFilename(payload.roster.name)}-roster.csv`;
    const csv = buildCsvExport(payload, dict);
    triggerDownload(filename, csv, "text/csv");
  }, [payload, dict]);

  const handleExportPrint = useCallback(() => {
    if (onPrintExport) {
      void onPrintExport();
      return;
    }
    window.print();
  }, [onPrintExport]);

  const resolvedVariant = triggerVariant ?? (variant === "inline" ? "secondary" : "accent");

  type ActionItem = { label: string; onSelect: () => void | Promise<void>; disabled?: boolean };

  const actions: ReadonlyArray<ActionItem> = useMemo(
    () => [
      { label: dict.rosterExportMenuJson, onSelect: handleExportJson },
      {
        label: dict.rosterExportMenuPdf,
        onSelect: async () => {
          if (onPdfExport) {
            await onPdfExport();
          }
        },
        disabled: pdfExporting ?? false,
      },
      { label: dict.rosterExportMenuCsv, onSelect: handleExportCsv, disabled: isEmpty },
      { label: dict.rosterExportMenuPrint, onSelect: handleExportPrint },
    ],
    [
      dict.rosterExportMenuJson,
      dict.rosterExportMenuPdf,
      dict.rosterExportMenuCsv,
      dict.rosterExportMenuPrint,
      onPdfExport,
      pdfExporting,
      handleExportJson,
      handleExportCsv,
      handleExportPrint,
      isEmpty,
    ]
  );

  const triggerButton = (
    <Theme>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            variant={resolvedVariant}
            size={triggerSize}
            aria-label={dict.rosterExportAriaLabel}
            aria-busy={Boolean(pdfExporting)}
            leftIcon={<Download aria-hidden className="h-4 w-4" strokeWidth={2} />}
          >
            {effectiveTriggerLabel}
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          sideOffset={6}
          align="start"
          className="z-50 w-56 rounded-lg border border-amber-300/40 bg-slate-900/95 p-2 text-sm shadow-lg shadow-amber-900/20 backdrop-blur"
        >
          {actions.map((action, index) => (
            <DropdownMenu.Item
              key={index}
              onSelect={action.onSelect}
              disabled={action.disabled}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-amber-100 outline-none hover:bg-slate-800/70 focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
            >
              {action.label}
              <span aria-hidden>→</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Theme>
  );

  if (variant === "inline") {
    return (
      <div className={clsx("relative", className)} aria-label={dict.rosterExportAriaLabel}>
        {triggerButton}
      </div>
    );
  }

  return (
    <section className={className} aria-label={dict.rosterExportAriaLabel}>
      <div className="relative rounded-2xl border border-amber-300/30 bg-slate-900/70 p-4 text-amber-100 shadow shadow-amber-900/10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
          {dict.rosterExportTitle}
        </h3>
        <p className="mt-2 text-xs text-amber-200/70">{dict.rosterExportDescription}</p>

        <div className="mt-4">{triggerButton}</div>
      </div>
    </section>
  );
}
