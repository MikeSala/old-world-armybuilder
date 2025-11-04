"use client";

import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";

type Props = {
  abbreviation: string;
  label: string;
  className?: string;
};

export function StatTooltipLabel({ abbreviation, label, className }: Props) {
  const content = label.trim();

  if (!content) {
    return <span className={className}>{abbreviation}</span>;
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span
          tabIndex={0}
          className={clsx(
            "cursor-help rounded px-1 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            className
          )}
        >
          {abbreviation}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="select-none rounded border-2 border-amber-400 bg-slate-900/95 px-2 py-1 text-xs font-medium text-amber-100 z-[70]"
        >
          {content}
          <Tooltip.Arrow className="fill-slate-900/95" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
