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
import type { NormalizedArmyUnit as ArmyUnit } from "@/lib/data/catalog/types";
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
import {
  buildCategorySections,
  buildDefaultSelections,
  buildSelectedOptions,
  calculateOptionPoints,
  clampUnitSizeValue,
  mapEntryOptionsToSelections,
} from "./utils";

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
    pointsLimit > 0;

  const spent: Required<TotalsByCategory> = {
    characters: totals?.characters ?? totalsFromStore.characters ?? 0,
    core: totals?.core ?? totalsFromStore.core ?? 0,
    special: totals?.special ?? totalsFromStore.special ?? 0,
    rare: totals?.rare ?? totalsFromStore.rare ?? 0,
    mercenaries: totals?.mercenaries ?? totalsFromStore.mercenaries ?? 0,
    allies: totals?.allies ?? totalsFromStore.allies ?? 0,
  };

  const sections: CategorySection[] = React.useMemo(
    () => buildCategorySections(dict, spent, pointsLimit),
    [dict, pointsLimit, spent]
  );

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
    () => (activeUnit ? extractOptionGroups(activeUnit, dict) : []),
    [activeUnit, dict]
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
    (value: number) => clampUnitSizeValue(value, minUnitSize, maxUnitSize),
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
    (category: CategoryKey, _anchor?: HTMLElement | null) => {
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

    const selectedOptions = buildSelectedOptions(optionGroups, optionSelections, enforcedUnitSize);

    const costPerModel = Math.max(0, getUnitPoints(activeUnit));
    const basePoints = costPerModel * enforcedUnitSize;
    const optionsPoints = calculateOptionPoints(optionGroups, optionSelections, enforcedUnitSize);
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

    setOptionSelections(buildDefaultSelections(optionGroups));
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
    return calculateOptionPoints(optionGroups, optionSelections, displayUnitSize);
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
