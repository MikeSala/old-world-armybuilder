import * as React from "react";

import { Button } from "@/components/ui/Button";
import Select, { type SelectOption } from "@/components/ui/Select";
import { getLocalizedUnitLabel, getUnitKey } from "@/lib/builder/unitHelpers";
import { translateNameForDict } from "@/lib/i18n/translateLocale";
import { TAILWIND_CARDS, TAILWIND_TEXT } from "@/lib/styles/tailwindConstants";

import { OptionGroupSection } from "./OptionGroupSection";
import type { Dict } from "./types";
import type { CategorySelectionState } from "./useCategoryBucketsState";

type Props = {
  dict: Dict;
  selection: CategorySelectionState;
};

export const CategoryConfigurator = React.forwardRef<HTMLElement, Props>(function CategoryConfigurator(
  { dict, selection },
  ref
) {
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
    onConfirm,
    onCancel,
    totalPoints,
    mode,
    editingEntry,
    activeUnit,
  } = selection;

  const isEditing = mode === "edit";
  const activeUnitLabel = activeUnit ? getLocalizedUnitLabel(activeUnit, dict) : null;
  const optionsTitle =
    isEditing && editingEntry
      ? dict.categoryEditTitle.replace(
          "{unit}",
          activeUnitLabel ?? translateNameForDict(editingEntry.name, dict)
        )
      : dict.categoryOptionsDefaultLabel;
  const confirmLabel = isEditing ? dict.categoryConfirmSaveLabel : dict.categoryConfirmAddLabel;

  if (!activeCategory) {
    return (
      <section
        ref={ref}
        className={TAILWIND_CARDS.CONFIGURATOR_SECTION}
      >
        <p className={TAILWIND_TEXT.MUTED_SHORT}>{dict.categoryConfiguratorPrompt}</p>
      </section>
    );
  }

  const options: SelectOption[] = units.map((unit, index) => ({
    id: getUnitKey(unit, index),
    label: getLocalizedUnitLabel(unit, dict),
  }));

  if (!hasUnits) {
    return (
      <section
        ref={ref}
        className={TAILWIND_CARDS.CONFIGURATOR_SECTION}
      >
        <h3 className={TAILWIND_TEXT.SECTION_HEADING}>
          {optionsTitle}
        </h3>
        <p className="mt-4 text-sm text-stone-200/70">{dict.categoryEmptyUnitsMessage}</p>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={TAILWIND_CARDS.CONFIGURATOR_SECTION}
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h3 className={`${TAILWIND_TEXT.SECTION_HEADING} lg:self-start`}>
          {optionsTitle}
        </h3>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
          <Button variant="primary" size="sm" onClick={onConfirm} disabled={!selectedUnitId}>
            {confirmLabel}
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

        <div className={TAILWIND_CARDS.OPTION_CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wide text-stone-200/80">
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
              className="w-full rounded-lg border border-stone-400 bg-stone-900/60 px-4 py-2 text-base text-stone-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400"
            />
            <div className="ml-2 flex flex-col">
              <button
                type="button"
                onClick={incrementUnitSize}
                className="rounded-md bg-stone-700 px-2 py-1 text-sm text-stone-100 shadow transition-all duration-200 hover:bg-stone-600 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                aria-label={dict.categoryUnitIncreaseAria}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={decrementUnitSize}
                className="mt-1 rounded-md bg-stone-700 px-2 py-1 text-sm text-stone-100 shadow transition-all duration-200 hover:bg-stone-600 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                aria-label={dict.categoryUnitDecreaseAria}
              >
                ▼
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-200/60">
            <span>
              {dict.categoryUnitMinLabel} {minUnitSize}
              {maxUnitSize !== null ? `, ${dict.categoryUnitMaxLabel} ${maxUnitSize}` : ""}
            </span>
            <span className="text-stone-100">
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
          <p className="text-sm text-stone-200/70">{dict.categoryNoAdditionalOptions}</p>
        )}

        <div className="flex flex-col gap-2 lg:flex-row lg:justify-end">
          <Button variant="primary" size="sm" onClick={onConfirm} disabled={!selectedUnitId}>
            {confirmLabel}
          </Button>
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {dict.categoryCancelLabel}
          </Button>
        </div>
      </div>
    </section>
  );
});
