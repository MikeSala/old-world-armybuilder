import * as React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import {
  extractOptionGroups,
  findUnitByKey,
  formatCategoryLabel,
  getUnitKey,
  getUnitLabel,
  getUnitNotes,
  getUnitPoints,
  type UnitOptionGroup,
} from "@/lib/builder/unitHelpers";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import type { RootState, AppDispatch } from "@/lib/store";
import type { ArmyUnit } from "@/lib/store/selectors/catalog";
import { selectUnitsByCategory } from "@/lib/store/selectors/catalog";
import { selectSpentByCategory } from "@/lib/store/selectors/points";
import { rosterInitialState, upsertEntry } from "@/lib/store/slices/rosterSlice";
import type { RosterEntry } from "@/lib/store/slices/rosterSlice";

import type {
  CategorySection,
  Dict,
  EntriesByCategory,
  TotalsByCategory,
} from "./types";

function clampNonNeg(n: number) {
  return n < 0 ? 0 : n;
}

function roundPoints(n: number) {
  return Math.round(n);
}

function mapEntryOptionsToSelections(
  entry: RosterEntry,
  groups: UnitOptionGroup[]
): Record<string, string[]> {
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

  const byGroup = groups.reduce<Record<string, string[]>>((acc, group) => {
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
  return byGroup;
}

type UseCategoryBucketsStateOptions = {
  totals?: TotalsByCategory;
  onAddClick?: (category: CategoryKey) => void;
  dict: Dict;
};

export type CategorySelectionState = {
  activeCategory: CategoryKey | null;
  units: ArmyUnit[];
  hasUnits: boolean;
  selectedUnitId: string | null;
  setSelectedUnitId: React.Dispatch<React.SetStateAction<string | null>>;
  minUnitSize: number;
  maxUnitSize: number | null;
  unitSize: number;
  setUnitSize: React.Dispatch<React.SetStateAction<number>>;
  incrementUnitSize: () => void;
  decrementUnitSize: () => void;
  clampUnitSize: (value: number) => number;
  displayUnitSize: number;
  pointsPerModel: number;
  optionGroups: UnitOptionGroup[];
  optionSelections: Record<string, string[]>;
  onToggleOption: (group: UnitOptionGroup, optionId: string, checked: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  totalPoints: number;
  totalOptionPoints: number;
  activeUnit: ArmyUnit | null;
  formatCategoryLabel: (category: string) => string;
  mode: "add" | "edit";
  editingEntry: RosterEntry | null;
};

export function useCategoryBucketsState({
  totals,
  onAddClick,
  dict,
}: UseCategoryBucketsStateOptions) {
  const dispatch = useDispatch<AppDispatch>();
  const rosterMeta = useSelector(
    (state: RootState) => ({
      armyId: state.roster.draft.armyId ?? null,
      name: state.roster.draft.name ?? "",
      pointsLimit: state.roster.draft.pointsLimit ?? 0,
      savedAt: state.roster.ui?.savedAt ?? rosterInitialState.ui.savedAt,
    }),
    shallowEqual
  );
  const totalsFromStore = useSelector(selectSpentByCategory);
  const unitsByCategory = useSelector(selectUnitsByCategory);
  const rosterEntries = useSelector(
    (state: RootState) => state.roster.draft.entries ?? rosterInitialState.draft.entries
  );

  const [activeCategory, setActiveCategory] = React.useState<CategoryKey | null>(null);
  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(null);
  const [optionSelections, setOptionSelections] = React.useState<Record<string, string[]>>({});
  const [unitSize, setUnitSize] = React.useState<number>(1);
  const [editingEntryId, setEditingEntryId] = React.useState<string | null>(null);

  const editingEntry = React.useMemo(
    () => (editingEntryId ? rosterEntries.find((entry) => entry.id === editingEntryId) ?? null : null),
    [editingEntryId, rosterEntries]
  );
  const optionPrefillEntryRef = React.useRef<string | null>(null);
  const unitSizePrefillEntryRef = React.useRef<string | null>(null);

  const pointsLimit = rosterMeta.pointsLimit;
  const isRosterReady =
    Boolean(rosterMeta.savedAt) &&
    Boolean(rosterMeta.armyId) &&
    pointsLimit > 0 &&
    rosterMeta.name.trim().length > 0;

  const spent: Required<TotalsByCategory> = {
    characters: totals?.characters ?? totalsFromStore.characters ?? 0,
    core: totals?.core ?? totalsFromStore.core ?? 0,
    special: totals?.special ?? totalsFromStore.special ?? 0,
    rare: totals?.rare ?? totalsFromStore.rare ?? 0,
    mercenaries: totals?.mercenaries ?? totalsFromStore.mercenaries ?? 0,
    allies: totals?.allies ?? totalsFromStore.allies ?? 0,
  };

  const minCore = roundPoints(pointsLimit * 0.25);
  const caps = {
    characters: roundPoints(pointsLimit * 0.5),
    special: roundPoints(pointsLimit * 0.5),
    rare: roundPoints(pointsLimit * 0.25),
    mercenaries: roundPoints(pointsLimit * 0.2),
    allies: roundPoints(pointsLimit * 0.25),
  } as const;

  const coreRequirementMet = spent.core >= minCore;
  const coreSummaryText = dict.categoryCorePointsSummary
    .replace("{current}", String(spent.core))
    .replace("{required}", String(minCore));
  const formatCapSummary = React.useCallback(
    (current: number, limit: number) =>
      dict.categoryCapPointsSummary
        .replace("{current}", String(current))
        .replace("{limit}", String(limit)),
    [dict.categoryCapPointsSummary]
  );
  const charactersAvailable = clampNonNeg(caps.characters - spent.characters);
  const specialAvailable = clampNonNeg(caps.special - spent.special);
  const rareAvailable = clampNonNeg(caps.rare - spent.rare);
  const mercsAvailable = clampNonNeg(caps.mercenaries - spent.mercenaries);
  const alliesAvailable = clampNonNeg(caps.allies - spent.allies);

  const sections: CategorySection[] = [
    {
      key: "characters",
      title: dict.categoryCharactersLabel,
      value: charactersAvailable,
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
      value: specialAvailable,
      suffix: dict.categoryPtsAvailable,
      formattedValue: formatCapSummary(spent.special, caps.special),
    },
    {
      key: "rare",
      title: dict.categoryRareLabel,
      value: rareAvailable,
      suffix: dict.categoryPtsAvailable,
      formattedValue: formatCapSummary(spent.rare, caps.rare),
    },
    {
      key: "mercenaries",
      title: dict.categoryMercsLabel,
      value: mercsAvailable,
      suffix: dict.categoryPtsAvailable,
      formattedValue: formatCapSummary(spent.mercenaries, caps.mercenaries),
    },
    {
      key: "allies",
      title: dict.categoryAlliesLabel,
      value: alliesAvailable,
      suffix: dict.categoryPtsAvailable,
      formattedValue: formatCapSummary(spent.allies, caps.allies),
    },
  ];

  const activeUnits = React.useMemo(
    () => (activeCategory ? unitsByCategory[activeCategory] ?? [] : []),
    [activeCategory, unitsByCategory]
  );

  const activeUnitInfo = React.useMemo(
    () => findUnitByKey(activeUnits, selectedUnitId),
    [activeUnits, selectedUnitId]
  );

  const activeUnit = activeUnitInfo?.unit ?? null;

  const optionGroups = React.useMemo(
    () => (activeUnit ? extractOptionGroups(activeUnit) : []),
    [activeUnit]
  );

  const minUnitSize = React.useMemo(() => {
    const raw = Number((activeUnit as { minimum?: unknown })?.minimum);
    if (Number.isFinite(raw) && raw > 0) return Math.floor(raw);
    return 1;
  }, [activeUnit]);

  const maxUnitSize = React.useMemo(() => {
    const raw = Number((activeUnit as { maximum?: unknown })?.maximum);
    if (Number.isFinite(raw) && raw > 0) return Math.floor(raw);
    return null;
  }, [activeUnit]);

  const pointsPerModel = React.useMemo(
    () => (activeUnit ? getUnitPoints(activeUnit) : 0),
    [activeUnit]
  );

  const clampUnitSize = React.useCallback(
    (value: number) => {
      let next = Number.isFinite(value) ? Math.floor(value) : minUnitSize;
      next = Math.max(minUnitSize, next);
      if (maxUnitSize !== null) {
        next = Math.min(maxUnitSize, next);
      }
      return next;
    },
    [maxUnitSize, minUnitSize]
  );

  const entriesByCategory = React.useMemo<EntriesByCategory>(() => {
    const grouped: Partial<Record<CategoryKey, RosterEntry[]>> = {};
    rosterEntries.forEach((entry) => {
      if (!grouped[entry.category]) grouped[entry.category] = [];
      grouped[entry.category]!.push(entry);
    });
    return grouped;
  }, [rosterEntries]);

  const handleStartEditingEntry = React.useCallback(
    (entryId: string) => {
      const entry = rosterEntries.find((item) => item.id === entryId);
      if (!entry) return;
      setEditingEntryId(entry.id);
      optionPrefillEntryRef.current = entry.id;
      unitSizePrefillEntryRef.current = entry.id;
      setActiveCategory(entry.category);
      setSelectedUnitId(entry.unitId);
    },
    [rosterEntries]
  );

  const handleToggleCategory = React.useCallback(
    (category: CategoryKey) => {
      setEditingEntryId(null);
      optionPrefillEntryRef.current = null;
      unitSizePrefillEntryRef.current = null;
      if (activeCategory === category) {
        setActiveCategory(null);
        setSelectedUnitId(null);
        setOptionSelections({});
        setUnitSize(1);
        return;
      }
      const units = unitsByCategory[category] ?? [];
      const firstId = units.length > 0 ? getUnitKey(units[0], 0) : null;
      setActiveCategory(category);
      setSelectedUnitId(firstId);
    },
    [activeCategory, unitsByCategory]
  );

  const handleOptionToggle = React.useCallback(
    (group: UnitOptionGroup, optionId: string, checked: boolean) => {
      setOptionSelections((prev) => {
        const current = prev[group.id] ?? [];
        if (group.type === "radio") {
          return { ...prev, [group.id]: checked ? [optionId] : [] };
        }
        const next = checked
          ? Array.from(new Set([...current, optionId]))
          : current.filter((id) => id !== optionId);
        return { ...prev, [group.id]: next };
      });
    },
    []
  );

  const handleConfirmSelection = React.useCallback(() => {
    if (!activeCategory || !activeUnit) return;

    const entryId =
      editingEntry?.id ??
      (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const enforcedUnitSize = clampUnitSize(unitSize);
    if (enforcedUnitSize !== unitSize) {
      setUnitSize(enforcedUnitSize);
    }

    const selectedOptions = optionGroups.flatMap((group) => {
      const selectedIds = optionSelections[group.id] ?? [];
      return selectedIds
        .map((selectedId) => {
          const option = group.options.find((opt) => opt.id === selectedId);
          if (!option) return null;
          const totalPoints = option.points * (option.perModel ? enforcedUnitSize : 1);
          return {
            id: `${group.id}-${option.id}`,
            name: option.label,
            points: totalPoints,
            group: group.title,
            note: option.note,
            perModel: option.perModel,
            baseCost: option.points,
            sourceId: option.id,
          };
        })
        .filter((opt): opt is NonNullable<typeof opt> => opt !== null);
    });

    const costPerModel = Math.max(0, getUnitPoints(activeUnit));
    const basePoints = costPerModel * enforcedUnitSize;
    const optionsPoints = selectedOptions.reduce((sum, opt) => sum + opt.points, 0);
    const totalPoints = basePoints + optionsPoints;

    dispatch(
      upsertEntry({
        id: entryId,
        unitId:
          typeof activeUnit.id === "string" && activeUnit.id.trim().length > 0
            ? activeUnit.id
            : (selectedUnitId ?? entryId),
        name: getUnitLabel(activeUnit),
        category: activeCategory,
        unitSize: enforcedUnitSize,
        pointsPerModel: costPerModel,
        basePoints,
        options: selectedOptions,
        totalPoints,
        notes: getUnitNotes(activeUnit) ?? editingEntry?.notes,
        owned: editingEntry?.owned ?? false,
      })
    );

    if (!editingEntry) {
      onAddClick?.(activeCategory);
    }
    setEditingEntryId(null);
    optionPrefillEntryRef.current = null;
    unitSizePrefillEntryRef.current = null;
    setActiveCategory(null);
    setSelectedUnitId(null);
    setOptionSelections({});
    setUnitSize(1);
  }, [
    activeCategory,
    activeUnit,
    clampUnitSize,
    dispatch,
    editingEntry,
    onAddClick,
    optionGroups,
    optionSelections,
    selectedUnitId,
    unitSize,
  ]);

  React.useEffect(() => {
    if (!activeCategory) return;
    const units = unitsByCategory[activeCategory] ?? [];
    if (units.length === 0) {
      if (selectedUnitId !== null) setSelectedUnitId(null);
      return;
    }
    const exists = units.some((unit, index) => getUnitKey(unit, index) === selectedUnitId);
    if (!exists) {
      setSelectedUnitId(getUnitKey(units[0], 0));
    }
  }, [activeCategory, selectedUnitId, unitsByCategory]);

  React.useEffect(() => {
    if (!activeUnit) {
      setOptionSelections({});
      return;
    }

    if (editingEntry) {
      if (optionPrefillEntryRef.current === editingEntry.id) {
        const prefilled = mapEntryOptionsToSelections(editingEntry, optionGroups);
        setOptionSelections(prefilled);
        optionPrefillEntryRef.current = null;
      }
      return;
    }

    const defaults = optionGroups.reduce<Record<string, string[]>>((acc, group) => {
      if (group.type === "radio") {
        const defaultOption = group.options.find((opt) => opt.defaultSelected) ?? group.options[0];
        acc[group.id] = defaultOption ? [defaultOption.id] : [];
      } else {
        acc[group.id] = group.options.filter((opt) => opt.defaultSelected).map((opt) => opt.id);
      }
      return acc;
    }, {});
    setOptionSelections(defaults);
  }, [activeUnit, optionGroups, editingEntry]);

  React.useEffect(() => {
    if (!activeUnit) {
      setUnitSize(1);
      unitSizePrefillEntryRef.current = null;
      return;
    }
    if (editingEntry) {
      if (unitSizePrefillEntryRef.current === editingEntry.id) {
        setUnitSize(clampUnitSize(editingEntry.unitSize));
        unitSizePrefillEntryRef.current = null;
      }
      return;
    }
    setUnitSize(clampUnitSize(minUnitSize));
  }, [activeUnit, clampUnitSize, editingEntry, minUnitSize]);

  const displayUnitSize = clampUnitSize(unitSize);

  const totalOptionPoints = React.useMemo(() => {
    return optionGroups.reduce((groupSum, group) => {
      const selectedIds = optionSelections[group.id] ?? [];
      return (
        groupSum +
        selectedIds.reduce((sum, selectedId) => {
          const opt = group.options.find((o) => o.id === selectedId);
          if (!opt) return sum;
          const optionTotal = opt.points * (opt.perModel ? displayUnitSize : 1);
          return sum + optionTotal;
        }, 0)
      );
    }, 0);
  }, [displayUnitSize, optionGroups, optionSelections]);

  const totalPoints = displayUnitSize * pointsPerModel + totalOptionPoints;

  const selection: CategorySelectionState = {
    activeCategory,
    units: activeUnits,
    hasUnits: activeUnits.length > 0,
    selectedUnitId,
    setSelectedUnitId,
    minUnitSize,
    maxUnitSize,
    unitSize,
    setUnitSize,
    incrementUnitSize: () => setUnitSize((prev) => clampUnitSize(prev + 1)),
    decrementUnitSize: () => setUnitSize((prev) => clampUnitSize(prev - 1)),
    clampUnitSize,
    displayUnitSize,
    pointsPerModel,
    optionGroups,
    optionSelections,
    onToggleOption: handleOptionToggle,
    onConfirm: handleConfirmSelection,
    onCancel: () => {
      if (editingEntryId) {
        setEditingEntryId(null);
        optionPrefillEntryRef.current = null;
        unitSizePrefillEntryRef.current = null;
      } else {
        setActiveCategory(null);
      }
      setSelectedUnitId(null);
      setOptionSelections({});
      setUnitSize(1);
    },
    totalPoints,
    totalOptionPoints,
    activeUnit,
    formatCategoryLabel,
    mode: editingEntry ? "edit" : "add",
    editingEntry,
  };

  return {
    isRosterReady,
    sections,
    entriesByCategory,
    activeCategory,
    onToggleCategory: handleToggleCategory,
    onEditEntry: handleStartEditingEntry,
    editingEntryId,
    selection,
  };
}
