import { ARMIES } from "@/lib/data/armies/armies";
import {
  UNIT_STATS_BY_ARMY,
  type UnitStatLine,
  normalizeUnitStatKey,
} from "./index";

export type UnitSearchResult = {
  statsArmyId: string;
  armyId: string | null;
  armyName: string;
  line: UnitStatLine;
};

const STATS_TO_ARMY_MAP: Record<string, string | null> = {
  "beastmen-brayherds": "beastmen",
  "kingdom-of-bretonnia": "kingdom-of-bretonnia",
  "chaos-dwarfs": "chaos-dwarfs",
  "daemons-of-chaos": "daemons-of-chaos",
  "dark-elves": "dark-elves",
  "dwarfen-mountain-holds": "dwarfen-mountain-holds",
  "empire-of-man": "empire-of-man",
  "grand-cathay": "grand-cathay",
  "high-elfs-realms": "high-elf-realms",
  lizardmen: "lizardmen",
  "ogre-kingdoms": "ogre-kingdoms",
  "orc-and-goblin-tribes": "orc-goblin-tribes",
  skaven: "skaven",
  "tomb-kings-of-khemri": "tomb-kings-of-khemri",
  "vampire-counts": "vampire-counts",
  "warriors-of-chaos": "warriors-of-chaos",
  "wood-elf-realms": "wood-elf-realms",
};

const armyNameById = new Map<string, string>();
ARMIES.forEach((army) => {
  armyNameById.set(army.id, army.name);
});

const formatStatsArmyName = (statsId: string): string =>
  statsId
    .split("-")
    .map((part) => (part.length ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");

type SearchEntry = UnitSearchResult & {
  tokens: string[];
};

const createTokens = (line: UnitStatLine): string[] => {
  const tokens = new Set<string>();
  const push = (value: string | null | undefined) => {
    if (!value) return;
    const normalized = normalizeUnitStatKey(value);
    if (normalized.length === 0) return;
    tokens.add(normalized);
    value
      .split(/\s+/)
      .map((part) => normalizeUnitStatKey(part))
      .filter(Boolean)
      .forEach((part) => tokens.add(part));
  };

  push(line.name ?? line.unit ?? null);
  push(line.unit);
  push(line.type ?? null);
  push(line.troopType ?? null);

  if (Array.isArray(line.aliases)) {
    line.aliases.forEach((alias) => push(alias));
  }

  return Array.from(tokens);
};

const UNIT_SEARCH_INDEX: SearchEntry[] = Object.entries(UNIT_STATS_BY_ARMY).flatMap(
  ([statsArmyId, units]) => {
    const mappedArmyId = STATS_TO_ARMY_MAP[statsArmyId] ?? null;
    const armyName = mappedArmyId
      ? armyNameById.get(mappedArmyId) ?? formatStatsArmyName(statsArmyId)
      : formatStatsArmyName(statsArmyId);

    return units.map((line) => ({
      statsArmyId,
      armyId: mappedArmyId,
      armyName,
      line,
      tokens: createTokens(line),
    }));
  }
);

const dedupeResults = (results: SearchEntry[]): SearchEntry[] => {
  const seen = new Set<string>();
  const ordered: SearchEntry[] = [];
  results.forEach((entry) => {
    const key = `${entry.statsArmyId}::${entry.line.name ?? entry.line.unit ?? "unknown"}`;
    if (seen.has(key)) return;
    seen.add(key);
    ordered.push(entry);
  });
  return ordered;
};

export const searchUnitStats = (query: string, limit = 25): UnitSearchResult[] => {
  if (!query) return [];
  const normalizedQuery = normalizeUnitStatKey(query);
  if (!normalizedQuery) return [];

  const matches = UNIT_SEARCH_INDEX.filter((entry) =>
    entry.tokens.some((token) => token.includes(normalizedQuery))
  );

  return dedupeResults(matches)
    .slice(0, limit)
    .map(({ tokens: _tokens, ...rest }) => rest);
};

export const getAllUnitStats = (): UnitSearchResult[] =>
  UNIT_SEARCH_INDEX.map(({ tokens: _tokens, ...rest }) => rest);
