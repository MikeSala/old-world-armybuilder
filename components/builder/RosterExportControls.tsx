"use client";

import { DropdownMenu, Theme } from "@radix-ui/themes";
import { clsx } from "clsx";
import { Download } from "lucide-react";
import { useSelector } from "react-redux";

import type { ButtonVariant, ButtonSize } from "@/components/ui/Button";
import type { OptionLabelByUnitId } from "@/lib/builder/unitHelpers";
import { ARMIES, ARMY_RULES, type Army, type ArmyRule } from "@/lib/data/armies/armies";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { ExportDict } from "@/lib/i18n/dictSubsets";
import { tData } from "@/lib/i18n/data";
import { translateNameForDict, translateTextForDict } from "@/lib/i18n/translateLocale";
import { getOptionGroupLabel } from "@/lib/utils/rosterFormatting";
import type { RootState } from "@/lib/store";
import type { RosterDraft, RosterEntry } from "@/lib/store/slices/rosterSlice";
import { normalizeRosterEntry } from "@/lib/roster/normalizeEntry";

type ActionItem = { label: string; onSelect: () => void | Promise<void>; disabled?: boolean };

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
  compositionKey: NonNullable<Army["compositions"]>[number]["nameKey"] | null;
} {
  if (!draft.armyId) return { army: undefined, compositionKey: null };
  const army = ARMIES.find((candidate) => candidate.id === draft.armyId);
  const compositionKey =
    army?.compositions?.find((c) => c.id === draft.compositionId)?.nameKey ?? null;
  return { army, compositionKey };
}

function resolveRule(draft: RosterDraft): ArmyRule | undefined {
  if (!draft.armyRuleId) return undefined;
  return ARMY_RULES.find((rule) => rule.id === draft.armyRuleId);
}

const normalizeEntries = (
  entries: RosterEntry[],
  dict: ExportDict,
  unitLabelById?: Map<string, string>,
  optionLabelByUnitId?: OptionLabelByUnitId
) =>
  entries.map((entry) => {
    const normalized = normalizeRosterEntry(entry);
    const unitLabel = unitLabelById?.get(normalized.unitId);
    const optionMap = optionLabelByUnitId?.get(normalized.unitId);
    return {
      ...normalized,
      name: unitLabel ?? (normalized.name ? translateNameForDict(normalized.name, dict) : normalized.name),
      notes: normalized.notes ? translateTextForDict(normalized.notes, dict) : normalized.notes,
      options: normalized.options.map((opt) => {
        const optionInfo = opt.sourceId ? optionMap?.get(opt.sourceId) : null;
        const groupSource =
          opt.group && opt.group.trim().length > 0 ? opt.group : optionInfo?.groupKey ?? "";
        const groupLabel = getOptionGroupLabel(groupSource, dict);
        return {
          group: groupLabel,
          name: optionInfo?.label ?? (opt.name ? translateTextForDict(opt.name, dict) : opt.name),
          points: opt.points,
          note: optionInfo?.note ?? (opt.note ? translateTextForDict(opt.note, dict) : opt.note),
          perModel: typeof opt.perModel === "boolean" ? opt.perModel : undefined,
          baseCost: typeof opt.baseCost === "number" ? opt.baseCost : undefined,
        };
      }),
    };
  });

function buildExportPayload(
  draft: RosterDraft,
  dict: ExportDict,
  unitLabelById?: Map<string, string>,
  optionLabelByUnitId?: OptionLabelByUnitId
): ExportPayload {
  const { army, compositionKey } = resolveArmy(draft);
  const armyRule = resolveRule(draft);
  const normalizedEntries = normalizeEntries(draft.entries ?? [], dict, unitLabelById, optionLabelByUnitId);
  const totalPoints = normalizedEntries.reduce((sum, entry) => sum + entry.totalPoints, 0);
  const armyLabel = army?.nameKey
    ? tData(army.nameKey, dict)
    : draft.armyId ?? dict.rosterExportUnknownArmy;
  const compositionLabel = compositionKey ? tData(compositionKey, dict) : null;
  const ruleLabel = armyRule?.nameKey ? tData(armyRule.nameKey, dict) : null;

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
        name: armyLabel,
      },
      composition: {
        id: draft.compositionId ?? null,
        name: compositionLabel,
      },
      rule: {
        id: draft.armyRuleId ?? null,
        name: ruleLabel,
      },
      pointsLimit: draft.pointsLimit,
      totalPoints,
    },
    entries: normalizedEntries,
  };
}

const buildCategoryLabels = (dict: ExportDict): Record<CategoryKey, string> => ({
  characters: dict.categoryCharactersLabel,
  core: dict.categoryCoreLabel,
  special: dict.categorySpecialLabel,
  rare: dict.categoryRareLabel,
  mercenaries: dict.categoryMercsLabel,
  allies: dict.categoryAlliesLabel,
});

const formatCsvOption = (opt: ExportPayload["entries"][number]["options"][number], dict: ExportDict) => {
  const groupLabel = opt.group?.trim().length ? opt.group : dict.categoryOptionsDefaultLabel;
  if (!opt.points) return `${groupLabel}: ${opt.name} ${dict.rosterExportCsvOptionFreeSuffix}`;
  const perModelNote =
    opt.perModel && opt.baseCost
      ? ` | ${dict.rosterExportPerModelSuffix.replace("{value}", String(opt.baseCost))}`
      : "";
  return `${groupLabel}: ${opt.name} (${opt.points})${perModelNote}`;
};

const formatCsvRow = (
  entry: ExportPayload["entries"][number],
  dict: ExportDict,
  categoryLabels: Record<CategoryKey, string>
) => {
  const categoryLabel = categoryLabels[entry.category as CategoryKey] ?? entry.category ?? "";
  const unitName =
    entry.name && entry.name.trim().length > 0 ? entry.name : dict.rosterExportUnnamedUnit;
  const options = entry.options.map((opt) => formatCsvOption(opt, dict)).join("; ");
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
};

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

  const categoryLabels = buildCategoryLabels(dict);
  const rows = payload.entries.map((entry) => formatCsvRow(entry, dict, categoryLabels));

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
  unitLabelById?: Map<string, string>;
  optionLabelByUnitId?: OptionLabelByUnitId;
  onPdfExport?: (fileName?: string) => Promise<void> | void;
  pdfExporting?: boolean;
};

export default function RosterExportControls({
  dict,
  className,
  variant,
  triggerLabel,
  triggerVariant,
  triggerSize = "sm",
  unitLabelById,
  optionLabelByUnitId,
  onPdfExport,
  pdfExporting,
}: Props) {
  const draft = useSelector((state: RootState) => state.roster.draft);
  const payload = buildExportPayload(draft, dict, unitLabelById, optionLabelByUnitId);

  const isEmpty = payload.entries.length === 0;

  const effectiveTriggerLabel = triggerLabel ?? dict.rosterDownloadButton;

  const handleExportJson = () => {
    const base = slugifyFilename(payload.roster.name) || "roster";
    const filename = `${base}-roster.json`;
    triggerDownload(filename, JSON.stringify(payload, null, 2), "application/json");
  };

  const handleExportCsv = () => {
    const base = slugifyFilename(payload.roster.name) || "roster";
    const filename = `${base}-roster.csv`;
    const csv = buildCsvExport(payload, dict);
    triggerDownload(filename, csv, "text/csv");
  };

  const actions: ReadonlyArray<ActionItem> = [
    { label: dict.rosterExportMenuJson, onSelect: handleExportJson },
    {
      label: dict.rosterExportMenuPdf,
      onSelect: async () => {
        if (onPdfExport) {
          const base = slugifyFilename(payload.roster.name) || "roster";
          await onPdfExport(`${base}-rozpiski.pdf`);
        }
      },
      disabled: pdfExporting ?? false,
    },
    { label: dict.rosterExportMenuCsv, onSelect: handleExportCsv, disabled: isEmpty },
  ];

  const triggerButton = (
    <Theme>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          aria-label={dict.rosterExportAriaLabel}
          aria-busy={Boolean(pdfExporting)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-400 bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-900 transition-all duration-200 hover:border-stone-500 hover:bg-stone-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:border-stone-400 dark:hover:bg-stone-700"
        >
          <Download aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2} />
          {effectiveTriggerLabel}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          sideOffset={6}
          align="start"
          className="z-50 w-56 rounded-lg border border-stone-300/40 bg-stone-800/95 p-2 text-sm shadow-lg shadow-stone-900/20 backdrop-blur"
        >
          {actions.map((action, index) => (
            <DropdownMenu.Item
              key={index}
              onSelect={action.onSelect}
              disabled={action.disabled}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-stone-100 outline-none hover:bg-stone-700/70 focus-visible:ring-2 focus-visible:ring-stone-400 disabled:cursor-not-allowed disabled:opacity-60 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
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
      <div className="relative rounded-2xl border border-stone-300/30 bg-stone-800/70 p-4 text-stone-100 shadow shadow-stone-900/10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
          {dict.rosterExportTitle}
        </h3>
        <p className="mt-2 text-xs text-stone-200/70">{dict.rosterExportDescription}</p>

        <div className="mt-4">{triggerButton}</div>
      </div>
    </section>
  );
}
