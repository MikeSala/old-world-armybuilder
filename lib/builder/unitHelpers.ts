import type { ArmyUnit } from "@/lib/store/selectors/catalog";

export type OptionSourceKey = "command" | "equipment" | "armor" | "options" | "mounts";

export type UnitOptionItem = {
  id: string;
  label: string;
  points: number;
  note?: string;
  defaultSelected?: boolean;
  perModel?: boolean;
};

export type UnitOptionGroup = {
  id: string;
  groupKey: OptionSourceKey;
  title: string;
  type: "radio" | "checkbox";
  options: UnitOptionItem[];
};

const OPTION_GROUP_DEFINITIONS: Array<{
  key: OptionSourceKey;
  title: string;
  type: "radio" | "checkbox";
}> = [
  { key: "command", title: "Command", type: "checkbox" },
  { key: "equipment", title: "Weapons", type: "radio" },
  { key: "armor", title: "Armour", type: "radio" },
  { key: "mounts", title: "Mounts", type: "radio" },
  { key: "options", title: "Options", type: "checkbox" },
];

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
  return "Unnamed unit";
}

export function getUnitPoints(unit: ArmyUnit): number {
  return typeof unit.points === "number" ? unit.points : 0;
}

export function getUnitNotes(unit: ArmyUnit): string | undefined {
  const notes = unit.notes as Record<string, unknown> | undefined;
  if (notes && typeof notes === "object") {
    const english = notes["name_en"];
    if (typeof english === "string" && english.trim().length > 0) return english;
  }
  return undefined;
}

export function formatCategoryLabel(category: string): string {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function extractOptionGroups(unit: ArmyUnit): UnitOptionGroup[] {
  return OPTION_GROUP_DEFINITIONS.flatMap((def) => {
    const raw = (unit as Record<string, unknown>)[def.key];
    if (!Array.isArray(raw) || raw.length === 0) return [];

    const options: UnitOptionItem[] = [];
    raw.forEach((item, index) => {
      if (!item || typeof item !== "object") return;
      const candidate = item as Record<string, unknown>;
      const nameValue = candidate.name_en ?? candidate.name;
      if (typeof nameValue !== "string" || nameValue.trim().length === 0) return;

      const optionId =
        typeof candidate.id === "string" && candidate.id.trim().length > 0
          ? (candidate.id as string)
          : `${def.key}-${slugify(nameValue)}-${index}`;
      const noteSource = candidate.notes as Record<string, unknown> | undefined;
      const note =
        noteSource && typeof noteSource === "object" && typeof noteSource["name_en"] === "string"
          ? (noteSource["name_en"] as string)
          : undefined;
      const defaultSelected = Boolean(candidate.active || candidate.equippedDefault);

      options.push({
        id: optionId,
        label: nameValue,
        points: typeof candidate.points === "number" ? (candidate.points as number) : 0,
        perModel: Boolean(candidate.perModel),
        note,
        defaultSelected,
      });
    });

    if (options.length === 0) return [];

    return [
      {
        id: `group-${def.key}`,
        groupKey: def.key,
        title: def.title,
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
