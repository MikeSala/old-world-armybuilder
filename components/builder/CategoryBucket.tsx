"use client";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { selectSpentByCategory } from "@/lib/store/selectors/points";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import { Button } from "@/components/ui/Button";
import Select, { type SelectOption } from "@/components/ui/Select";
import { selectUnitsByCategory, type ArmyUnit } from "@/lib/store/selectors/catalog";
import { upsertEntry, type RosterEntry } from "@/lib/store/slices/rosterSlice";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";

type TotalsByCategory = Partial<Record<CategoryKey, number>>;

type Dict = Pick<
  LocaleDictionary,
  | "categoryAddLabel"
  | "categoryPtsAvailable"
  | "categoryPtsMissing"
  | "categoryCoreLabel"
  | "categoryCharactersLabel"
  | "categorySpecialLabel"
  | "categoryRareLabel"
  | "categoryMercsLabel"
  | "categoryAlliesLabel"
  | "categoryHelpDefault"
  | "categoryHelpWarning"
  | "categoryToggleCloseLabel"
  | "categorySelectPlaceholder"
  | "categoryConfirmAddLabel"
  | "categoryCancelLabel"
  | "categoryEmptyUnitsMessage"
>;

type Props = {
  totals?: TotalsByCategory; // current spent per category (default 0)
  onAddClick?: (category: CategoryKey) => void;
  dict: Dict;
  className?: string;
};

function clampNonNeg(n: number) {
  return n < 0 ? 0 : n;
}

// If you want to snap to nearest 5/10/50 later, you can place it here.
function roundPoints(n: number) {
  return Math.round(n);
}

function getUnitKey(unit: ArmyUnit, index: number): string {
  if (typeof unit.id === "string" && unit.id.trim().length > 0) return unit.id;
  if (typeof unit.name_en === "string" && unit.name_en.trim().length > 0) {
    return `${unit.name_en}-${index}`;
  }
  return `empire-unit-${index}`;
}

function getUnitLabel(unit: ArmyUnit): string {
  if (typeof unit.name_en === "string" && unit.name_en.trim().length > 0) return unit.name_en;
  if (typeof (unit as { name?: string }).name === "string")
    return (unit as { name?: string }).name!;
  if (typeof unit.id === "string") return unit.id;
  return "Unnamed unit";
}

function getUnitPoints(unit: ArmyUnit): number {
  return typeof unit.points === "number" ? unit.points : 0;
}

function getUnitNotes(unit: ArmyUnit): string | undefined {
  const notes = unit.notes as Record<string, unknown> | undefined;
  if (notes && typeof notes === "object") {
    const english = notes["name_en"];
    if (typeof english === "string" && english.trim().length > 0) return english;
  }
  return undefined;
}

function formatCategoryLabel(category: string): string {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type OptionSourceKey = "command" | "equipment" | "armor" | "options" | "mounts";

type UnitOptionItem = {
  id: string;
  label: string;
  points: number;
  note?: string;
  defaultSelected?: boolean;
  perModel?: boolean;
};

type UnitOptionGroup = {
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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function extractOptionGroups(unit: ArmyUnit): UnitOptionGroup[] {
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

function findUnitByKey(units: ArmyUnit[], key: string | null) {
  if (units.length === 0) return null;
  if (!key) return { unit: units[0], index: 0 };
  const foundIndex = units.findIndex((candidate, idx) => getUnitKey(candidate, idx) === key);
  const index = foundIndex >= 0 ? foundIndex : 0;
  return { unit: units[index], index };
}

// ---- UI: Category Row ----------------------------------------------------

function CategoryRow({
  title,
  rightValue,
  rightSuffix,
  emphasizeWarning,
  headerAction,
  children,
}: {
  title: string;
  rightValue: number;
  rightSuffix: string; // "pts missing" | "pts available"
  emphasizeWarning?: boolean; // true for missing state
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className="flex flex-col rounded-2xl border border-amber-300/30 bg-slate-900/60 shadow-lg shadow-amber-900/20 backdrop-blur">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3">
        <div className="text-lg font-semibold text-amber-200">{title}</div>
        <div className="flex justify-center">{headerAction ?? <span className="hidden" />}</div>
        <div
          className={`text-right text-sm font-semibold tracking-wide ${
            emphasizeWarning ? "text-red-300" : "text-amber-200/80"
          }`}
        >
          {rightValue} {rightSuffix}
        </div>
      </div>

      {hasChildren ? (
        <div className="border-t border-amber-300/10 px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ---- Main component ------------------------------------------------------

export default function CategoryBuckets({ totals, onAddClick, dict, className }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  // Read points limit from Redux (roster.draft.pointsLimit)
  const pointsLimit = useSelector((s: RootState) => s.roster.draft.pointsLimit);
  const totalsFromStore = useSelector(selectSpentByCategory);
  const unitsByCategory = useSelector(selectUnitsByCategory);
  const rosterEntries = useSelector((s: RootState) => s.roster.draft.entries ?? []);

  const [activeCategory, setActiveCategory] = React.useState<CategoryKey | null>(null);
  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(null);
  const [optionSelections, setOptionSelections] = React.useState<Record<string, string[]>>({});
  const [unitSize, setUnitSize] = React.useState<number>(1);

  // Current spent per category (default 0 if not provided yet)
  const spent: Required<TotalsByCategory> = {
    characters: totals?.characters ?? totalsFromStore.characters ?? 0,
    core: totals?.core ?? totalsFromStore.core ?? 0,
    special: totals?.special ?? totalsFromStore.special ?? 0,
    rare: totals?.rare ?? totalsFromStore.rare ?? 0,
    mercenaries: totals?.mercenaries ?? totalsFromStore.mercenaries ?? 0,
    allies: totals?.allies ?? totalsFromStore.allies ?? 0,
  };

  // Composition rules (percentages of total points)
  const minCore = roundPoints(pointsLimit * 0.25); // e.g., 2000 -> 500, 3000 -> 750

  const caps = {
    characters: roundPoints(pointsLimit * 0.5),
    special: roundPoints(pointsLimit * 0.5),
    rare: roundPoints(pointsLimit * 0.25),
    mercenaries: roundPoints(pointsLimit * 0.2),
    allies: roundPoints(pointsLimit * 0.25),
  } as const;

  // Derived values for display
  const coreMissing = clampNonNeg(minCore - spent.core);
  const charactersAvailable = clampNonNeg(caps.characters - spent.characters);
  const specialAvailable = clampNonNeg(caps.special - spent.special);
  const rareAvailable = clampNonNeg(caps.rare - spent.rare);
  const mercsAvailable = clampNonNeg(caps.mercenaries - spent.mercenaries);
  const alliesAvailable = clampNonNeg(caps.allies - spent.allies);

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

  const pointsPerModel = React.useMemo(() => (activeUnit ? getUnitPoints(activeUnit) : 0), [activeUnit]);

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

  const entriesByCategory = React.useMemo(() => {
    const grouped: Partial<Record<CategoryKey, RosterEntry[]>> = {};
    rosterEntries.forEach((entry) => {
      if (!grouped[entry.category]) grouped[entry.category] = [];
      grouped[entry.category]!.push(entry);
    });
    return grouped;
  }, [rosterEntries]);

  const handleToggleCategory = (category: CategoryKey) => {
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
  };

  const handleOptionToggle = (group: UnitOptionGroup, optionId: string, checked: boolean) => {
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
  };

  const handleConfirmAdd = () => {
    if (!activeCategory || !activeUnit) return;

    const entryId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
            : selectedUnitId ?? entryId,
        name: getUnitLabel(activeUnit),
        category: activeCategory,
        unitSize: enforcedUnitSize,
        pointsPerModel: costPerModel,
        basePoints,
        options: selectedOptions,
        totalPoints,
        notes: getUnitNotes(activeUnit),
        owned: false,
      })
    );

    onAddClick?.(activeCategory);
    setActiveCategory(null);
    setSelectedUnitId(null);
    setOptionSelections({});
    setUnitSize(1);
  };

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
    const defaults = optionGroups.reduce<Record<string, string[]>>((acc, group) => {
      if (group.type === "radio") {
        const defaultOption =
          group.options.find((opt) => opt.defaultSelected) ?? group.options[0];
        acc[group.id] = defaultOption ? [defaultOption.id] : [];
      } else {
        acc[group.id] = group.options
          .filter((opt) => opt.defaultSelected)
          .map((opt) => opt.id);
      }
      return acc;
    }, {});
    setOptionSelections(defaults);
  }, [activeUnit, optionGroups]);

  React.useEffect(() => {
    if (!activeUnit) {
      setUnitSize(1);
      return;
    }
    setUnitSize(clampUnitSize(minUnitSize));
  }, [activeUnit, clampUnitSize, minUnitSize]);

  const sections: Array<{
    key: CategoryKey;
    title: string;
    value: number;
    suffix: string;
    warning?: boolean;
  }> = [
    {
      key: "characters",
      title: dict.categoryCharactersLabel,
      value: charactersAvailable,
      suffix: dict.categoryPtsAvailable,
    },
    {
      key: "core",
      title: dict.categoryCoreLabel,
      value: coreMissing > 0 ? coreMissing : 0,
      suffix: coreMissing > 0 ? dict.categoryPtsMissing : dict.categoryPtsAvailable,
      warning: coreMissing > 0,
    },
    {
      key: "special",
      title: dict.categorySpecialLabel,
      value: specialAvailable,
      suffix: dict.categoryPtsAvailable,
    },
    {
      key: "rare",
      title: dict.categoryRareLabel,
      value: rareAvailable,
      suffix: dict.categoryPtsAvailable,
    },
    {
      key: "mercenaries",
      title: dict.categoryMercsLabel,
      value: mercsAvailable,
      suffix: dict.categoryPtsAvailable,
    },
    {
      key: "allies",
      title: dict.categoryAlliesLabel,
      value: alliesAvailable,
      suffix: dict.categoryPtsAvailable,
    },
  ];

  const categoryGridClass =
    "grid gap-6 text-amber-100 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-start";
  const displayUnitSize = clampUnitSize(unitSize);

  return (
    <div className={className}>
      <div className={categoryGridClass}>
        <section className="space-y-4">
          {sections.map((section) =>
            (() => {
              const isActive = activeCategory === section.key;
              const addDisabled = !section.warning && section.value <= 0 && !isActive;
              const categoryEntries = entriesByCategory[section.key] ?? [];
              const addIcon = isActive ? "×" : "+";
              const addLabel = isActive ? dict.categoryToggleCloseLabel : dict.categoryAddLabel;
              const headerAction = (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => handleToggleCategory(section.key)}
                  disabled={addDisabled}
                  leftIcon={
                    <span className="flex h-5 w-5 items-center justify-center text-sm font-bold leading-none">
                      {addIcon}
                    </span>
                  }
                >
                  {addLabel}
                </Button>
              );

              return (
                <CategoryRow
                  key={section.key}
                  title={section.title}
                  rightValue={section.value}
                  rightSuffix={section.suffix}
                  emphasizeWarning={section.warning}
                  headerAction={headerAction}
                >
                  {categoryEntries.length > 0 ? (
                    <CategoryEntryList entries={categoryEntries} />
                  ) : null}
                </CategoryRow>
              );
            })()
          )}
        </section>
        <section className="rounded-2xl border border-amber-300/30 bg-slate-900/60 p-5 text-amber-100 shadow-lg shadow-amber-900/10">
          {activeCategory ? (
            <>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                {`Options for ${formatCategoryLabel(activeCategory)}`}
              </h3>
              {(() => {
                const units = unitsByCategory[activeCategory] ?? [];
                const options: SelectOption[] = units.map((unit, index) => ({
                  id: getUnitKey(unit, index),
                  label: getUnitLabel(unit),
                }));

                if (options.length === 0) {
                  return (
                    <p className="mt-4 text-sm text-amber-200/70">
                      {dict.categoryEmptyUnitsMessage}
                    </p>
                  );
                }

                return (
                  <div className="mt-4 space-y-3">
                    <Select
                      options={options}
                      value={selectedUnitId}
                      onChange={(next) => setSelectedUnitId(next)}
                      placeholder={dict.categorySelectPlaceholder}
                      className="w-full"
                    />

                    <div className="rounded-xl border border-amber-300/20 bg-slate-900/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wide text-amber-200/80">
                        <span>Unit size</span>
                        <span>
                          {pointsPerModel ? `${pointsPerModel} pts per model` : "Flat cost"}
                        </span>
                      </div>
                      <div className="mt-3 flex items-stretch">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={minUnitSize}
                          max={maxUnitSize ?? undefined}
                          step={1}
                          value={unitSize}
                          onChange={(event) => {
                            const parsed = Number(event.target.value);
                            if (Number.isFinite(parsed)) {
                              setUnitSize(parsed);
                            } else {
                              setUnitSize(minUnitSize);
                            }
                          }}
                          onBlur={() => setUnitSize((prev) => clampUnitSize(prev))}
                          className="w-full rounded-lg border border-slate-400 bg-slate-950/60 px-4 py-2 text-base text-amber-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400"
                        />
                        <div className="ml-2 flex flex-col">
                          <button
                            type="button"
                            onClick={() => setUnitSize((prev) => clampUnitSize(prev + 1))}
                            className="rounded-md bg-slate-800 px-2 py-1 text-sm text-amber-100 shadow hover:bg-slate-700 active:translate-y-px"
                            aria-label="Increase unit size"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => setUnitSize((prev) => clampUnitSize(prev - 1))}
                            className="mt-1 rounded-md bg-slate-800 px-2 py-1 text-sm text-amber-100 shadow hover:bg-slate-700 active:translate-y-px"
                            aria-label="Decrease unit size"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200/60">
                        <span>
                          Min {minUnitSize}
                          {maxUnitSize !== null ? `, Max ${maxUnitSize}` : ""}
                        </span>
                        <span className="text-amber-100">
                          {displayUnitSize * pointsPerModel +
                            optionGroups.reduce((groupSum, group) => {
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
                            }, 0)}{" "}
                          pts total
                        </span>
                      </div>
                    </div>

                    {optionGroups.length > 0 ? (
                      <div className="space-y-3">
                        {optionGroups.map((group) => (
                          <OptionGroupSection
                            key={group.id}
                            group={group}
                            selectedIds={optionSelections[group.id] ?? []}
                            onToggle={handleOptionToggle}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-amber-200/70">
                        No additional options for this unit.
                      </p>
                    )}

                    <div className="flex flex-col gap-2 lg:flex-row lg:justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleConfirmAdd}
                        disabled={!selectedUnitId}
                      >
                        {dict.categoryConfirmAddLabel}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setActiveCategory(null)}>
                        {dict.categoryCancelLabel}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <p className="text-sm text-amber-200/70">
              {dict.categoryHelpDefault ?? "Select a category to see options."}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

type OptionGroupSectionProps = {
  group: UnitOptionGroup;
  selectedIds: string[];
  onToggle: (group: UnitOptionGroup, optionId: string, checked: boolean) => void;
};

function CategoryEntryList({ entries }: { entries: RosterEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <ul className="space-y-2">
      {entries.map((entry) => {
        const optionNames = entry.options
          .map((opt) => opt.name)
          .filter((name): name is string => Boolean(name && name.trim().length > 0));
        const unitSummary =
          entry.unitSize > 1
            ? `${entry.unitSize} models`
            : entry.unitSize === 1
            ? "Single model"
            : null;

        return (
          <li
            key={entry.id}
            className="rounded-lg border border-amber-300/10 bg-slate-900/50 px-3 py-2"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-amber-100">{entry.name}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-200/80">
                {entry.totalPoints} pts
              </span>
            </div>
            {unitSummary ? (
              <div className="text-xs text-amber-200/70">
                {unitSummary}
                {entry.pointsPerModel ? ` · ${entry.pointsPerModel} pts per model` : null}
              </div>
            ) : null}
            {optionNames.length > 0 ? (
              <div className="mt-1 text-xs text-amber-200/70">{optionNames.join(", ")}</div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function OptionGroupSection({ group, selectedIds, onToggle }: OptionGroupSectionProps) {
  return (
    <section className="rounded-xl border border-amber-300/20 bg-slate-900/60 p-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-amber-200">
        {group.title}
      </h4>
      <ul className="mt-3 space-y-2">
        {group.options.map((option) => {
          const inputId = `${group.id}-${option.id}`;
          const checked = selectedIds.includes(option.id);
          const type = group.type === "radio" ? "radio" : "checkbox";
          return (
            <li key={option.id} className="flex items-start justify-between gap-3">
              <label htmlFor={inputId} className="flex flex-1 cursor-pointer items-start gap-3 text-sm">
                <input
                  id={inputId}
                  name={group.id}
                  type={type}
                  checked={checked}
                  onChange={(event) =>
                    onToggle(group, option.id, group.type === "radio" ? true : event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-amber-400 bg-slate-900 text-amber-500 focus:ring-amber-500"
                />
                <span className="flex flex-col text-amber-100/90">
                  <span className="font-medium">{option.label}</span>
                  {option.note ? (
                    <span className="text-xs text-amber-200/70">{option.note}</span>
                  ) : null}
                </span>
              </label>
              <span className="text-xs font-semibold text-amber-200/80">
                {option.points
                  ? `${option.points} pts${option.perModel ? " / model" : ""}`
                  : "free"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
