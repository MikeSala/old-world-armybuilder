import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import {
  rosterInitialState,
} from "@/lib/store/slices/rosterSlice";
import { normalizeRosterEntry } from "@/lib/roster/normalizeEntry";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import {
  buildUnitStatIndex,
  getArmyUnitStats,
  normalizeUnitStatKey,
  type UnitStatLine,
  type StatValue,
} from "@/lib/data/domain/units/units-stats";
import { resolveOptionGroupKey, type OptionGroupKey } from "@/lib/utils/rosterFormatting";

const selectDraft = (state: RootState) => state.roster?.draft ?? rosterInitialState.draft;

export type NormalizedRosterEntry = ReturnType<typeof normalizeRosterEntry>;

export type RosterEntryWithStats = NormalizedRosterEntry & {
  stats: UnitStatLine | null;
  mountStats: UnitStatLine[];
};

const STAT_FIELD_KEYS = ["M", "WS", "BS", "S", "T", "W", "I", "A", "Ld"] as const;
type StatKey = (typeof STAT_FIELD_KEYS)[number];

const SUMMARY_GROUP_ORDER: OptionGroupKey[] = [
  "command",
  "equipment",
  "armor",
  "mounts",
  "options",
];

const extractStatValues = (
  source: Partial<Record<StatKey, StatValue>> | null | undefined
): Record<StatKey, StatValue | undefined> => {
  return STAT_FIELD_KEYS.reduce((acc, key) => {
    acc[key] = source ? source[key] : undefined;
    return acc;
  }, {} as Record<StatKey, StatValue | undefined>);
};

const formatArray = (values: string[] | undefined) => {
  if (!Array.isArray(values) || values.length === 0) return null;
  return values.filter((item) => typeof item === "string" && item.trim().length > 0);
};

const hasInlineStats = (line: Partial<Record<StatKey, StatValue>>): boolean => {
  return STAT_FIELD_KEYS.some((key) => {
    const value = line[key];
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (value === "-") return false;
    return true;
  });
};

export type RosterUnitStatRow = {
  label: string;
  values: Record<StatKey, StatValue | undefined>;
};

export type RosterUnitOptionSummaryItem = {
  id?: string;
  name: string;
  note?: string;
};

export type RosterUnitOptionSummary = {
  group: string;
  items: RosterUnitOptionSummaryItem[];
  cost: number;
};

export type RosterUnitMetaRow = {
  label: string;
  value: string;
};

export type RosterUnitDetail = {
  id: string;
  unitId: string;
  name: string;
  totalPoints: number;
  basePoints: number;
  pointsPerModel: number;
  unitSize: number;
  notes?: string;
  owned: boolean;
  statRows: RosterUnitStatRow[];
  optionSummaries: RosterUnitOptionSummary[];
  sidebarRules: string[];
  sidebarRulesPl?: string[];
  sidebarRulesDe?: string[];
  sidebarRulesFr?: string[];
  sidebarRulesIt?: string[];
  sidebarMeta: RosterUnitMetaRow[];
  unitRole: string | null;
  unitRolePl?: string | null;
  unitRoleDe?: string | null;
  unitRoleFr?: string | null;
  unitRoleIt?: string | null;
};

const buildOptionSummaries = (entry: NormalizedRosterEntry): RosterUnitOptionSummary[] => {
  const grouped = new Map<string, RosterUnitOptionSummary>();
  entry.options.forEach((option) => {
    const rawGroup = typeof option.group === "string" ? option.group : "";
    const groupKey = resolveOptionGroupKey(rawGroup);
    const group = groupKey ?? rawGroup.trim();
    const bucket = grouped.get(group) ?? grouped.set(group, { group, items: [], cost: 0 }).get(group)!;
    if (option.name) {
      bucket.items.push({
        id: option.sourceId,
        name: option.name,
        note: option.note,
      });
    }
    bucket.cost += option.points ?? 0;
  });
  return Array.from(grouped.values()).sort((a, b) => {
    const aKey = resolveOptionGroupKey(a.group);
    const bKey = resolveOptionGroupKey(b.group);
    const aIdx = aKey ? SUMMARY_GROUP_ORDER.indexOf(aKey) : -1;
    const bIdx = bKey ? SUMMARY_GROUP_ORDER.indexOf(bKey) : -1;
    const safeA = aIdx === -1 ? SUMMARY_GROUP_ORDER.length : aIdx;
    const safeB = bIdx === -1 ? SUMMARY_GROUP_ORDER.length : bIdx;
    return safeA - safeB;
  });
};

const buildSidebarRules = (stats: UnitStatLine | null, mountStats: UnitStatLine[]) => {
  const baseRules = formatArray(stats?.specialRules) ?? [];
  const mountRules = mountStats.flatMap((mount) => formatArray(mount.specialRules) ?? []);
  const baseRulesPl = formatArray(stats?.specialRules_pl) ?? [];
  const mountRulesPl = mountStats.flatMap((mount) => formatArray(mount.specialRules_pl) ?? []);
  const baseRulesDe = formatArray(stats?.specialRules_de) ?? [];
  const mountRulesDe = mountStats.flatMap((mount) => formatArray(mount.specialRules_de) ?? []);
  const baseRulesFr = formatArray(stats?.specialRules_fr) ?? [];
  const mountRulesFr = mountStats.flatMap((mount) => formatArray(mount.specialRules_fr) ?? []);
  const baseRulesIt = formatArray(stats?.specialRules_it) ?? [];
  const mountRulesIt = mountStats.flatMap((mount) => formatArray(mount.specialRules_it) ?? []);

  const rules = Array.from(new Set([...baseRules, ...mountRules]));
  const rulesPl = Array.from(new Set([...baseRulesPl, ...mountRulesPl]));
  const rulesDe = Array.from(new Set([...baseRulesDe, ...mountRulesDe]));
  const rulesFr = Array.from(new Set([...baseRulesFr, ...mountRulesFr]));
  const rulesIt = Array.from(new Set([...baseRulesIt, ...mountRulesIt]));

  return {
    rules,
    rulesPl: rulesPl.length ? rulesPl : undefined,
    rulesDe: rulesDe.length ? rulesDe : undefined,
    rulesFr: rulesFr.length ? rulesFr : undefined,
    rulesIt: rulesIt.length ? rulesIt : undefined,
  };
};

const buildSidebarMeta = (stats: UnitStatLine | null, mountStats: UnitStatLine[]): RosterUnitMetaRow[] => {
  const rows: RosterUnitMetaRow[] = [];
  const addRow = (label: string | undefined | null, value: StatValue | undefined | null) => {
    if (!label || label.trim().length === 0) return;
    if (value === undefined || value === null || value === "") return;
    rows.push({ label, value: String(value) });
  };

  if (stats) {
    addRow("Unit Size", stats.unitSize);
    addRow("Base Size", stats.baseSize);
    addRow("Armour Value", stats.armourValue);
  }

  mountStats.forEach((mount) => {
    const mountLabel =
      typeof mount.name === "string" && mount.name.trim().length > 0
        ? mount.name
        : typeof mount.unit === "string" && mount.unit.trim().length > 0
        ? mount.unit
        : "Mount";
    addRow(`${mountLabel} Unit Size`, mount.unitSize);
    addRow(`${mountLabel} Base Size`, mount.baseSize);
    addRow(`${mountLabel} Armour Value`, mount.armourValue);
  });

  const unique: RosterUnitMetaRow[] = [];
  const seen = new Set<string>();
  rows.forEach((row) => {
    const key = `${row.label}::${row.value}`;
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(row);
  });
  return unique;
};

const buildStatRows = (
  entry: NormalizedRosterEntry,
  stats: UnitStatLine | null,
  mountStats: UnitStatLine[]
): RosterUnitStatRow[] => {
  type InternalRow = RosterUnitStatRow & { valueKey: string };
  const rows: InternalRow[] = [];
  const seenPairs = new Set<string>();
  const valueCounts = new Map<string, number>();

  const pushRow = (label: string, values: Record<StatKey, StatValue | undefined>) => {
    const valueKey = STAT_FIELD_KEYS.map((key) => values[key] ?? "").join("|");
    const compositeKey = `${label}::${valueKey}`;
    if (seenPairs.has(compositeKey)) return;
    seenPairs.add(compositeKey);
    valueCounts.set(valueKey, (valueCounts.get(valueKey) ?? 0) + 1);
    rows.push({ label, values, valueKey });
  };

  const statsName = stats?.name ?? stats?.unit ?? entry.name;
  if (stats) {
    const baseValues = extractStatValues(stats);
    pushRow(statsName, baseValues);
    const profileList = Array.isArray(stats.profiles) ? stats.profiles : [];
    profileList.forEach((profile, index) => {
      const label =
        typeof profile.name === "string" && profile.name.trim().length > 0
          ? profile.name
          : `Profile ${index + 1}`;
      pushRow(label, extractStatValues(profile));
    });
  } else {
    pushRow(statsName, extractStatValues(undefined));
  }

  mountStats.forEach((mount, index) => {
    const mountLabel =
      typeof mount.name === "string" && mount.name.trim().length > 0
        ? mount.name
        : typeof mount.unit === "string" && mount.unit.trim().length > 0
        ? mount.unit
        : `Mount ${index + 1}`;
    const mountValues = extractStatValues(mount);
    if (hasInlineStats(mount)) pushRow(mountLabel, mountValues);
    if (Array.isArray(mount.profiles)) {
      mount.profiles.forEach((profile, profileIndex) => {
        const label =
          typeof profile.name === "string" && profile.name.trim().length > 0
            ? profile.name
            : `${mountLabel} ${profileIndex + 1}`;
        pushRow(label, extractStatValues(profile));
      });
    }
  });

  return rows
    .filter((row) => {
      if (!stats) return true;
      const statsNameLocal = stats.name ?? stats.unit ?? entry.name;
      const isBaseRow = row.label === statsNameLocal;
      if (!isBaseRow) return true;
      const duplicates = valueCounts.get(row.valueKey) ?? 0;
      return duplicates <= 1;
    })
    .map(({ valueKey: _ignore, ...row }) => row);
};

const buildUnitRole = (stats: UnitStatLine | null): string | null => {
  const unitCategory = typeof stats?.unitCategory === "string" ? stats.unitCategory : undefined;
  const troopType = typeof stats?.troopType === "string" ? stats.troopType : undefined;
  const role = [unitCategory, troopType]
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .join(", ");
  return role.length ? role : null;
};

const buildUnitRolePl = (stats: UnitStatLine | null): string | null => {
  const unitCategory = typeof stats?.unitCategory_pl === "string" ? stats.unitCategory_pl : undefined;
  const troopType = typeof stats?.troopType_pl === "string" ? stats.troopType_pl : undefined;
  const role = [unitCategory, troopType]
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .join(", ");
  return role.length ? role : null;
};

const buildUnitRoleDe = (stats: UnitStatLine | null): string | null => {
  const unitCategory = typeof stats?.unitCategory_de === "string" ? stats.unitCategory_de : undefined;
  const troopType = typeof stats?.troopType_de === "string" ? stats.troopType_de : undefined;
  const role = [unitCategory, troopType]
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .join(", ");
  return role.length ? role : null;
};

const buildUnitRoleFr = (stats: UnitStatLine | null): string | null => {
  const unitCategory = typeof stats?.unitCategory_fr === "string" ? stats.unitCategory_fr : undefined;
  const troopType = typeof stats?.troopType_fr === "string" ? stats.troopType_fr : undefined;
  const role = [unitCategory, troopType]
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .join(", ");
  return role.length ? role : null;
};

const buildUnitRoleIt = (stats: UnitStatLine | null): string | null => {
  const unitCategory = typeof stats?.unitCategory_it === "string" ? stats.unitCategory_it : undefined;
  const troopType = typeof stats?.troopType_it === "string" ? stats.troopType_it : undefined;
  const role = [unitCategory, troopType]
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .join(", ");
  return role.length ? role : null;
};

const buildUnitDetail = (entry: RosterEntryWithStats): RosterUnitDetail => {
  const statRows = buildStatRows(entry, entry.stats, entry.mountStats);
  const optionSummaries = buildOptionSummaries(entry);
  const {
    rules: sidebarRules,
    rulesPl: sidebarRulesPl,
    rulesDe: sidebarRulesDe,
    rulesFr: sidebarRulesFr,
    rulesIt: sidebarRulesIt,
  } = buildSidebarRules(
    entry.stats,
    entry.mountStats
  );
  const sidebarMeta = buildSidebarMeta(entry.stats, entry.mountStats);
  const unitRole = buildUnitRole(entry.stats);
  const unitRolePl = buildUnitRolePl(entry.stats);
  const unitRoleDe = buildUnitRoleDe(entry.stats);
  const unitRoleFr = buildUnitRoleFr(entry.stats);
  const unitRoleIt = buildUnitRoleIt(entry.stats);

  return {
    id: entry.id,
    unitId: entry.unitId,
    name: entry.name,
    totalPoints: entry.totalPoints,
    basePoints: entry.basePoints,
    pointsPerModel: entry.pointsPerModel,
    unitSize: entry.unitSize,
    notes: entry.notes,
    owned: entry.owned,
    statRows,
    optionSummaries,
    sidebarRules,
    sidebarRulesPl,
    sidebarRulesDe,
    sidebarRulesFr,
    sidebarRulesIt,
    sidebarMeta,
    unitRole,
    unitRolePl,
    unitRoleDe,
    unitRoleFr,
    unitRoleIt,
  };
};

export type RosterDetailView = {
  name: string;
  description: string;
  armyId: string | null;
  compositionId: string | null;
  pointsLimit: number;
  entries: RosterEntryWithStats[];
  entriesByCategory: Partial<Record<CategoryKey, RosterEntryWithStats[]>>;
  entryDetailsByCategory: Partial<Record<CategoryKey, RosterUnitDetail[]>>;
  totalsByCategory: Partial<Record<CategoryKey, number>>;
  totalPoints: number;
  statsAvailable: boolean;
};

export const ORDERED_CATEGORIES: CategoryKey[] = [
  "characters",
  "core",
  "special",
  "rare",
  "mercenaries",
  "allies",
];

const expandKeyVariants = (raw: string | null | undefined): string[] => {
  if (!raw || typeof raw !== "string") return [];
  const base = normalizeUnitStatKey(raw);
  if (!base) return [];

  const variants = new Set<string>();
  variants.add(base);

  const tryAdd = (candidate: string | null | undefined) => {
    if (!candidate) return;
    if (candidate.length === 0) return;
    variants.add(candidate);
  };

  if (base.endsWith("ies") && base.length > 3) {
    tryAdd(`${base.slice(0, -3)}y`);
  }

  if (base.endsWith("men") && base.length > 3) {
    tryAdd(`${base.slice(0, -3)}man`);
  }

  if (base.endsWith("ves") && base.length > 3) {
    tryAdd(`${base.slice(0, -3)}f`);
  }

  if (base.endsWith("s") && base.length > 3) {
    tryAdd(base.slice(0, -1));
  }

  return Array.from(variants);
};

export const selectRosterDetailView = createSelector([selectDraft], (draft): RosterDetailView => {
  const statsList = getArmyUnitStats(draft?.armyId);
  const statsIndex = buildUnitStatIndex(statsList);
  const entries = Array.isArray(draft?.entries) ? draft.entries : [];

  const entriesWithStats = entries.map((entry) => {
    const normalized = normalizeRosterEntry(entry);
    const candidateKeys = new Set<string>();
    expandKeyVariants(normalized.name).forEach((key) => candidateKeys.add(key));
    expandKeyVariants(normalized.unitId).forEach((key) => candidateKeys.add(key));

    let matchedStats: UnitStatLine | undefined;
    for (const candidate of candidateKeys) {
      const found = statsIndex.get(candidate);
      if (found) {
        matchedStats = found;
        break;
      }
    }

    const allowedMountIds = new Set(
      (matchedStats?.mountIds ?? []).map((id) => normalizeUnitStatKey(id))
    );

    const mountStats: UnitStatLine[] = [];
    const seenMounts = new Set<string>();

    normalized.options
      .filter(
        (option) =>
          typeof option.group === "string" &&
          (option.group.toLowerCase().includes("mount") ||
            option.group.toLowerCase().includes("wierzch")) &&
          (typeof option.name === "string" || typeof option.id === "string")
      )
      .forEach((option) => {
        const candidateSources: string[] = [];
        if (typeof option.sourceId === "string" && option.sourceId.trim().length > 0) {
          candidateSources.push(option.sourceId);
        }
        if (typeof option.id === "string" && option.id.trim().length > 0) {
          candidateSources.push(option.id);
        }
        if (typeof option.name === "string" && option.name.trim().length > 0) {
          candidateSources.push(option.name);
        }

        for (const source of candidateSources) {
          const normalizedKey = normalizeUnitStatKey(source);
          if (!normalizedKey) continue;
          if (allowedMountIds.size > 0 && !allowedMountIds.has(normalizedKey)) continue;

          const resolveMount = (key: string, label: string): UnitStatLine | undefined => {
            const found = statsIndex.get(key);
            if (found) return found;
            const fallbackKeys = expandKeyVariants(label);
            for (const candidate of fallbackKeys) {
              const alt = statsIndex.get(candidate);
              if (alt) return alt;
            }
            return undefined;
          };

          const resolved = resolveMount(normalizedKey, source);
          if (!resolved) continue;
          const dedupeKey =
            typeof resolved.id === "string" && resolved.id.trim().length > 0
              ? resolved.id
              : resolved.name ?? resolved.unit ?? normalizedKey;
          const dedupeNormalized = normalizeUnitStatKey(dedupeKey);
          if (seenMounts.has(dedupeNormalized)) break;
          seenMounts.add(dedupeNormalized);
          mountStats.push(resolved);
          break;
        }
      });

    return {
      ...normalized,
      stats: matchedStats ?? null,
      mountStats,
    };
  });

  const totalsByCategory: Partial<Record<CategoryKey, number>> = {};
  const entriesByCategory: Partial<Record<CategoryKey, RosterEntryWithStats[]>> = {};
  const unitDetailsByCategory: Partial<Record<CategoryKey, RosterUnitDetail[]>> = {};
  let totalPoints = 0;

  entriesWithStats.forEach((entry) => {
    const category = entry.category;
    const existingList = entriesByCategory[category] ?? [];
    existingList.push(entry);
    entriesByCategory[category] = existingList;

    const detailList = unitDetailsByCategory[category] ?? [];
    detailList.push(buildUnitDetail(entry));
    unitDetailsByCategory[category] = detailList;

    const previousTotal = totalsByCategory[category] ?? 0;
    totalsByCategory[category] = previousTotal + entry.totalPoints;
    totalPoints += entry.totalPoints;
  });

  const sortedEntriesByCategory = ORDERED_CATEGORIES.reduce<
    Partial<Record<CategoryKey, RosterEntryWithStats[]>>
  >((acc, category) => {
    if (entriesByCategory[category]?.length) {
      acc[category] = entriesByCategory[category]!;
    }
    return acc;
  }, {});

  const sortedDetailsByCategory = ORDERED_CATEGORIES.reduce<
    Partial<Record<CategoryKey, RosterUnitDetail[]>>
  >((acc, category) => {
    if (unitDetailsByCategory[category]?.length) {
      acc[category] = unitDetailsByCategory[category]!;
    }
    return acc;
  }, {});

  return {
    name: draft?.name ?? "",
    description: draft?.description ?? "",
    armyId: draft?.armyId ?? null,
    compositionId: draft?.compositionId ?? null,
    pointsLimit: draft?.pointsLimit ?? 0,
    entries: entriesWithStats,
    entriesByCategory: sortedEntriesByCategory,
    entryDetailsByCategory: sortedDetailsByCategory,
    totalsByCategory,
    totalPoints,
    statsAvailable: Boolean(statsList && statsList.length > 0),
  };
});
