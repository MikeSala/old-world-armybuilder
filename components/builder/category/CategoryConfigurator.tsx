import * as React from "react";

import { Button } from "@/components/ui/Button";
import Select, { type SelectOption } from "@/components/ui/Select";
import { getUnitKey, getUnitLabel } from "@/lib/builder/unitHelpers";

import { OptionGroupSection } from "./OptionGroupSection";
import type { Dict } from "./types";
import type { CategorySelectionState } from "./useCategoryBucketsState";

type Props = {
  dict: Dict;
  selection: CategorySelectionState;
};

export function CategoryConfigurator({ dict, selection }: Props) {
  const {
    activeCategory,
    units,
    hasUnits,
    selectedUnitId,
    setSelectedUnitId,
    minUnitSize,
    maxUnitSize,
    unitSize,
    setUnitSize,
    incrementUnitSize,
    decrementUnitSize,
    clampUnitSize,
    pointsPerModel,
    optionGroups,
    optionSelections,
    onToggleOption,
    onConfirmAdd,
    onCancel,
    totalPoints,
    formatCategoryLabel,
  } = selection;

  const getOptionsTitle = (category: CategorySelectionState["activeCategory"]) =>
    category ? dict.categoryOptionsTitle.replace("{category}", formatCategoryLabel(category)) : "";

  if (!activeCategory) {
    return (
      <section className="rounded-2xl border border-amber-300/30 bg-slate-900/60 p-5 text-amber-100 shadow-lg shadow-amber-900/10">
        <p className="text-sm text-amber-200/70">{dict.categoryConfiguratorPrompt}</p>
      </section>
    );
  }

  const options: SelectOption[] = units.map((unit, index) => ({
    id: getUnitKey(unit, index),
    label: getUnitLabel(unit),
  }));

  if (!hasUnits) {
    return (
      <section className="rounded-2xl border border-amber-300/30 bg-slate-900/60 p-5 text-amber-100 shadow-lg shadow-amber-900/10">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          {getOptionsTitle(activeCategory)}
        </h3>
        <p className="mt-4 text-sm text-amber-200/70">{dict.categoryEmptyUnitsMessage}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-amber-300/30 bg-slate-900/60 p-5 text-amber-100 shadow-lg shadow-amber-900/10">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300 lg:self-start">
          {getOptionsTitle(activeCategory)}
        </h3>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
          <Button variant="primary" size="sm" onClick={onConfirmAdd} disabled={!selectedUnitId}>
            {dict.categoryConfirmAddLabel}
          </Button>
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {dict.categoryCancelLabel}
          </Button>
        </div>
      </div>
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
            <span>{dict.categoryUnitSizeLabel}</span>
            <span>
              {pointsPerModel
                ? dict.categoryUnitPointsPerModel.replace("{value}", String(pointsPerModel))
                : dict.categoryUnitFlatCost}
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
                onClick={incrementUnitSize}
                className="rounded-md bg-slate-800 px-2 py-1 text-sm text-amber-100 shadow hover:bg-slate-700 active:translate-y-px"
                aria-label={dict.categoryUnitIncreaseAria}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={decrementUnitSize}
                className="mt-1 rounded-md bg-slate-800 px-2 py-1 text-sm text-amber-100 shadow hover:bg-slate-700 active:translate-y-px"
                aria-label={dict.categoryUnitDecreaseAria}
              >
                ▼
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200/60">
            <span>
              {dict.categoryUnitMinLabel} {minUnitSize}
              {maxUnitSize !== null ? `, ${dict.categoryUnitMaxLabel} ${maxUnitSize}` : ""}
            </span>
            <span className="text-amber-100">
              {dict.categoryUnitTotalPoints.replace("{value}", String(totalPoints))}
            </span>
          </div>
        </div>

        {optionGroups.length > 0 ? (
          <div className="space-y-3">
            {optionGroups.map((group) => (
              <OptionGroupSection
                key={group.id}
                dict={dict}
                group={group}
                selectedIds={optionSelections[group.id] ?? []}
                onToggle={onToggleOption}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-amber-200/70">{dict.categoryNoAdditionalOptions}</p>
        )}

        <div className="flex flex-col gap-2 lg:flex-row lg:justify-end">
          <Button variant="primary" size="sm" onClick={onConfirmAdd} disabled={!selectedUnitId}>
            {dict.categoryConfirmAddLabel}
          </Button>
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {dict.categoryCancelLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
