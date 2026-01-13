import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import { isPolishLocale, translateNameForDict, translateTextForDict } from "@/lib/i18n/translateLocale";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";

type Dict = LocaleDictionary;

export const OPTION_GROUP_KEYS = ["command", "equipment", "armor", "mounts", "options"] as const;
export type OptionGroupKey = (typeof OPTION_GROUP_KEYS)[number];

const OPTION_GROUP_ALIASES: Record<string, OptionGroupKey> = {
  command: "command",
  "dowództwo": "command",
  dowodztwo: "command",
  equipment: "equipment",
  weapon: "equipment",
  weapons: "equipment",
  "broń": "equipment",
  bron: "equipment",
  armor: "armor",
  armour: "armor",
  zbroja: "armor",
  mounts: "mounts",
  mount: "mounts",
  wierzchowce: "mounts",
  options: "options",
  option: "options",
  opcje: "options",
};

type OptionGroupDict = Pick<
  Dict,
  | "localeName"
  | "categoryOptionsDefaultLabel"
  | "categoryOptionGroupCommandLabel"
  | "categoryOptionGroupEquipmentLabel"
  | "categoryOptionGroupArmorLabel"
  | "categoryOptionGroupMountsLabel"
>;

export const normalizeOptionGroupKey = (group: string | null | undefined): OptionGroupKey | null => {
  if (!group || typeof group !== "string") return null;
  const normalized = group.trim().toLowerCase();
  if (!normalized) return null;
  return OPTION_GROUP_ALIASES[normalized] ?? null;
};

export const resolveOptionGroupKey = (group: string | null | undefined): OptionGroupKey | null => {
  const normalized = normalizeOptionGroupKey(group);
  if (normalized) return normalized;
  if (!group || (typeof group === "string" && group.trim().length === 0)) return "options";
  return null;
};

export const getOptionGroupLabel = (group: string | null | undefined, dict: OptionGroupDict) => {
  const normalized = resolveOptionGroupKey(group);
  if (normalized === "command") return dict.categoryOptionGroupCommandLabel;
  if (normalized === "equipment") return dict.categoryOptionGroupEquipmentLabel;
  if (normalized === "armor") return dict.categoryOptionGroupArmorLabel;
  if (normalized === "mounts") return dict.categoryOptionGroupMountsLabel;
  if (normalized === "options") return dict.categoryOptionsDefaultLabel;

  const trimmed = typeof group === "string" ? group.trim() : "";
  if (trimmed.length === 0) return dict.categoryOptionsDefaultLabel;
  return isPolishLocale(dict) ? translateTextForDict(trimmed, dict) : trimmed;
};

export const ROSTER_STAT_FIELDS = [
  { key: "M", label: "M" },
  { key: "WS", label: "WS" },
  { key: "BS", label: "BS" },
  { key: "S", label: "S" },
  { key: "T", label: "T" },
  { key: "W", label: "W" },
  { key: "I", label: "I" },
  { key: "A", label: "A" },
  { key: "Ld", label: "Ld" },
] as const;
export type RosterStatFieldKey = (typeof ROSTER_STAT_FIELDS)[number]["key"];

export type RosterStatTooltipKey =
  | "rosterDetailStatNameM"
  | "rosterDetailStatNameWS"
  | "rosterDetailStatNameBS"
  | "rosterDetailStatNameS"
  | "rosterDetailStatNameT"
  | "rosterDetailStatNameW"
  | "rosterDetailStatNameI"
  | "rosterDetailStatNameA"
  | "rosterDetailStatNameLd";

export const ROSTER_STAT_TOOLTIP_KEYS: Record<RosterStatFieldKey, RosterStatTooltipKey> = {
  M: "rosterDetailStatNameM",
  WS: "rosterDetailStatNameWS",
  BS: "rosterDetailStatNameBS",
  S: "rosterDetailStatNameS",
  T: "rosterDetailStatNameT",
  W: "rosterDetailStatNameW",
  I: "rosterDetailStatNameI",
  A: "rosterDetailStatNameA",
  Ld: "rosterDetailStatNameLd",
};

export const formatOptionGroupLabel = (group: string, dict: OptionGroupDict) =>
  `${getOptionGroupLabel(group, dict)}:`;

export const renderStatValue = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : value.toFixed(1);
  }
  return value;
};

export const localizeMetaLabel = (
  label: string,
  dict: Pick<
    Dict,
    | "localeName"
    | "rosterDetailSidebarUnitSize"
    | "rosterDetailSidebarBaseSize"
    | "rosterDetailSidebarArmourValue"
    | "rosterDetailSidebarMountUnitSize"
    | "rosterDetailSidebarMountBaseSize"
    | "rosterDetailSidebarMountArmourValue"
    | "rosterDetailMountLabel"
  >
) => {
  if (label === "Unit Size") return dict.rosterDetailSidebarUnitSize;
  if (label === "Base Size") return dict.rosterDetailSidebarBaseSize;
  if (label === "Armour Value") return dict.rosterDetailSidebarArmourValue;

  const unitSizeMatch = label.match(/^(.*) Unit Size$/);
  if (unitSizeMatch) {
    const mountLabel =
      unitSizeMatch[1] === "Mount"
        ? dict.rosterDetailMountLabel
        : translateNameForDict(unitSizeMatch[1], dict);
    return dict.rosterDetailSidebarMountUnitSize.replace("{mount}", mountLabel);
  }

  const baseSizeMatch = label.match(/^(.*) Base Size$/);
  if (baseSizeMatch) {
    const mountLabel =
      baseSizeMatch[1] === "Mount"
        ? dict.rosterDetailMountLabel
        : translateNameForDict(baseSizeMatch[1], dict);
    return dict.rosterDetailSidebarMountBaseSize.replace("{mount}", mountLabel);
  }

  const armourMatch = label.match(/^(.*) Armour Value$/);
  if (armourMatch) {
    const mountLabel =
      armourMatch[1] === "Mount"
        ? dict.rosterDetailMountLabel
        : translateNameForDict(armourMatch[1], dict);
    return dict.rosterDetailSidebarMountArmourValue.replace("{mount}", mountLabel);
  }

  return isPolishLocale(dict) ? translateTextForDict(label, dict) : label;
};

export const buildCategoryLabels = (
  dict: Pick<
    Dict,
    | "categoryCharactersLabel"
    | "categoryCoreLabel"
    | "categorySpecialLabel"
    | "categoryRareLabel"
    | "categoryMercsLabel"
    | "categoryAlliesLabel"
  >
): Record<CategoryKey, string> => ({
  characters: dict.categoryCharactersLabel,
  core: dict.categoryCoreLabel,
  special: dict.categorySpecialLabel,
  rare: dict.categoryRareLabel,
  mercenaries: dict.categoryMercsLabel,
  allies: dict.categoryAlliesLabel,
});

export const formatPointsValue = (
  value: number | string,
  dict: Pick<Dict, "categoryPointsValue">
): string => dict.categoryPointsValue.replace("{value}", String(value));

export const formatUnitSizeDetail = (
  entry: RosterEntry,
  dict: Pick<Dict, "categoryEntryMultipleModels" | "categoryEntryPointsPerModel">
) => {
  if (entry.unitSize <= 1) return null;
  return `${dict.categoryEntryMultipleModels.replace("{count}", String(entry.unitSize))} @ ${dict.categoryEntryPointsPerModel.replace("{value}", String(entry.pointsPerModel))}`;
};
