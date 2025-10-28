// components/builder/TextFieldLabeled.tsx
"use client";

import { useId } from "react";

type Props = {
  // labels & placeholders from your dictionary
  label: string; // e.g. dict.rosterNameLabel / dict.rosterDescLabel
  placeholder?: string; // e.g. dict.rosterNamePh / dict.rosterDescPh
  optionalHint?: string; // e.g. dict.optionalHint => "(optional)"

  // behavior
  value?: string; // controlled
  onChange?: (val: string) => void;
  maxChars?: number; // character limit
  multiline?: boolean; // textarea when true
  rows?: number; // textarea rows (default 3 when multiline)
  className?: string;
};

export default function TextFieldLabeled({
  label,
  placeholder,
  optionalHint,
  value,
  onChange,
  maxChars,
  multiline = false,
  rows = 3,
  className,
}: Props) {
  const id = useId();

  const commonProps = {
    id,
    placeholder,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = maxChars ? e.target.value.slice(0, maxChars) : e.target.value;
      onChange?.(next);
    },
    className:
      "w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-lg text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-300 disabled:opacity-60",
    "aria-describedby": maxChars ? `${id}-counter` : undefined,
  };

  const rootClassName = className ? `text-slate-100 ${className}` : "text-slate-100";

  const length = (value ?? "").length;

  return (
    <div className={rootClassName}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-100">
        {label} {optionalHint ? <span className="text-slate-400">({optionalHint})</span> : null}
      </label>

      {multiline ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input type="text" {...commonProps} />
      )}

      {maxChars !== undefined && (
        <div
          id={`${id}-counter`}
          className="mt-1 text-right text-sm text-slate-400"
          aria-live="polite"
        >
          {length} / {maxChars}
        </div>
      )}
    </div>
  );
}
