import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";

type Dict = LocaleDictionary;

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

export const formatOptionGroupLabel = (group: string, dict: Pick<Dict, "categoryOptionsDefaultLabel">) => {
  const normalized = group.trim();
  const isDefault = normalized.length === 0 || normalized.toLowerCase() === "options";
  const label = isDefault ? dict.categoryOptionsDefaultLabel : normalized;
  return `${label}:`;
};

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
    const mountLabel = unitSizeMatch[1] === "Mount" ? dict.rosterDetailMountLabel : unitSizeMatch[1];
    return dict.rosterDetailSidebarMountUnitSize.replace("{mount}", mountLabel);
  }

  const baseSizeMatch = label.match(/^(.*) Base Size$/);
  if (baseSizeMatch) {
    const mountLabel = baseSizeMatch[1] === "Mount" ? dict.rosterDetailMountLabel : baseSizeMatch[1];
    return dict.rosterDetailSidebarMountBaseSize.replace("{mount}", mountLabel);
  }

  const armourMatch = label.match(/^(.*) Armour Value$/);
  if (armourMatch) {
    const mountLabel = armourMatch[1] === "Mount" ? dict.rosterDetailMountLabel : armourMatch[1];
    return dict.rosterDetailSidebarMountArmourValue.replace("{mount}", mountLabel);
  }

  return label;
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
