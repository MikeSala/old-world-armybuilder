"use client";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { selectSpentByCategory } from "@/lib/store/selectors/points";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import { Button } from "@/components/ui/Button";
import Select, { type SelectOption } from "@/components/ui/Select";
import { selectEmpireUnitsByCategory, type EmpireUnit } from "@/lib/store/selectors/catalog";
import { upsertEntry } from "@/lib/store/slices/rosterSlice";
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

function getUnitKey(unit: EmpireUnit, index: number): string {
  if (typeof unit.id === "string" && unit.id.trim().length > 0) return unit.id;
  if (typeof unit.name_en === "string" && unit.name_en.trim().length > 0) {
    return `${unit.name_en}-${index}`;
  }
  return `empire-unit-${index}`;
}

function getUnitLabel(unit: EmpireUnit): string {
  if (typeof unit.name_en === "string" && unit.name_en.trim().length > 0) return unit.name_en;
  if (typeof (unit as { name?: string }).name === "string")
    return (unit as { name?: string }).name!;
  if (typeof unit.id === "string") return unit.id;
  return "Unnamed unit";
}

function getUnitPoints(unit: EmpireUnit): number {
  return typeof unit.points === "number" ? unit.points : 0;
}

function getUnitNotes(unit: EmpireUnit): string | undefined {
  const notes = unit.notes as Record<string, unknown> | undefined;
  if (notes && typeof notes === "object") {
    const english = notes["name_en"];
    if (typeof english === "string" && english.trim().length > 0) return english;
  }
  return undefined;
}

// ---- UI: Category Row ----------------------------------------------------

function CategoryRow({
  title,
  rightValue,
  rightSuffix,
  emphasizeWarning,
  helpText,
  headerAction,
  children,
}: {
  title: string;
  rightValue: number;
  rightSuffix: string; // "pts missing" | "pts available"
  emphasizeWarning?: boolean; // true for missing state
  helpText: string;
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-amber-300/30 bg-slate-900/60 shadow-lg shadow-amber-900/20 backdrop-blur">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-amber-300/20 px-5 py-4">
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

      <div className="flex flex-1 flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end">
          {children}
        </div>
      </div>
    </div>
  );
}

// ---- Main component ------------------------------------------------------

export default function CategoryBuckets({ totals, onAddClick, dict, className }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  // Read points limit from Redux (roster.draft.pointsLimit)
  const pointsLimit = useSelector((s: RootState) => s.roster.draft.pointsLimit);
  const totalsFromStore = useSelector(selectSpentByCategory);
  const unitsByCategory = useSelector(selectEmpireUnitsByCategory);

  const [activeCategory, setActiveCategory] = React.useState<CategoryKey | null>(null);
  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(null);

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

  const handleToggleCategory = (category: CategoryKey) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      setSelectedUnitId(null);
      return;
    }
    const units = unitsByCategory[category] ?? [];
    const firstId = units.length > 0 ? getUnitKey(units[0], 0) : null;
    setActiveCategory(category);
    setSelectedUnitId(firstId);
  };

  const handleConfirmAdd = () => {
    if (!activeCategory || !selectedUnitId) return;
    const units = unitsByCategory[activeCategory] ?? [];
    const unit = units.find((candidate, index) => getUnitKey(candidate, index) === selectedUnitId);
    if (!unit) return;

    const entryId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    dispatch(
      upsertEntry({
        id: entryId,
        unitId: typeof unit.id === "string" ? unit.id : selectedUnitId,
        name: getUnitLabel(unit),
        category: activeCategory,
        points: getUnitPoints(unit),
        notes: getUnitNotes(unit),
      })
    );

    onAddClick?.(activeCategory);
    setActiveCategory(null);
    setSelectedUnitId(null);
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
  }, [activeCategory, unitsByCategory, selectedUnitId]);

  const sections: Array<{
    key: CategoryKey;
    title: string;
    value: number;
    suffix: string;
    helpText: string;
    warning?: boolean;
  }> = [
    {
      key: "characters",
      title: dict.categoryCharactersLabel,
      value: charactersAvailable,
      suffix: dict.categoryPtsAvailable,
      helpText: dict.categoryHelpDefault,
    },
    {
      key: "core",
      title: dict.categoryCoreLabel,
      value: coreMissing > 0 ? coreMissing : 0,
      suffix: coreMissing > 0 ? dict.categoryPtsMissing : dict.categoryPtsAvailable,
      helpText: coreMissing > 0 ? dict.categoryHelpWarning : dict.categoryHelpDefault,
      warning: coreMissing > 0,
    },
    {
      key: "special",
      title: dict.categorySpecialLabel,
      value: specialAvailable,
      suffix: dict.categoryPtsAvailable,
      helpText: dict.categoryHelpDefault,
    },
    {
      key: "rare",
      title: dict.categoryRareLabel,
      value: rareAvailable,
      suffix: dict.categoryPtsAvailable,
      helpText: dict.categoryHelpDefault,
    },
    {
      key: "mercenaries",
      title: dict.categoryMercsLabel,
      value: mercsAvailable,
      suffix: dict.categoryPtsAvailable,
      helpText: dict.categoryHelpDefault,
    },
    {
      key: "allies",
      title: dict.categoryAlliesLabel,
      value: alliesAvailable,
      suffix: dict.categoryPtsAvailable,
      helpText: dict.categoryHelpDefault,
    },
  ];

  const sectionClassName = "grid gap-6 sm:grid-cols-2 text-amber-100";
  const containerClassName = className ? `${sectionClassName} ${className}` : sectionClassName;

  return (
    <section className={containerClassName}>
      {sections.map((section) =>
        (() => {
          const isActive = activeCategory === section.key;
          const units = unitsByCategory[section.key] ?? [];
          const options: SelectOption[] = units.map((unit, index) => ({
            id: getUnitKey(unit, index),
            label: getUnitLabel(unit),
          }));
          const addDisabled = !section.warning && section.value <= 0 && !isActive;
          const addIcon = isActive ? "×" : "+";
          const addLabel = isActive ? dict.categoryToggleCloseLabel : dict.categoryAddLabel;
          const headerAction = (
            <Button
              variant="accent"
              size="sm"
              onClick={() => handleToggleCategory(section.key)}
              disabled={addDisabled}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-slate-900/10 text-sm font-bold">
                {addIcon}
              </span>
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
              helpText={section.helpText}
              headerAction={headerAction}
            >
              {isActive ? (
                options.length > 0 ? (
                  <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:justify-end">
                    <Select
                      options={options}
                      value={selectedUnitId}
                      onChange={(next) => setSelectedUnitId(next)}
                      placeholder={dict.categorySelectPlaceholder}
                      className="w-full md:min-w-[220px]"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleConfirmAdd}
                      disabled={!selectedUnitId}
                    >
                      {dict.categoryConfirmAddLabel}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleToggleCategory(section.key)}
                    >
                      {dict.categoryCancelLabel}
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-amber-200/70 md:max-w-xs">
                    {dict.categoryEmptyUnitsMessage}
                  </span>
                )
              ) : null}
            </CategoryRow>
          );
        })()
      )}
    </section>
  );
}
