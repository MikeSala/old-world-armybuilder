import type {
  ArmyCompositionMap,
  ArmyUnit,
  ArmyUnitOption,
  NormalizedArmyUnit,
  NormalizedArmyUnitOption,
  NormalizedArmyUnits,
} from "./types";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import { toString, toNumber, toBoolean } from "@/lib/utils/typeCoercions";

const CATEGORY_KEYS: CategoryKey[] = ["characters", "core", "special", "rare", "mercenaries", "allies"];

const normalizeNotes = (notes: unknown): Record<string, unknown> | undefined => {
  if (!notes || typeof notes !== "object" || Array.isArray(notes)) return undefined;
  return notes as Record<string, unknown>;
};

const normalizeCompositionMap = (value: unknown): ArmyCompositionMap | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>).map(([key, raw]) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const rule = raw as Record<string, unknown>;
    const category = toString(rule.category);
    const notes = normalizeNotes(rule.notes);
    return [key, { category, notes }];
  });
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries.filter(Boolean) as Array<[string, ArmyCompositionMap[string]]>);
};

const normalizeOption = (option: ArmyUnitOption, index: number, groupKey: string): NormalizedArmyUnitOption => {
  const namePl = toString((option as { name_pl?: unknown }).name_pl);
  const nameDe = toString((option as { name_de?: unknown }).name_de);
  const nameFr = toString((option as { name_fr?: unknown }).name_fr);
  const nameEs = toString((option as { name_es?: unknown }).name_es);
  const nameEn = toString(option.name_en);
  const nameFallback = toString(option.name);
  const id = toString(option.id) ?? (nameEn ? `${groupKey}-${nameEn}-${index}` : `${groupKey}-${index}`);
  const name = nameEn ?? nameFallback ?? `Opcja ${index + 1}`;
  return {
    id,
    name,
    name_de: nameDe ?? undefined,
    name_fr: nameFr ?? undefined,
    name_es: nameEs ?? undefined,
    name_pl: namePl ?? undefined,
    points: toNumber(option.points) ?? 0,
    perModel: toBoolean(option.perModel),
    active: toBoolean(option.active),
    equippedDefault: toBoolean((option as { equippedDefault?: unknown }).equippedDefault),
    notes: normalizeNotes(option.notes),
    note:
      toString((option.notes as Record<string, unknown> | undefined)?.["name_pl"]) ??
      toString((option.notes as Record<string, unknown> | undefined)?.["name_en"]),
    minimum: toNumber(option.minimum),
    maximum: toNumber(option.maximum),
  };
};

const normalizeOptionArray = (
  value: unknown,
  groupKey: string
): NormalizedArmyUnitOption[] => {
  if (!Array.isArray(value) || value.length === 0) return [];
  return value
    .map((item, index) => (item && typeof item === "object" ? normalizeOption(item as ArmyUnitOption, index, groupKey) : null))
    .filter((opt): opt is NormalizedArmyUnitOption => Boolean(opt));
};

export const normalizeArmyUnit = (unit: ArmyUnit, index = 0): NormalizedArmyUnit => {
  const namePl = toString((unit as { name_pl?: unknown }).name_pl);
  const nameDe = toString((unit as { name_de?: unknown }).name_de);
  const nameFr = toString((unit as { name_fr?: unknown }).name_fr);
  const nameEs = toString((unit as { name_es?: unknown }).name_es);
  const nameFallback = toString(unit.name);
  const nameEn = toString(unit.name_en) ?? nameFallback;
  const name = nameEn ?? `Jednostka ${index + 1}`;
  const id =
    toString(unit.id) ??
    (toString(unit.name_en) ? `unit-${unit.name_en}-${index}` : `unit-${index}`);

  return {
    id,
    name_en: nameEn ?? name,
    name_de: nameDe ?? undefined,
    name_fr: nameFr ?? undefined,
    name_es: nameEs ?? undefined,
    name,
    name_pl: namePl ?? undefined,
    points: toNumber(unit.points) ?? 0,
    armyComposition: normalizeCompositionMap(unit.armyComposition),
    command: normalizeOptionArray(unit.command, "command"),
    equipment: normalizeOptionArray(unit.equipment, "equipment"),
    armor: normalizeOptionArray(unit.armor, "armor"),
    mounts: normalizeOptionArray(unit.mounts, "mounts"),
    options: normalizeOptionArray(unit.options, "options"),
    minimum: toNumber(unit.minimum),
    maximum: toNumber(unit.maximum),
    notes: normalizeNotes(unit.notes),
  };
};

export const normalizeArmyUnits = (rawUnits: unknown, category: CategoryKey): NormalizedArmyUnit[] => {
  if (!Array.isArray(rawUnits)) return [];
  return rawUnits
    .map((unit, index) => (unit && typeof unit === "object" ? normalizeArmyUnit(unit as ArmyUnit, index) : null))
    .filter((unit): unit is NormalizedArmyUnit => Boolean(unit));
};

export const normalizeArmyUnitsRaw = (payload: unknown): NormalizedArmyUnits => {
  const result: NormalizedArmyUnits = {};
  CATEGORY_KEYS.forEach((key) => {
    const source = (payload as Record<string, unknown> | undefined)?.[key];
    result[key] = normalizeArmyUnits(source, key);
  });
  return result;
};
