"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
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
    basePoints: number;
    options: Array<{ group: string; name: string; points: number; note?: string }>;
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
    const basePoints = typeof entry.basePoints === "number" ? entry.basePoints : 0;
    const totalPoints =
      typeof entry.totalPoints === "number" ? entry.totalPoints : basePoints + optionsPoints;

    return {
      id: entry.id,
      unitId: entry.unitId,
      name: entry.name,
      category: entry.category,
      basePoints,
      options: options.map((opt) => ({
        group: opt.group,
        name: opt.name,
        points: opt.points,
        note: opt.note,
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
    lines.push(`  Base cost: ${entry.basePoints} pts`);
    if (entry.options.length > 0) {
      entry.options.forEach((opt) => {
        lines.push(`  - ${opt.group}: ${opt.name} (${opt.points ? `${opt.points} pts` : "free"})`);
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

function buildMissingUnitsText(payload: ExportPayload): string {
  const missing = payload.entries.filter((entry) => !entry.owned);
  if (missing.length === 0) {
    return `All units in "${payload.roster.name}" are marked as owned.\nGenerated: ${payload.metadata.generatedAt}\n`;
  }

  const lines: string[] = [];
  lines.push(`# Missing Units — ${payload.roster.name}`);
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
  lines.push("");
  lines.push("## Units to acquire");
  missing.forEach((entry) => {
    lines.push(`- ${entry.name} (${entry.category}) — ${entry.totalPoints} pts total`);
    lines.push(`  Base cost: ${entry.basePoints} pts`);
    if (entry.options.length > 0) {
      entry.options.forEach((opt) => {
        lines.push(`  - ${opt.group}: ${opt.name} (${opt.points ? `${opt.points} pts` : "free"})`);
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
  const missingUnitsCount = useMemo(
    () => payload.entries.filter((entry) => !entry.owned).length,
    [payload]
  );

  const handleExportJson = () => {
    const filename = `${payload.roster.name.replace(/\s+/g, "-").toLowerCase()}-roster.json`;
    triggerDownload(filename, JSON.stringify(payload, null, 2), "application/json");
  };

  const handleExportText = () => {
    const filename = `${payload.roster.name.replace(/\s+/g, "-").toLowerCase()}-roster.txt`;
    const text = buildTextExport(payload);
    triggerDownload(filename, text, "text/plain");
  };

  const handleExportMissing = () => {
    const filename = `${payload.roster.name.replace(/\s+/g, "-").toLowerCase()}-missing-units.txt`;
    const text = buildMissingUnitsText(payload);
    triggerDownload(filename, text, "text/plain");
  };

  return (
    <section className={className} aria-label="Roster export controls">
      <div className="rounded-2xl border border-amber-300/30 bg-slate-900/70 p-4 text-amber-100 shadow shadow-amber-900/10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
          Export roster
        </h3>
        <p className="mt-2 text-xs text-amber-200/70">
          Download the current roster draft as JSON, as a readable summary, or export the list of units you still need to buy.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button variant="primary" size="sm" onClick={handleExportJson}>
            Download JSON
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportText}>
            Download Text
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportMissing}
            disabled={missingUnitsCount === 0}
          >
            Missing Units ({missingUnitsCount})
          </Button>
        </div>
      </div>
    </section>
  );
}
