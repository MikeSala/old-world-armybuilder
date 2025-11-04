"use client";

// (removed import of TextArea, TextField, Theme from @radix-ui/themes)
import { clsx } from "clsx";
import * as React from "react";

type Props = {
  label: string;
  placeholder?: string;
  optionalHint?: string;
  value?: string;
  onChange?: (v: string) => void;
  maxChars?: number;
  multiline?: boolean;
  rows?: number;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelAction?: React.ReactNode;
};

export default function TextField({
  label,
  placeholder,
  optionalHint,
  value,
  onChange,
  maxChars,
  multiline = false,
  rows = 3,
  name,
  required,
  disabled,
  className,
  labelAction,
}: Props) {
  const id = React.useId();
  const length = (value ?? "").length;

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = event.target.value;
      const next = typeof maxChars === "number" ? raw.slice(0, maxChars) : raw;
      onChange?.(next);
    },
    [maxChars, onChange]
  );

  return (
    <div className={clsx("text-slate-100 w-full", className)}>
      <div className="mb-2 flex items-center gap-3 text-sm font-semibold text-slate-100">
        <label htmlFor={id} className="flex-1">
          {label} {optionalHint && <span className="text-slate-400">({optionalHint})</span>}
          {required && <span className="ml-1 text-amber-300"> *</span>}
        </label>
        {labelAction ? <div className="shrink-0">{labelAction}</div> : null}
      </div>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={handleChange}
          maxLength={typeof maxChars === "number" ? maxChars : undefined}
          required={required}
          disabled={disabled}
          aria-describedby={maxChars ? `${id}-counter` : undefined}
          className={clsx(
            "w-full rounded-lg border bg-slate-900/70 px-4 py-3 text-sm shadow-sm transition",
            "border-amber-300/30 text-amber-50 placeholder:text-amber-200/40",
            "focus:outline-none focus:ring-2 focus:ring-amber-400",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "min-h-[110px] resize-y"
          )}
        />
      ) : (
        <input
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={handleChange}
          maxLength={typeof maxChars === "number" ? maxChars : undefined}
          required={required}
          disabled={disabled}
          aria-describedby={maxChars ? `${id}-counter` : undefined}
          className={clsx(
            "w-full rounded-lg border bg-slate-900/70 px-4 py-3 text-sm shadow-sm transition",
            "border-amber-300/30 text-amber-50 placeholder:text-amber-200/40",
            "focus:outline-none focus:ring-2 focus:ring-amber-400",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        />
      )}

      {typeof maxChars === "number" && (
        <div
          id={`${id}-counter`}
          className="mt-1 text-right text-xs text-amber-300/70"
          aria-live="polite"
        >
          {length} / {maxChars}
        </div>
      )}
    </div>
  );
}
