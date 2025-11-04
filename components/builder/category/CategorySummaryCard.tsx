import * as React from "react";

type Props = {
  title: string;
  rightValue: number;
  rightSuffix: string;
  emphasizeWarning?: boolean;
  headerAction?: React.ReactNode;
  children?: React.ReactNode;
};

export function CategorySummaryCard({
  title,
  rightValue,
  rightSuffix,
  emphasizeWarning,
  headerAction,
  children,
}: Props) {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className="flex flex-col rounded-2xl border border-amber-300/30 bg-slate-900/60 shadow-lg shadow-amber-900/20 backdrop-blur print-bg-white">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3">
        <div className="text-lg font-semibold text-amber-200">{title}</div>
        <div className="flex justify-center">{headerAction ?? <span className="hidden" />}</div>
        <div
          className={`text-right text-sm font-semibold tracking-wide ${
            emphasizeWarning ? "text-red-300" : "text-amber-200/80"
          }`}
        >
          {rightValue} {rightSuffix}
        </div>
      </div>

      {hasChildren ? (
        <div className="border-t border-amber-300/10 px-4 py-3">
          <div className="flex w-full flex-col gap-3 md:flex-col">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
