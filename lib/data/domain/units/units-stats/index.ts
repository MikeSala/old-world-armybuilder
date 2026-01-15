import beastmen from "./beastmen-brayherds-stats.json";
import bretonnia from "./bretonnia-stats.json";
import chaosDwarfs from "./chaos-dwarfs-stats.json";
import daemonsOfChaos from "./daemons-of-chaos-stats.json";
import darkElves from "./dark-elves-stats.json";
import dwarfen from "./dwarfen-mountain-holds-stats.json";
import empire from "./empire-of-men-stats.json";
import grandCathay from "./grand-cathay-stats.json";
import highElfRealms from "./high-elfs-realms-stats.json";
import lizardmen from "./lizardmen-stats.json";
import ogreKingdoms from "./ogre-kingdoms-stats.json";
import orcAndGoblins from "./orc-and-goblins-tribe-stats.json";
import skaven from "./skaven-stats.json";
import tombKings from "./tomb-kings-of-khemri-stats.json";
import vampireCounts from "./vampire-counts-stats.json";
import warriorsOfChaos from "./warriors-of-chaos-stats.json";
import woodElves from "./wood-elves-stats.json";

type StatValue = number | string | null;

const STAT_FIELD_KEYS = ["M", "WS", "BS", "S", "T", "W", "I", "A", "Ld"] as const;
type StatKey = (typeof STAT_FIELD_KEYS)[number];

type RawUnitCollection = {
  units?: unknown;
};

type RawStatsByArmy = Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const firstNonEmptyString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    const normalized = toOptionalString(value);
    if (normalized) return normalized;
  }
  return undefined;
};

const normalizeStatValue = (value: unknown): StatValue => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  return null;
};

const normalizeStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const result = value
    .map((item) => (typeof item === "string" ? item.trim() : null))
    .filter((item): item is string => Boolean(item && item.length > 0));
  return result.length > 0 ? result : undefined;
};

const pickStats = (source: Record<string, unknown>): Record<StatKey, StatValue> => {
  const stats = {} as Record<StatKey, StatValue>;
  STAT_FIELD_KEYS.forEach((key) => {
    stats[key] = normalizeStatValue(source[key]);
  });
  return stats;
};

export type UnitStatProfile = {
  name?: string | null;
} & Record<StatKey, StatValue>;

export type UnitStatLine = {
  id?: string;
  unit?: string;
  name?: string;
  name_pl?: string;
  type?: string | null;
  aliases?: string[];
  unitCategory?: string | null;
  troopType?: string | null;
  baseSize?: string | null;
  unitSize?: StatValue;
  armourValue?: StatValue;
  equipment?: string[];
  specialRules?: string[];
  profiles?: UnitStatProfile[];
  mountIds?: string[];
} & Record<StatKey, StatValue>;

type ArmyUnitStats = Record<string, UnitStatLine[]>;

const normalizeProfiles = (value: unknown): UnitStatProfile[] | undefined => {
  if (!Array.isArray(value)) return undefined;

  const profiles = value
    .map((candidate) => {
      if (!isRecord(candidate)) return null;
      return {
        ...pickStats(candidate),
        name: firstNonEmptyString(candidate.name, candidate.label, candidate.variant) ?? null,
      } as UnitStatProfile;
    })
    .filter((profile): profile is UnitStatProfile => profile !== null);

  return profiles.length > 0 ? profiles : undefined;
};

const fillMissingStatsFromProfile = (line: UnitStatLine, profile: UnitStatProfile) => {
  STAT_FIELD_KEYS.forEach((key) => {
    if (line[key] === null && profile[key] !== null) {
      line[key] = profile[key];
    }
  });
};

const normalizeLine = (value: unknown): UnitStatLine | null => {
  if (!isRecord(value)) return null;

  const primaryName = firstNonEmptyString(value.name, value.unit);
  if (!primaryName) return null;

  const line: UnitStatLine = {
    ...pickStats(value),
    unit: toOptionalString(value.unit),
    name: primaryName,
    type: toOptionalString(value.type) ?? null,
    unitCategory: toOptionalString(value.unitCategory) ?? null,
    troopType: toOptionalString(value.troopType) ?? null,
    baseSize: toOptionalString(value.baseSize) ?? null,
    unitSize: normalizeStatValue(value.unitSize),
    armourValue: normalizeStatValue(value.armourValue),
    equipment: normalizeStringArray(value.equipment),
    specialRules: normalizeStringArray(value.specialRules),
  };

  const namePl = toOptionalString(value.name_pl);
  if (namePl) line.name_pl = namePl;

  const idValue = toOptionalString(value.id);
  if (idValue) line.id = idValue;

  const aliases = normalizeStringArray(value.aliases);
  if (aliases) line.aliases = aliases;

  const profiles = normalizeProfiles(value.profiles);
  if (profiles) {
    line.profiles = profiles;
    const hasPrimaryStats = STAT_FIELD_KEYS.some((key) => line[key] !== null);
    if (!hasPrimaryStats && profiles[0]) {
      fillMissingStatsFromProfile(line, profiles[0]);
    }
  }

  const mountIds = normalizeStringArray(value.mountIds);
  if (mountIds) line.mountIds = mountIds;

  return line;
};

const getEntries = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload) && Array.isArray((payload as RawUnitCollection).units)) {
    return (payload as RawUnitCollection).units as unknown[];
  }
  return [];
};

const normalizeUnitStats = (payload: unknown): UnitStatLine[] => {
  return getEntries(payload)
    .map((entry) => normalizeLine(entry))
    .filter((line): line is UnitStatLine => line !== null);
};

const RAW_STATS_BY_ARMY: RawStatsByArmy = {
  "beastmen-brayherds": beastmen,
  "kingdom-of-bretonnia": bretonnia,
  "chaos-dwarfs": chaosDwarfs,
  "daemons-of-chaos": daemonsOfChaos,
  "dark-elves": darkElves,
  "dwarfen-mountain-holds": dwarfen,
  "empire-of-man": empire,
  "grand-cathay": grandCathay,
  "high-elf-realms": highElfRealms,
  lizardmen,
  "ogre-kingdoms": ogreKingdoms,
  "orc-and-goblin-tribes": orcAndGoblins,
  skaven,
  "tomb-kings-of-khemri": tombKings,
  "vampire-counts": vampireCounts,
  "warriors-of-chaos": warriorsOfChaos,
  "wood-elf-realms": woodElves,
};

const normalizeArmyStats = (rawStats: RawStatsByArmy): ArmyUnitStats =>
  Object.entries(rawStats).reduce<ArmyUnitStats>((acc, [armyId, payload]) => {
    acc[armyId] = normalizeUnitStats(payload);
    return acc;
  }, {} as ArmyUnitStats);

export const UNIT_STATS_BY_ARMY: ArmyUnitStats = normalizeArmyStats(RAW_STATS_BY_ARMY);

export const AVAILABLE_STATS_ARMIES = Object.keys(UNIT_STATS_BY_ARMY);

const STATS_ARMY_ALIASES: Record<string, string[]> = {
  beastmen: ["beastmen-brayherds"],
  "orc-goblin-tribes": ["orc-and-goblin-tribes"],
};

const resolveStatsArmyId = (armyId: string | null | undefined): string | null => {
  if (!armyId) return null;
  if (UNIT_STATS_BY_ARMY[armyId]) return armyId;
  const aliasMatch = STATS_ARMY_ALIASES[armyId]?.find((candidate) => UNIT_STATS_BY_ARMY[candidate]);
  return aliasMatch ?? null;
};

export const getArmyUnitStats = (armyId: string | null | undefined): UnitStatLine[] | undefined => {
  const resolved = resolveStatsArmyId(armyId);
  if (!resolved) return undefined;
  return UNIT_STATS_BY_ARMY[resolved];
};

const NORMALIZE_REGEX = /[^a-z0-9]/g;
const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

export const normalizeUnitStatKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .replace(NORMALIZE_REGEX, "");

const registerKey = (map: Map<string, UnitStatLine>, key: string, line: UnitStatLine) => {
  if (!key || map.has(key)) return;
  map.set(key, line);
};

const registerNames = (
  map: Map<string, UnitStatLine>,
  line: UnitStatLine,
  names: Array<string | undefined>
) => {
  names.forEach((name) => {
    if (!name) return;
    const key = normalizeUnitStatKey(name);
    if (key) registerKey(map, key, line);
  });
};

export const buildUnitStatIndex = (stats: UnitStatLine[] | undefined) => {
  const map = new Map<string, UnitStatLine>();
  if (!stats) return map;

  stats.forEach((line) => {
    registerNames(map, line, [
      typeof line.unit === "string" ? line.unit : line.name,
      line.name,
      line.name_pl,
      line.id,
      ...(line.aliases ?? []),
    ]);
  });

  return map;
};

export type { ArmyUnitStats, StatValue };
