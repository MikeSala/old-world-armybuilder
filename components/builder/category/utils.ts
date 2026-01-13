import type { UnitOptionGroup } from "@/lib/builder/unitHelpers";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { SelectedOption, RosterEntry } from "@/lib/roster/normalizeEntry";

import type { CategorySection, Dict, TotalsByCategory } from "./types";

const clampNonNeg = (n: number) => (n < 0 ? 0 : n);
const roundPoints = (n: number) => Math.round(n);

type CategoryMath = {
  minCore: number;
  caps: Record<Exclude<CategoryKey, "core">, number>;
  availability: Record<Exclude<CategoryKey, "core">, number>;
  coreRequirementMet: boolean;
};

export const calculateCategoryMath = (
  pointsLimit: number,
  spent: Required<TotalsByCategory>
): CategoryMath => {
  const minCore = roundPoints(pointsLimit * 0.25);
  const caps = {
    characters: roundPoints(pointsLimit * 0.5),
    special: roundPoints(pointsLimit * 0.5),
    rare: roundPoints(pointsLimit * 0.25),
    mercenaries: roundPoints(pointsLimit * 0.2),
    allies: roundPoints(pointsLimit * 0.25),
  } as const;

  const availability = {
    characters: clampNonNeg(caps.characters - spent.characters),
    special: clampNonNeg(caps.special - spent.special),
    rare: clampNonNeg(caps.rare - spent.rare),
    mercenaries: clampNonNeg(caps.mercenaries - spent.mercenaries),
    allies: clampNonNeg(caps.allies - spent.allies),
  };

  return {
    minCore,
    caps,
    availability,
    coreRequirementMet: spent.core >= minCore,
  };
};

export const buildCategorySections = (
  dict: Dict,
  spent: Required<TotalsByCategory>,
  pointsLimit: number
): CategorySection[] => {
  const { minCore, caps, availability, coreRequirementMet } = calculateCategoryMath(
    pointsLimit,
    spent
  );

  const coreSummaryText = dict.categoryCorePointsSummary
    .replace("{current}", String(spent.core))
    .replace("{required}", String(minCore));
  const formatCapSummary = (current: number, limit: number) =>
    dict.categoryCapPointsSummary.replace("{current}", String(current)).replace("{limit}", String(limit));

  return [
    {
      key: "characters",
      title: dict.categoryCharactersLabel,
      value: availability.characters,
      suffix: dict.categoryPtsAvailable,
      formattedValue: formatCapSummary(spent.characters, caps.characters),
    },
    {
      key: "core",
      title: dict.categoryCoreLabel,
      value: spent.core,
      suffix: "",
      formattedValue: coreSummaryText,
      warning: !coreRequirementMet,
      enforceCap: false,
    },
    {
      key: "special",
      title: dict.categorySpecialLabel,
      value: availability.special,
      suffix: dict.categoryPtsAvailable,
      formattedValue: formatCapSummary(spent.special, caps.special),
    },
    {
      key: "rare",
      title: dict.categoryRareLabel,
      value: availability.rare,
      suffix: dict.categoryPtsAvailable,
      formattedValue: formatCapSummary(spent.rare, caps.rare),
    },
    {
      key: "mercenaries",
      title: dict.categoryMercsLabel,
      value: availability.mercenaries,
      suffix: dict.categoryPtsAvailable,
      formattedValue: formatCapSummary(spent.mercenaries, caps.mercenaries),
    },
    {
      key: "allies",
      title: dict.categoryAlliesLabel,
      value: availability.allies,
      suffix: dict.categoryPtsAvailable,
      formattedValue: formatCapSummary(spent.allies, caps.allies),
    },
  ];
};

export const clampUnitSizeValue = (
  value: number,
  minUnitSize: number,
  maxUnitSize: number | null
) => {
  let next = Number.isFinite(value) ? Math.floor(value) : minUnitSize;
  next = Math.max(minUnitSize, next);
  if (maxUnitSize !== null) {
    next = Math.min(maxUnitSize, next);
  }
  return next;
};

export const buildDefaultSelections = (groups: UnitOptionGroup[]): Record<string, string[]> =>
  groups.reduce<Record<string, string[]>>((acc, group) => {
    if (group.type === "radio") {
      const defaultOption = group.options.find((opt) => opt.defaultSelected) ?? group.options[0];
      acc[group.id] = defaultOption ? [defaultOption.id] : [];
    } else {
      acc[group.id] = group.options.filter((opt) => opt.defaultSelected).map((opt) => opt.id);
    }
    return acc;
  }, {});

export const mapEntryOptionsToSelections = (
  entry: RosterEntry,
  groups: UnitOptionGroup[]
): Record<string, string[]> => {
  const sourceIds = new Set(
    entry.options
      .map((opt) => (typeof opt.sourceId === "string" ? opt.sourceId : null))
      .filter((id): id is string => Boolean(id))
  );
  const optionNames = new Set(
    entry.options
      .map((opt) => (typeof opt.name === "string" ? opt.name.trim() : ""))
      .filter((name) => name.length > 0)
  );

  return groups.reduce<Record<string, string[]>>((acc, group) => {
    const matchingIds = group.options
      .filter((opt) => sourceIds.has(opt.id) || optionNames.has(opt.label))
      .map((opt) => opt.id);
    if (group.type === "radio") {
      if (matchingIds.length > 0) {
        acc[group.id] = [matchingIds[0]];
      } else {
        const fallback = group.options.find((opt) => opt.defaultSelected) ?? group.options[0];
        acc[group.id] = fallback ? [fallback.id] : [];
      }
    } else {
      acc[group.id] = matchingIds;
    }
    return acc;
  }, {});
};

export const calculateOptionPoints = (
  groups: UnitOptionGroup[],
  selections: Record<string, string[]>,
  unitSize: number
) =>
  groups.reduce((groupSum, group) => {
    const selectedIds = selections[group.id] ?? [];
    return (
      groupSum +
      selectedIds.reduce((sum, selectedId) => {
        const opt = group.options.find((o) => o.id === selectedId);
        if (!opt) return sum;
        const optionTotal = opt.points * (opt.perModel ? unitSize : 1);
        return sum + optionTotal;
      }, 0)
    );
  }, 0);

export const buildSelectedOptions = (
  groups: UnitOptionGroup[],
  selections: Record<string, string[]>,
  unitSize: number
): SelectedOption[] =>
  groups.flatMap((group) => {
    const selectedIds = selections[group.id] ?? [];
    return selectedIds.reduce<SelectedOption[]>((acc, selectedId) => {
      const option = group.options.find((opt) => opt.id === selectedId);
      if (!option) return acc;
      const totalPoints = option.points * (option.perModel ? unitSize : 1);
      acc.push({
        id: `${group.id}-${option.id}`,
        name: option.label,
        points: totalPoints,
        group: group.groupKey,
        note: option.note,
        perModel: option.perModel,
        baseCost: option.points,
        sourceId: option.id,
      });
      return acc;
    }, []);
  });
