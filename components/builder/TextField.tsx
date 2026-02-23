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
    <div className={clsx("text-stone-900 dark:text-stone-100 w-full", className)}>
      <div className="mb-2 flex items-center gap-3 text-sm font-semibold text-stone-700 dark:text-stone-100">
        <label htmlFor={id} className="flex-1">
          {label} {optionalHint && <span className="text-stone-500 dark:text-stone-400">({optionalHint})</span>}
          {required && <span className="ml-1 text-stone-500 dark:text-stone-300"> *</span>}
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
            "w-full rounded-lg border bg-white px-4 py-3 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400",
            "border-stone-300 dark:border-stone-300/30 dark:bg-stone-800/70 dark:text-stone-50 dark:placeholder:text-stone-200/40",
            "focus:outline-none focus:ring-2 focus:ring-stone-400",
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
            "w-full rounded-lg border bg-white px-4 py-3 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400",
            "border-stone-300 dark:border-stone-300/30 dark:bg-stone-800/70 dark:text-stone-50 dark:placeholder:text-stone-200/40",
            "focus:outline-none focus:ring-2 focus:ring-stone-400",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        />
      )}

      {typeof maxChars === "number" && (
        <div
          id={`${id}-counter`}
          className="mt-1 text-right text-xs text-stone-400 dark:text-stone-300/70"
          aria-live="polite"
        >
          {length} / {maxChars}
        </div>
      )}
    </div>
  );
}
