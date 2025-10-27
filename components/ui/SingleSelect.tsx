"use client";
import { ChangeEvent } from "react";

export type SelectOption = { id: string; label: string };

type SingleSelectProps = {
  label?: string;
  options: SelectOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function SingleSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "— wybierz —",
  disabled,
  className,
}: SingleSelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value || null);
  };

  return (
    <div className={className}>
      {label ? (
        <label className="mb-1 block text-sm font-medium">{label}</label>
      ) : null}
      <select
        className="w-full rounded-md border px-3 py-2 disabled:opacity-60"
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
