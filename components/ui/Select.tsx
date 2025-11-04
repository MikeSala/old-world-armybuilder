"use client";

import * as RtSelect from "@radix-ui/react-select";
import { clsx } from "clsx";
import * as React from "react";
// IMPORTANT: use the low-level Radix Select primitives (not @radix-ui/themes)

export type SelectOption = { id: string; label: string };

type SelectProps = {
  label?: string;
  options: SelectOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const PLACEHOLDER_VALUE = "__radix_select_placeholder__";

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: SelectProps) {
  const selectId = React.useId();
  const hasPlaceholder = Boolean(placeholder && placeholder.trim().length > 0);
  const controlledValue = value ?? (hasPlaceholder ? PLACEHOLDER_VALUE : undefined);

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (nextValue === PLACEHOLDER_VALUE) {
        onChange(null);
      } else {
        onChange(nextValue);
      }
    },
    [onChange]
  );

  return (
    <RtSelect.Root value={controlledValue} onValueChange={handleValueChange} disabled={disabled}>
      <div className={clsx("text-slate-100", className)}>
        {label ? (
          <label htmlFor={selectId} className="mb-2 block text-sm font-semibold text-slate-100">
            {label}
          </label>
        ) : null}

        <RtSelect.Trigger
          id={selectId}
          className={clsx(
            "flex w-full items-center justify-between rounded-md border border-amber-300/30 bg-slate-950/70 px-3 py-2 text-sm text-amber-100 shadow-sm transition",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            "data-[state=open]:border-amber-400 data-[state=open]:bg-slate-950/80",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
          aria-label={label}
        >
          {/* Radix react-select expects Value inside Trigger (not a placeholder prop) */}
          <RtSelect.Value placeholder={placeholder} />
          <RtSelect.Icon className="ml-2 opacity-80">▾</RtSelect.Icon>
        </RtSelect.Trigger>
      </div>

      {/* Portal + popper-positioned content fixes overlay/background issues */}
      <RtSelect.Portal>
        <RtSelect.Content
          position="popper"
          sideOffset={6}
          className="min-w-[var(--radix-select-trigger-width)] rounded-md border border-amber-300/30 bg-slate-900/95 text-amber-100 shadow-lg shadow-amber-900/30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80"
        >
          <RtSelect.ScrollUpButton className="flex items-center justify-center p-1 text-xs opacity-70 hover:opacity-100">
            ▲
          </RtSelect.ScrollUpButton>

          <RtSelect.Viewport className="p-1 max-h-60 overflow-auto">
            {hasPlaceholder ? (
              <RtSelect.Item
                value={PLACEHOLDER_VALUE}
                className="cursor-default select-none rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-amber-400/20 data-[state=checked]:font-semibold"
              >
                <RtSelect.ItemText>{placeholder}</RtSelect.ItemText>
              </RtSelect.Item>
            ) : null}

            {options.map((option) => (
              <RtSelect.Item
                key={option.id}
                value={option.id}
                className="cursor-default select-none rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-amber-400/20 data-[state=checked]:font-semibold"
              >
                <RtSelect.ItemText>{option.label}</RtSelect.ItemText>
              </RtSelect.Item>
            ))}
          </RtSelect.Viewport>

          <RtSelect.ScrollDownButton className="flex items-center justify-center p-1 text-xs opacity-70 hover:opacity-100">
            ▼
          </RtSelect.ScrollDownButton>
        </RtSelect.Content>
      </RtSelect.Portal>
    </RtSelect.Root>
  );
}
