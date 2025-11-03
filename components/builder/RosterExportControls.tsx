"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Download } from "lucide-react";
import type { RootState } from "@/lib/store";
import { ARMIES, ARMY_RULES, type Army, type ArmyRule } from "@/lib/data/armies/armies";
import { Button } from "@/components/ui/Button";
import type {
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/Button";
import type { RosterDraft, RosterEntry } from "@/lib/store/slices/rosterSlice";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

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

function resolveArmy(draft: RosterDraft): { army: Army | undefined; compositionName: string | null } {
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
    const unitSize =
      typeof entry.unitSize === "number" && entry.unitSize > 0 ? entry.unitSize : 1;
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
        name: army?.name ?? (draft.armyId ?? dict.rosterExportUnknownArmy),
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
    const categoryLabel =
      categoryLabels[entry.category as CategoryKey] ?? entry.category ?? "";
    const unitName = entry.name && entry.name.trim().length > 0 ? entry.name : dict.rosterExportUnnamedUnit;
    const options = entry.options
      .map((opt) => {
        const groupLabel = opt.group?.trim().length
          ? opt.group
          : dict.categoryOptionsDefaultLabel;
        if (!opt.points) return `${groupLabel}: ${opt.name} ${dict.rosterExportCsvOptionFreeSuffix}`;
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
};

const joinClasses = (...values: Array<string | undefined | null | false>) =>
  values.filter(Boolean).join(" ");

export default function RosterExportControls({
  dict,
  className,
  variant = "card",
  triggerLabel,
  triggerVariant,
  triggerSize = "sm",
  onPdfExport,
  pdfExporting,
}: Props) {
  const draft = useSelector((state: RootState) => state.roster.draft);
  const payload = useMemo(() => buildExportPayload(draft, dict), [draft, dict]);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const buttonId = useId();

  const effectiveTriggerLabel = triggerLabel ?? dict.rosterDownloadButton;

  const handleExportJson = () => {
    const filename = `${payload.roster.name.replace(/\s+/g, "-").toLowerCase()}-roster.json`;
    triggerDownload(filename, JSON.stringify(payload, null, 2), "application/json");
  };

  const handleExportCsv = () => {
    const filename = `${payload.roster.name.replace(/\s+/g, "-").toLowerCase()}-roster.csv`;
    const csv = buildCsvExport(payload, dict);
    triggerDownload(filename, csv, "text/csv");
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (menuRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const resolvedVariant = triggerVariant ?? (variant === "inline" ? "secondary" : "accent");

  const triggerButton = (
    <Button
      ref={buttonRef}
      variant={resolvedVariant}
      size={triggerSize}
      onClick={() => setMenuOpen((prev) => !prev)}
      id={buttonId}
      aria-haspopup="menu"
      aria-expanded={isMenuOpen}
      aria-controls={isMenuOpen ? menuId : undefined}
      leftIcon={<Download aria-hidden className="h-4 w-4" strokeWidth={2} />}
    >
      {effectiveTriggerLabel}
    </Button>
  );

  const menu = isMenuOpen ? (
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-labelledby={buttonId}
      className="absolute z-10 mt-2 w-56 rounded-lg border border-amber-300/40 bg-slate-900/95 p-2 text-sm shadow-lg shadow-amber-900/20"
    >
      <button
        role="menuitem"
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-amber-100 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => {
          setMenuOpen(false);
          handleExportJson();
        }}
      >
        {dict.rosterExportMenuJson}
        <span aria-hidden>→</span>
      </button>
      <button
        role="menuitem"
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-amber-100 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={async () => {
          setMenuOpen(false);
          if (onPdfExport) {
            await onPdfExport();
          }
        }}
        disabled={pdfExporting}
      >
        {dict.rosterExportMenuPdf}
        <span aria-hidden>→</span>
      </button>
      <button
        role="menuitem"
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-amber-100 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        onClick={() => {
          setMenuOpen(false);
          handleExportCsv();
        }}
      >
        {dict.rosterExportMenuCsv}
        <span aria-hidden>→</span>
      </button>
      <button
        role="menuitem"
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-amber-100 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        onClick={() => {
          setMenuOpen(false);
          window.print();
        }}
      >
        {dict.rosterExportMenuPrint}
        <span aria-hidden>→</span>
      </button>
    </div>
  ) : null;

  if (variant === "inline") {
    return (
      <div className={joinClasses("relative", className)} aria-label={dict.rosterExportAriaLabel}>
        {triggerButton}
        {menu}
      </div>
    );
  }

  return (
    <section className={className} aria-label={dict.rosterExportAriaLabel}>
      <div className="relative rounded-2xl border border-amber-300/30 bg-slate-900/70 p-4 text-amber-100 shadow shadow-amber-900/10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
          {dict.rosterExportTitle}
        </h3>
        <p className="mt-2 text-xs text-amber-200/70">
          {dict.rosterExportDescription}
        </p>

        <div className="mt-4">
          {triggerButton}
          {menu}
        </div>
      </div>
    </section>
  );
}
