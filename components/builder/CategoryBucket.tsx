"use client";

import * as React from "react";
import type { CategoryKey } from "@/lib/data/domain/types/categories";

import { CategoryConfigurator } from "./category/CategoryConfigurator";
import { CategoryLockedNotice } from "./category/CategoryLockedNotice";
import { CategorySummaryPanel } from "./category/CategorySummaryPanel";
import type { Dict, TotalsByCategory } from "./category/types";
import { useCategoryBucketsState } from "./category/useCategoryBucketsState";

type Props = {
  totals?: TotalsByCategory;
  onAddClick?: (category: CategoryKey) => void;
  dict: Dict;
  className?: string;
};

export default function CategoryBuckets({ totals, onAddClick, dict, className }: Props) {
  const {
    isRosterReady,
    sections,
    entriesByCategory,
    activeCategory,
    onToggleCategory,
    onEditEntry,
    editingEntryId,
    selection,
  } = useCategoryBucketsState({
    totals,
    onAddClick,
    dict,
  });
  const configuratorRef = React.useRef<HTMLElement | null>(null);

  const scrollConfiguratorToAnchor = React.useCallback((anchor?: HTMLElement | null) => {
    if (!anchor || !configuratorRef.current || typeof window === "undefined") return;
    const delta =
      anchor.getBoundingClientRect().top - configuratorRef.current.getBoundingClientRect().top;
    if (Math.abs(delta) < 4) return;
    window.scrollBy({ top: delta, behavior: "smooth" });
  }, []);

  const handleToggleCategory = React.useCallback(
    (category: CategoryKey, anchor?: HTMLElement | null) => {
      onToggleCategory(category, anchor);
      scrollConfiguratorToAnchor(anchor);
    },
    [onToggleCategory, scrollConfiguratorToAnchor]
  );

  const categoryGridClass =
    "grid gap-6 text-amber-100 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-start";

  return (
    <div className={className}>
      {!isRosterReady ? (
        <CategoryLockedNotice dict={dict} />
      ) : (
        <div className={categoryGridClass}>
          <CategorySummaryPanel
            sections={sections}
            activeCategory={activeCategory}
            entriesByCategory={entriesByCategory}
            dict={dict}
            onToggleCategory={handleToggleCategory}
            onEntrySelect={onEditEntry}
            selectedEntryId={editingEntryId}
          />
          <CategoryConfigurator ref={configuratorRef} dict={dict} selection={selection} />
        </div>
      )}
    </div>
  );
}
