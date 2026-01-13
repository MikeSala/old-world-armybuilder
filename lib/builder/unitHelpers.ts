import type { NormalizedArmyUnit as ArmyUnit } from "@/lib/data/catalog/types";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import { translateNameForDict, translateTextForDict } from "@/lib/i18n/translateLocale";
import { getOptionGroupLabel } from "@/lib/utils/rosterFormatting";

export type OptionSourceKey = "command" | "equipment" | "armor" | "options" | "mounts";

export type UnitOptionItem = {
  id: string;
  label: string;
  labelPl?: string;
  labelDe?: string;
  labelFr?: string;
  labelEs?: string;
  points: number;
  note?: string;
  notePl?: string;
  noteDe?: string;
  noteFr?: string;
  noteEs?: string;
  defaultSelected?: boolean;
  perModel?: boolean;
};

export type OptionLabelInfo = {
  label: string;
  note?: string;
  groupKey?: OptionSourceKey;
};

export type OptionLabelByUnitId = Map<string, Map<string, OptionLabelInfo>>;

export type UnitOptionGroup = {
  id: string;
  groupKey: OptionSourceKey;
  title: string;
  type: "radio" | "checkbox";
  options: UnitOptionItem[];
};

const OPTION_GROUP_DEFINITIONS: Array<{
  key: OptionSourceKey;
  type: "radio" | "checkbox";
}> = [
  { key: "command", type: "checkbox" },
  { key: "equipment", type: "radio" },
  { key: "armor", type: "radio" },
  { key: "mounts", type: "radio" },
  { key: "options", type: "checkbox" },
];

type LocaleKey = "pl" | "en" | "de" | "fr" | "es";

type LocaleHint = Pick<LocaleDictionary, "localeName">;

type OptionGroupDict = Pick<
  LocaleDictionary,
  | "localeName"
  | "categoryOptionsDefaultLabel"
  | "categoryOptionGroupCommandLabel"
  | "categoryOptionGroupEquipmentLabel"
  | "categoryOptionGroupArmorLabel"
  | "categoryOptionGroupMountsLabel"
>;

const resolveLocaleKey = (dict: LocaleHint | null | undefined): LocaleKey => {
  const raw = dict?.localeName?.toLowerCase();
  if (raw === "pl" || raw === "en" || raw === "de" || raw === "fr" || raw === "es") {
    return raw;
  }
  return "en";
};

const resolveLocalizedValue = (
  values: Partial<Record<LocaleKey, string>>,
  dict: LocaleHint,
  translateFallback: (value: string, dict: LocaleHint) => string,
  fallback?: string
) => {
  const locale = resolveLocaleKey(dict);
  const localized = values[locale];
  if (localized && localized.trim().length > 0) return localized;
  const english = values.en ?? fallback ?? "";
  return english ? translateFallback(english, dict) : fallback ?? "";
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function getUnitKey(unit: ArmyUnit, index: number): string {
  if (typeof unit.id === "string" && unit.id.trim().length > 0) return unit.id;
  if (typeof unit.name_en === "string" && unit.name_en.trim().length > 0) {
    return `${unit.name_en}-${index}`;
  }
  return `empire-unit-${index}`;
}

export function getUnitLabel(unit: ArmyUnit): string {
  if (typeof unit.name_en === "string" && unit.name_en.trim().length > 0) return unit.name_en;
  if (typeof (unit as { name?: string }).name === "string")
    return (unit as { name?: string }).name!;
  if (typeof unit.id === "string") return unit.id;
  return "Jednostka bez nazwy";
}

export function getLocalizedUnitLabel(unit: ArmyUnit, dict: LocaleHint): string {
  return resolveLocalizedValue(
    {
      en: unit.name_en ?? unit.name,
      pl: unit.name_pl,
      de: unit.name_de,
      fr: unit.name_fr,
      es: unit.name_es,
    },
    dict,
    translateNameForDict,
    getUnitLabel(unit)
  );
}

export function getLocalizedOptionLabel(option: UnitOptionItem, dict: LocaleHint): string {
  return resolveLocalizedValue(
    {
      en: option.label,
      pl: option.labelPl,
      de: option.labelDe,
      fr: option.labelFr,
      es: option.labelEs,
    },
    dict,
    translateTextForDict,
    option.label
  );
}

export function getLocalizedOptionNote(option: UnitOptionItem, dict: LocaleHint): string | undefined {
  const note = resolveLocalizedValue(
    {
      en: option.note,
      pl: option.notePl,
      de: option.noteDe,
      fr: option.noteFr,
      es: option.noteEs,
    },
    dict,
    translateTextForDict,
    option.note
  );
  return note && note.trim().length > 0 ? note : undefined;
}

export function getUnitPoints(unit: ArmyUnit): number {
  return typeof unit.points === "number" ? unit.points : 0;
}

export function getUnitNotes(unit: ArmyUnit): string | undefined {
  const notes = unit.notes as Record<string, unknown> | undefined;
  if (notes && typeof notes === "object") {
    const polish = notes["name_pl"];
    if (typeof polish === "string" && polish.trim().length > 0) return polish;
    const english = notes["name_en"];
    if (typeof english === "string" && english.trim().length > 0) return english;
  }
  return undefined;
}

export function buildUnitLabelById(
  unitsByCategory: Partial<Record<CategoryKey, ArmyUnit[]>>,
  dict: LocaleHint
): Map<string, string> {
  const map = new Map<string, string>();
  (Object.values(unitsByCategory) as ArmyUnit[][]).forEach((units) => {
    units?.forEach((unit, index) => {
      const label = getLocalizedUnitLabel(unit, dict);
      const key = getUnitKey(unit, index);
      map.set(key, label);
      if (typeof unit.id === "string" && unit.id.trim().length > 0) {
        map.set(unit.id, label);
      }
    });
  });
  return map;
}

export function buildOptionLabelByUnitId(
  unitsByCategory: Partial<Record<CategoryKey, ArmyUnit[]>>,
  dict: OptionGroupDict
): OptionLabelByUnitId {
  const map: OptionLabelByUnitId = new Map();
  (Object.values(unitsByCategory) as ArmyUnit[][]).forEach((units) => {
    units?.forEach((unit, index) => {
      const unitKeys = new Set<string>();
      const primaryKey = getUnitKey(unit, index);
      if (primaryKey) unitKeys.add(primaryKey);
      if (typeof unit.id === "string" && unit.id.trim().length > 0) {
        unitKeys.add(unit.id);
      }
      if (unitKeys.size === 0) return;

      const groups = extractOptionGroups(unit, dict);
      if (groups.length === 0) return;

      unitKeys.forEach((unitKey) => {
        if (!map.has(unitKey)) map.set(unitKey, new Map());
      });

      groups.forEach((group) => {
        group.options.forEach((option) => {
          const info: OptionLabelInfo = {
            label: getLocalizedOptionLabel(option, dict),
            note: getLocalizedOptionNote(option, dict),
            groupKey: group.groupKey,
          };
          unitKeys.forEach((unitKey) => {
            map.get(unitKey)?.set(option.id, info);
          });
        });
      });
    });
  });
  return map;
}

export function formatCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    characters: "Bohaterowie",
    core: "Jednostki podstawowe",
    special: "Jednostki specjalne",
    rare: "Jednostki rzadkie",
    mercenaries: "Najemnicy",
    allies: "Sojusznicy",
  };
  if (labels[category]) return labels[category];
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function extractOptionGroups(unit: ArmyUnit, dict: OptionGroupDict): UnitOptionGroup[] {
  return OPTION_GROUP_DEFINITIONS.flatMap((def) => {
    const raw = (unit as Record<string, unknown>)[def.key];
    if (!Array.isArray(raw) || raw.length === 0) return [];

    const options: UnitOptionItem[] = [];
    raw.forEach((item, index) => {
      if (!item || typeof item !== "object") return;
      const candidate = item as Record<string, unknown>;
      const nameEn =
        typeof candidate.name_en === "string" && candidate.name_en.trim().length > 0
          ? candidate.name_en
          : typeof candidate.name === "string" && candidate.name.trim().length > 0
          ? candidate.name
          : undefined;
      const nameDe =
        typeof (candidate as { name_de?: unknown }).name_de === "string" &&
        (candidate as { name_de?: string }).name_de!.trim().length > 0
          ? (candidate as { name_de?: string }).name_de
          : undefined;
      const nameFr =
        typeof (candidate as { name_fr?: unknown }).name_fr === "string" &&
        (candidate as { name_fr?: string }).name_fr!.trim().length > 0
          ? (candidate as { name_fr?: string }).name_fr
          : undefined;
      const nameEs =
        typeof (candidate as { name_es?: unknown }).name_es === "string" &&
        (candidate as { name_es?: string }).name_es!.trim().length > 0
          ? (candidate as { name_es?: string }).name_es
          : undefined;
      const namePl =
        typeof (candidate as { name_pl?: unknown }).name_pl === "string" &&
        (candidate as { name_pl?: string }).name_pl!.trim().length > 0
          ? (candidate as { name_pl?: string }).name_pl
          : undefined;
      const nameValue = nameEn ?? namePl ?? "";
      if (typeof nameValue !== "string" || nameValue.trim().length === 0) return;

      const optionId =
        typeof candidate.id === "string" && candidate.id.trim().length > 0
          ? (candidate.id as string)
          : `${def.key}-${slugify(nameValue)}-${index}`;
      const noteSource = candidate.notes as Record<string, unknown> | undefined;
      const notePl =
        noteSource && typeof noteSource === "object" && typeof noteSource["name_pl"] === "string"
          ? (noteSource["name_pl"] as string)
          : undefined;
      const noteDe =
        noteSource && typeof noteSource === "object" && typeof noteSource["name_de"] === "string"
          ? (noteSource["name_de"] as string)
          : undefined;
      const noteFr =
        noteSource && typeof noteSource === "object" && typeof noteSource["name_fr"] === "string"
          ? (noteSource["name_fr"] as string)
          : undefined;
      const noteEs =
        noteSource && typeof noteSource === "object" && typeof noteSource["name_es"] === "string"
          ? (noteSource["name_es"] as string)
          : undefined;
      const noteEn =
        noteSource && typeof noteSource === "object" && typeof noteSource["name_en"] === "string"
          ? (noteSource["name_en"] as string)
          : undefined;
      const defaultSelected = Boolean(candidate.active || candidate.equippedDefault);

      options.push({
        id: optionId,
        label: nameValue,
        labelPl: namePl ?? undefined,
        labelDe: nameDe ?? undefined,
        labelFr: nameFr ?? undefined,
        labelEs: nameEs ?? undefined,
        points: typeof candidate.points === "number" ? (candidate.points as number) : 0,
        perModel: Boolean(candidate.perModel),
        note: noteEn ?? notePl,
        notePl: notePl ?? undefined,
        noteDe: noteDe ?? undefined,
        noteFr: noteFr ?? undefined,
        noteEs: noteEs ?? undefined,
        defaultSelected,
      });
    });

    if (options.length === 0) return [];

    return [
      {
        id: `group-${def.key}`,
        groupKey: def.key,
        title: getOptionGroupLabel(def.key, dict),
        type: def.type,
        options,
      },
    ];
  });
}

export function findUnitByKey(units: ArmyUnit[], key: string | null) {
  if (units.length === 0) return null;
  if (!key) return { unit: units[0], index: 0 };
  const foundIndex = units.findIndex((candidate, idx) => getUnitKey(candidate, idx) === key);
  const index = foundIndex >= 0 ? foundIndex : 0;
  return { unit: units[index], index };
}
