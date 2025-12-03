import type {
  ArmyCompositionMap,
  ArmyUnit,
  ArmyUnitOption,
  NormalizedArmyUnit,
  NormalizedArmyUnitOption,
  NormalizedArmyUnits,
} from "./types";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

const CATEGORY_KEYS: CategoryKey[] = ["characters", "core", "special", "rare", "mercenaries", "allies"];

const toString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toNumber = (value: unknown): number | undefined => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return undefined;
  return num;
};

const toBoolean = (value: unknown): boolean => Boolean(value);

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
  const id =
    toString(option.id) ??
    (toString(option.name_en) ? `${groupKey}-${option.name_en}-${index}` : `${groupKey}-${index}`);
  const name = toString(option.name_en) ?? toString(option.name) ?? `Option ${index + 1}`;
  return {
    id,
    name,
    points: toNumber(option.points) ?? 0,
    perModel: toBoolean(option.perModel),
    active: toBoolean(option.active),
    equippedDefault: toBoolean((option as { equippedDefault?: unknown }).equippedDefault),
    notes: normalizeNotes(option.notes),
    note: toString((option.notes as Record<string, unknown> | undefined)?.["name_en"]),
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
  const name = toString(unit.name_en) ?? toString(unit.name) ?? `Unit ${index + 1}`;
  const id =
    toString(unit.id) ??
    (toString(unit.name_en) ? `unit-${unit.name_en}-${index}` : `unit-${index}`);

  return {
    id,
    name_en: name,
    name: toString(unit.name),
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
