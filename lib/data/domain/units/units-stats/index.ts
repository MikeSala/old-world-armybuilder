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

export type UnitStatLine = {
  unit?: string;
  name?: string;
  M: StatValue;
  WS: StatValue;
  BS: StatValue;
  S: StatValue;
  T: StatValue;
  W: StatValue;
  I: StatValue;
  A: StatValue;
  Ld: StatValue;
  type?: string | null;
  aliases?: string[];
  unitCategory?: string | null;
  troopType?: string | null;
  baseSize?: string | null;
  unitSize?: StatValue;
  armourValue?: StatValue;
  equipment?: string[];
  specialRules?: string[];
};

type ArmyUnitStats = Record<string, UnitStatLine[]>;

const cast = (payload: unknown): UnitStatLine[] => payload as UnitStatLine[];

export const UNIT_STATS_BY_ARMY: ArmyUnitStats = {
  "beastmen-brayherds": cast(beastmen),
  "kingdom-of-bretonnia": cast(bretonnia),
  "chaos-dwarfs": cast(chaosDwarfs),
  "daemons-of-chaos": cast(daemonsOfChaos),
  "dark-elves": cast(darkElves),
  "dwarfen-mountain-holds": cast(dwarfen),
  "empire-of-man": cast(empire),
  "grand-cathay": cast(grandCathay),
  "high-elf-realms": cast(highElfRealms),
  lizardmen: cast(lizardmen),
  "ogre-kingdoms": cast(ogreKingdoms),
  "orc-and-goblin-tribes": cast(orcAndGoblins),
  skaven: cast(skaven),
  "tomb-kings-of-khemri": cast(tombKings),
  "vampire-counts": cast(vampireCounts),
  "warriors-of-chaos": cast(warriorsOfChaos),
  "wood-elf-realms": cast(woodElves),
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
