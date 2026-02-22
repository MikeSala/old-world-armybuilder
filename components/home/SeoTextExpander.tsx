"use client";

import { useState } from "react";

type Props = {
  readMoreLabel: string;
  children: React.ReactNode;
};

export function SeoTextExpander({ readMoreLabel, children }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={
          expanded
            ? undefined
            : "relative max-h-48 overflow-hidden sm:max-h-none sm:overflow-visible"
        }
      >
        {children}
        {!expanded && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent sm:hidden dark:from-stone-800/70"
            aria-hidden
          />
        )}
      </div>
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 text-sm font-semibold text-stone-500 hover:text-stone-800 sm:hidden dark:text-stone-400 dark:hover:text-stone-100"
        >
          {readMoreLabel} ↓
        </button>
      )}
    </div>
  );
}
