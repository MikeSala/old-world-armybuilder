"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Download } from "lucide-react";
import type { RootState } from "@/lib/store";
import { ARMIES, ARMY_RULES, type Army, type ArmyRule } from "@/lib/data/armies/armies";
import { Button } from "@/components/ui/Button";
import type { RosterDraft, RosterEntry } from "@/lib/store/slices/rosterSlice";

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

function buildExportPayload(draft: RosterDraft): ExportPayload {
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
      name: draft.name || "Untitled roster",
      description: draft.description || "",
      army: {
        id: army?.id ?? draft.armyId ?? null,
        name: army?.name ?? (draft.armyId ?? "Unknown army"),
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

function buildTextExport(payload: ExportPayload): string {
  const lines: string[] = [];
  lines.push(`# ${payload.roster.name}`);
  if (payload.roster.description) {
    lines.push(payload.roster.description);
  }
  lines.push("");
  lines.push(`Army: ${payload.roster.army.name}`);
  if (payload.roster.composition.name) {
    lines.push(`Composition: ${payload.roster.composition.name}`);
  }
  if (payload.roster.rule.name) {
    lines.push(`Army Rule: ${payload.roster.rule.name}`);
  }
  lines.push(`Points Limit: ${payload.roster.pointsLimit}`);
  lines.push(`Total Points: ${payload.roster.totalPoints}`);
  lines.push("");
  lines.push("## Units");
  payload.entries.forEach((entry) => {
    lines.push(`- ${entry.name} (${entry.category}) — ${entry.totalPoints} pts`);
    if (entry.unitSize > 1) {
      lines.push(
        `  Unit size: ${entry.unitSize} models @ ${entry.pointsPerModel} pts — base cost ${entry.basePoints} pts`
      );
    } else {
      lines.push(`  Base cost: ${entry.basePoints} pts`);
    }
    if (entry.options.length > 0) {
      entry.options.forEach((opt) => {
        const costLabel = opt.points
          ? `${opt.points} pts${
              opt.perModel && opt.baseCost ? ` (${opt.baseCost} pts/model)` : ""
            }`
          : "free";
        lines.push(`  - ${opt.group}: ${opt.name} (${costLabel})`);
        if (opt.note) lines.push(`    note: ${opt.note}`);
      });
    }
    if (entry.notes) {
      lines.push(`  Notes: ${entry.notes}`);
    }
  });
  lines.push("");
  lines.push(`Generated: ${payload.metadata.generatedAt}`);
  return lines.join("\n");
}

function escapePdfText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[\u0080-\uFFFF]/g, "?");
}

function buildRosterPdf(payload: ExportPayload): string {
  const text = buildTextExport(payload);
  const lines = text.split("\n");

  const contentParts = ["BT", "/F1 12 Tf", "1 14 TL", "72 760 Td"];
  lines.forEach((line, index) => {
    const escaped = escapePdfText(line);
    if (index === 0) {
      contentParts.push(`(${escaped}) Tj`);
    } else {
      contentParts.push(`T* (${escaped}) Tj`);
    }
  });
  contentParts.push("ET");

  const stream = contentParts.join("\n");
  const streamLength = new TextEncoder().encode(stream).length;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((obj) => {
    offsets.push(pdf.length);
    pdf += obj;
  });

  const xrefPosition = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`;

  return pdf;
}

function buildCsvExport(payload: ExportPayload): string {
  const header = [
    "Category",
    "Unit",
    "UnitSize",
    "PointsPerModel",
    "BasePoints",
    "Options",
    "TotalPoints",
    "Owned",
  ];
  const rows = payload.entries.map((entry) => {
    const options = entry.options
      .map((opt) => {
        if (!opt.points) return `${opt.group}: ${opt.name} (free)`;
        const perModelNote =
          opt.perModel && opt.baseCost ? ` | ${opt.baseCost} pts/model` : "";
        return `${opt.group}: ${opt.name} (${opt.points})${perModelNote}`;
      })
      .join("; ");
    return [
      entry.category,
      entry.name,
      String(entry.unitSize),
      String(entry.pointsPerModel),
      String(entry.basePoints),
      options,
      String(entry.totalPoints),
      entry.owned ? "yes" : "no",
    ];
  });
  return [header, ...rows].map((cols) => cols.map((col) => `"${(col ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
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

export default function RosterExportControls({ className }: { className?: string }) {
  const draft = useSelector((state: RootState) => state.roster.draft);
  const payload = useMemo(() => buildExportPayload(draft), [draft]);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const buttonId = useId();

  const handleExportJson = () => {
    const filename = `${payload.roster.name.replace(/\s+/g, "-").toLowerCase()}-roster.json`;
    triggerDownload(filename, JSON.stringify(payload, null, 2), "application/json");
  };

  const handleExportCsv = () => {
    const filename = `${payload.roster.name.replace(/\s+/g, "-").toLowerCase()}-roster.csv`;
    const csv = buildCsvExport(payload);
    triggerDownload(filename, csv, "text/csv");
  };

  const handleExportPdf = () => {
    const filename = `${payload.roster.name.replace(/\s+/g, "-").toLowerCase()}-roster.pdf`;
    const pdf = buildRosterPdf(payload);
    triggerDownload(filename, pdf, "application/pdf");
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

  return (
    <section className={className} aria-label="Roster export controls">
      <div className="relative rounded-2xl border border-amber-300/30 bg-slate-900/70 p-4 text-amber-100 shadow shadow-amber-900/10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
          Export roster
        </h3>
        <p className="mt-2 text-xs text-amber-200/70">
          Download the current roster draft in multiple formats or export the list of units you
          still need to buy.
        </p>

        <div className="mt-4">
          <Button
            ref={buttonRef}
            variant="primary"
            size="sm"
            onClick={() => setMenuOpen((prev) => !prev)}
            id={buttonId}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-controls={isMenuOpen ? menuId : undefined}
            leftIcon={
              <Download
                aria-hidden
                className="h-4 w-4"
                strokeWidth={2}
              />
            }
          >
            Download roster
          </Button>

          {isMenuOpen ? (
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-labelledby={buttonId}
              className="absolute z-10 mt-2 w-56 rounded-lg border border-amber-300/40 bg-slate-900/95 p-2 text-sm shadow-lg shadow-amber-900/20"
            >
              <button
                role="menuitem"
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-amber-100 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                onClick={() => {
                  setMenuOpen(false);
                  handleExportJson();
                }}
              >
                JSON
                <span aria-hidden>→</span>
              </button>
              <button
                role="menuitem"
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-amber-100 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                onClick={() => {
                  setMenuOpen(false);
                  handleExportPdf();
                }}
              >
                PDF
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
                CSV
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
                Print
                <span aria-hidden>→</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
