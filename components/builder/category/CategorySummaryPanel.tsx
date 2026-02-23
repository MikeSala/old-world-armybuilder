import * as React from "react";

import { PlusIcon } from "@/components/icons/PlusIcon";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

import { CategoryEntryList } from "./CategoryEntryList";
import { CategorySummaryCard } from "./CategorySummaryCard";
import type { CategorySection, Dict, EntriesByCategory } from "./types";
import type { OptionLabelByUnitId } from "@/lib/builder/unitHelpers";

type Props = {
  sections: CategorySection[];
  totalSpent: number;
  pointsLimit: number;
  activeCategory: CategoryKey | null;
  entriesByCategory: EntriesByCategory;
  dict: Dict;
  unitLabelById?: Map<string, string>;
  optionLabelByUnitId?: OptionLabelByUnitId;
  onToggleCategory: (key: CategoryKey, anchor?: HTMLElement | null) => void;
  onEntrySelect?: (entryId: string) => void;
  selectedEntryId?: string | null;
};

type ItemProps = {
  section: CategorySection;
  activeCategory: CategoryKey | null;
  entriesByCategory: EntriesByCategory;
  dict: Dict;
  unitLabelById?: Map<string, string>;
  optionLabelByUnitId?: OptionLabelByUnitId;
  onToggleCategory: (key: CategoryKey, anchor?: HTMLElement | null) => void;
  onEntrySelect?: (entryId: string) => void;
  selectedEntryId?: string | null;
};

function CategorySummaryItem({
  section,
  activeCategory,
  entriesByCategory,
  dict,
  unitLabelById,
  optionLabelByUnitId,
  onToggleCategory,
  onEntrySelect,
  selectedEntryId,
}: ItemProps) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const categoryEntries = entriesByCategory[section.key] ?? [];
  const isActive = activeCategory === section.key;
  const shouldEnforceCap = section.enforceCap ?? true;
  const addDisabled = shouldEnforceCap ? (!section.warning && section.value <= 0 && !isActive) : false;

  return (
    <div ref={cardRef}>
      <CategorySummaryCard
        title={section.title}
        rightValue={section.value}
        rightSuffix={section.suffix}
        rightText={section.formattedValue}
        emphasizeWarning={section.warning}
        headerAction={
          <button
            type="button"
            onClick={() => onToggleCategory(section.key, cardRef.current)}
            disabled={addDisabled}
            aria-label={dict.categoryAddLabel}
            className="print:hidden inline-flex h-7 w-7 items-center justify-center rounded-md border border-stone-400 bg-stone-100 text-stone-900 transition-all duration-200 hover:border-stone-500 hover:bg-stone-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:border-stone-400 dark:hover:bg-stone-700"
          >
            <PlusIcon className="h-3.5 w-3.5 shrink-0" />
          </button>
        }
      >
        {categoryEntries.length > 0 ? (
          <CategoryEntryList
            entries={categoryEntries}
            dict={dict}
            unitLabelById={unitLabelById}
            optionLabelByUnitId={optionLabelByUnitId}
            onSelect={
              onEntrySelect
                ? (entry) => {
                    onEntrySelect(entry.id);
                  }
                : undefined
            }
            activeEntryId={selectedEntryId}
          />
        ) : null}
      </CategorySummaryCard>
    </div>
  );
}

export function CategorySummaryPanel({
  sections,
  totalSpent,
  pointsLimit,
  activeCategory,
  entriesByCategory,
  dict,
  unitLabelById,
  optionLabelByUnitId,
  onToggleCategory,
  onEntrySelect,
  selectedEntryId,
}: Props) {
  const totalSpentText = dict.categoryTotalPointsSummary
    .replace("{total}", String(totalSpent))
    .replace("{limit}", String(pointsLimit));

  return (
    <section className="space-y-2">
      <div className="rounded-2xl border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 dark:border-stone-300/20 dark:bg-stone-800/40 dark:text-stone-100/80">
        {totalSpentText}
      </div>
      {sections.map((section) => (
        <CategorySummaryItem
          key={section.key}
          section={section}
          activeCategory={activeCategory}
          entriesByCategory={entriesByCategory}
          dict={dict}
          unitLabelById={unitLabelById}
          optionLabelByUnitId={optionLabelByUnitId}
          onToggleCategory={onToggleCategory}
          onEntrySelect={onEntrySelect}
          selectedEntryId={selectedEntryId}
        />
      ))}
    </section>
  );
}
