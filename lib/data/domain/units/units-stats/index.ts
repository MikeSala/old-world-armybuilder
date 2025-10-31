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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
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

export type UnitStatProfile = {
  name?: string | null;
} & Record<StatKey, StatValue>;

export type UnitStatLine = {
  id?: string;
  unit?: string;
  name?: string;
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
      const profile: UnitStatProfile = STAT_FIELD_KEYS.reduce<UnitStatProfile>(
        (acc, key) => {
          acc[key] = normalizeStatValue(candidate[key]);
          return acc;
        },
        {
          name: toOptionalString(candidate.name) ?? toOptionalString(candidate.label) ?? toOptionalString(candidate.variant) ?? null,
        } as UnitStatProfile
      );
      return profile;
    })
    .filter((profile): profile is UnitStatProfile => profile !== null);

  return profiles.length > 0 ? profiles : undefined;
};

const normalizeLine = (value: unknown): UnitStatLine | null => {
  if (!isRecord(value)) return null;

  const primaryName = toOptionalString(value.name) ?? toOptionalString(value.unit);
  if (!primaryName) return null;

  const line: UnitStatLine = STAT_FIELD_KEYS.reduce<UnitStatLine>(
    (acc, key) => {
      acc[key] = normalizeStatValue(value[key]);
      return acc;
    },
    {
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
    } as UnitStatLine
  );

  const idValue = toOptionalString((value as Record<string, unknown>).id);
  if (idValue) line.id = idValue;

  const aliases = normalizeStringArray(value.aliases);
  if (aliases) line.aliases = aliases;

  const profiles = normalizeProfiles(value.profiles);
  if (profiles) {
    line.profiles = profiles;
    const hasPrimaryStats = STAT_FIELD_KEYS.some((key) => line[key] !== null);
    if (!hasPrimaryStats) {
      const firstProfile = profiles[0];
      if (firstProfile) {
        STAT_FIELD_KEYS.forEach((key) => {
          if (line[key] === null && firstProfile[key] !== null) {
            line[key] = firstProfile[key];
          }
        });
      }
    }
  }

  const mountIds = normalizeStringArray((value as Record<string, unknown>).mountIds);
  if (mountIds) line.mountIds = mountIds;

  return line;
};

const normalizeUnitStats = (payload: unknown): UnitStatLine[] => {
  const entries: unknown[] | undefined = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray((payload as RawUnitCollection).units)
    ? ((payload as RawUnitCollection).units as unknown[])
    : undefined;

  if (!entries) return [];

  return entries
    .map((entry) => normalizeLine(entry))
    .filter((line): line is UnitStatLine => line !== null);
};

export const UNIT_STATS_BY_ARMY: ArmyUnitStats = {
  "beastmen-brayherds": normalizeUnitStats(beastmen),
  "kingdom-of-bretonnia": normalizeUnitStats(bretonnia),
  "chaos-dwarfs": normalizeUnitStats(chaosDwarfs),
  "daemons-of-chaos": normalizeUnitStats(daemonsOfChaos),
  "dark-elves": normalizeUnitStats(darkElves),
  "dwarfen-mountain-holds": normalizeUnitStats(dwarfen),
  "empire-of-man": normalizeUnitStats(empire),
  "grand-cathay": normalizeUnitStats(grandCathay),
  "high-elf-realms": normalizeUnitStats(highElfRealms),
  lizardmen: normalizeUnitStats(lizardmen),
  "ogre-kingdoms": normalizeUnitStats(ogreKingdoms),
  "orc-and-goblin-tribes": normalizeUnitStats(orcAndGoblins),
  skaven: normalizeUnitStats(skaven),
  "tomb-kings-of-khemri": normalizeUnitStats(tombKings),
  "vampire-counts": normalizeUnitStats(vampireCounts),
  "warriors-of-chaos": normalizeUnitStats(warriorsOfChaos),
  "wood-elf-realms": normalizeUnitStats(woodElves),
};

export const AVAILABLE_STATS_ARMIES = Object.keys(UNIT_STATS_BY_ARMY);

export const getArmyUnitStats = (armyId: string | null | undefined): UnitStatLine[] | undefined => {
  if (!armyId) return undefined;
  return UNIT_STATS_BY_ARMY[armyId] ?? undefined;
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

export const buildUnitStatIndex = (stats: UnitStatLine[] | undefined) => {
  const map = new Map<string, UnitStatLine>();
  if (!stats) return map;

  stats.forEach((line) => {
    const rawName = typeof line.unit === "string" ? line.unit : line.name;
    if (!rawName || typeof rawName !== "string") return;
    const primaryKey = normalizeUnitStatKey(rawName);
    if (!primaryKey) return;
    registerKey(map, primaryKey, line);

    if (line.id) {
      const idKey = normalizeUnitStatKey(line.id);
      if (idKey) registerKey(map, idKey, line);
    }

    if (Array.isArray(line.aliases)) {
      line.aliases.forEach((alias) => {
        if (typeof alias !== "string" || alias.trim().length === 0) return;
        const aliasKey = normalizeUnitStatKey(alias);
        if (!aliasKey) return;
        registerKey(map, aliasKey, line);
      });
    }
  });

  return map;
};

export type { ArmyUnitStats, StatValue };
