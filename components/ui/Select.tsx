"use client";
import { ChangeEvent } from "react";

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

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: SelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value || null);
  };

  const containerClassName = className ? `text-amber-300 ${className}` : "text-amber-300";

  return (
    <div className={containerClassName}>
      {label ? (
        <label className="mb-2 block text-sm font-semibold text-amber-300">{label}</label>
      ) : null}
      <select
        className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-amber-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
      >
        <option value="">{placeholder ?? ""}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
