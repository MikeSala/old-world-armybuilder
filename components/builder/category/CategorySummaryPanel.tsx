import * as React from "react";
import { Button } from "@/components/ui/Button";
import type { CategoryKey } from "@/lib/data/domain/types/categories";
import { CategorySummaryCard } from "./CategorySummaryCard";
import { CategoryEntryList } from "./CategoryEntryList";
import type { CategorySection, Dict, EntriesByCategory } from "./types";

type Props = {
  sections: CategorySection[];
  activeCategory: CategoryKey | null;
  entriesByCategory: EntriesByCategory;
  dict: Dict;
  onToggleCategory: (key: CategoryKey) => void;
};

export function CategorySummaryPanel({
  sections,
  activeCategory,
  entriesByCategory,
  dict,
  onToggleCategory,
}: Props) {
  return (
    <section className="space-y-4">
      {sections.map((section) => {
        const isActive = activeCategory === section.key;
        const addDisabled = !section.warning && section.value <= 0 && !isActive;
        const categoryEntries = entriesByCategory[section.key] ?? [];
        const addIcon = isActive ? "×" : "+";
        const addLabel = isActive ? dict.categoryToggleCloseLabel : dict.categoryAddLabel;
        const headerAction = (
          <Button
            className="w-28"
            variant="accent"
            size="sm"
            onClick={() => onToggleCategory(section.key)}
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
          <CategorySummaryCard
            key={section.key}
            title={section.title}
            rightValue={section.value}
            rightSuffix={section.suffix}
            emphasizeWarning={section.warning}
            headerAction={headerAction}
          >
            {categoryEntries.length > 0 ? <CategoryEntryList entries={categoryEntries} /> : null}
          </CategorySummaryCard>
        );
      })}
    </section>
  );
}
