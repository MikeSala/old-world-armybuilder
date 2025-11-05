import { Button } from "@/components/ui/Button";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

import { CategoryEntryList } from "./CategoryEntryList";
import { CategorySummaryCard } from "./CategorySummaryCard";
import type { CategorySection, Dict, EntriesByCategory } from "./types";

type Props = {
  sections: CategorySection[];
  activeCategory: CategoryKey | null;
  entriesByCategory: EntriesByCategory;
  dict: Dict;
  onToggleCategory: (key: CategoryKey) => void;
  onEntrySelect?: (entryId: string) => void;
  selectedEntryId?: string | null;
};

export function CategorySummaryPanel({
  sections,
  activeCategory,
  entriesByCategory,
  dict,
  onToggleCategory,
  onEntrySelect,
  selectedEntryId,
}: Props) {
  return (
    <section className="space-y-2">
      {sections.map((section) => {
        const categoryEntries = entriesByCategory[section.key] ?? [];
        const isActive = activeCategory === section.key;
        const shouldEnforceCap = section.enforceCap ?? true;
        const addDisabled = shouldEnforceCap ? (!section.warning && section.value <= 0 && !isActive) : false;

        return (
          <CategorySummaryCard
            key={section.key}
            title={section.title}
            rightValue={section.value}
            rightSuffix={section.suffix}
            rightText={section.formattedValue}
            emphasizeWarning={section.warning}
          >
            <div className="flex flex-col gap-2">
              {categoryEntries.length > 0 ? (
                <CategoryEntryList
                  entries={categoryEntries}
                  dict={dict}
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
              <div className="flex print:hidden self-center">
                <Button
                  className="w-36"
                  variant="secondary"
                  size="sm"
                  onClick={() => onToggleCategory(section.key)}
                  disabled={addDisabled}
                  leftIcon={
                    <span className="flex h-6 w-6 items-center justify-center text-sm font-bold leading-none">
                      +
                    </span>
                  }
                >
                  {dict.categoryAddLabel}
                </Button>
              </div>
            </div>
          </CategorySummaryCard>
        );
      })}
    </section>
  );
}
