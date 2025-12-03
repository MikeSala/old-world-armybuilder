import * as React from "react";

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
  onToggleCategory: (key: CategoryKey, anchor?: HTMLElement | null) => void;
  onEntrySelect?: (entryId: string) => void;
  selectedEntryId?: string | null;
};

type ItemProps = {
  section: CategorySection;
  activeCategory: CategoryKey | null;
  entriesByCategory: EntriesByCategory;
  dict: Dict;
  onToggleCategory: (key: CategoryKey, anchor?: HTMLElement | null) => void;
  onEntrySelect?: (entryId: string) => void;
  selectedEntryId?: string | null;
};

function CategorySummaryItem({
  section,
  activeCategory,
  entriesByCategory,
  dict,
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
          <div className="flex self-center print:hidden">
            <Button
              variant="secondary"
              size="sm"
              className="w-36 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              onClick={() => onToggleCategory(section.key, cardRef.current)}
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
    </div>
  );
}

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
      {sections.map((section) => (
        <CategorySummaryItem
          key={section.key}
          section={section}
          activeCategory={activeCategory}
          entriesByCategory={entriesByCategory}
          dict={dict}
          onToggleCategory={onToggleCategory}
          onEntrySelect={onEntrySelect}
          selectedEntryId={selectedEntryId}
        />
      ))}
    </section>
  );
}
