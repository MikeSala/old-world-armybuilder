import * as React from "react";

type Props = {
  title: string;
  rightValue: number;
  rightSuffix: string;
  rightText?: string;
  emphasizeWarning?: boolean;
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
};

export function CategorySummaryCard({
  title,
  rightValue,
  rightSuffix,
  rightText,
  emphasizeWarning,
  headerAction,
  children,
}: Props) {
  const hasChildren = React.Children.count(children) > 0;
  const displayText =
    rightText ?? `${rightValue}${rightSuffix ? ` ${rightSuffix}` : ""}`;

  return (
    <div className="flex flex-col rounded-2xl border border-stone-200 bg-white shadow-lg shadow-stone-200/50 backdrop-blur print-bg-white dark:border-stone-300/30 dark:bg-stone-800/60 dark:shadow-stone-900/20">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3">
        <div className="text-base font-semibold text-stone-800 dark:text-stone-200">{title}</div>
        <div className="flex items-center justify-center">{headerAction ?? <span className="hidden" />}</div>
        <div
          className={`text-right text-xs font-semibold tracking-wide ${
            emphasizeWarning ? "text-red-500 dark:text-red-300" : "text-stone-600 dark:text-stone-200/80"
          }`}
        >
          {displayText}
        </div>
      </div>

      {hasChildren ? (
        <div className="border-t border-stone-200 px-4 py-3 dark:border-stone-300/10">
          <div className="flex w-full flex-col gap-3 md:flex-col">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
