import type { UnitOptionGroup } from "@/lib/builder/unitHelpers";
import type { Dict } from "./types";

type Props = {
  group: UnitOptionGroup;
  selectedIds: string[];
  onToggle: (group: UnitOptionGroup, optionId: string, checked: boolean) => void;
  dict: Dict;
};

export function OptionGroupSection({ group, selectedIds, onToggle, dict }: Props) {
  return (
    <section className="rounded-xl border border-amber-300/20 bg-slate-900/60 p-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-amber-200">
        {group.title}
      </h4>
      <ul className="mt-3 space-y-2">
        {group.options.map((option) => {
          const inputId = `${group.id}-${option.id}`;
          const checked = selectedIds.includes(option.id);
          const type = group.type === "radio" ? "radio" : "checkbox";
          return (
            <li key={option.id} className="flex items-start justify-between gap-3">
              <label
                htmlFor={inputId}
                className="flex flex-1 cursor-pointer items-start gap-3 text-sm"
              >
                <input
                  id={inputId}
                  name={group.id}
                  type={type}
                  checked={checked}
                  onChange={(event) =>
                    onToggle(
                      group,
                      option.id,
                      group.type === "radio" ? true : event.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4 rounded border-amber-400 bg-slate-900 text-amber-500 focus:ring-amber-500"
                />
                <span className="flex flex-col text-amber-100/90">
                  <span className="font-medium">{option.label}</span>
                  {option.note ? (
                    <span className="text-xs text-amber-200/70">{option.note}</span>
                  ) : null}
                </span>
              </label>
              <span className="text-xs font-semibold text-amber-200/80">
                {option.points
                  ? `${dict.categoryPointsValue.replace("{value}", String(option.points))}${
                      option.perModel ? dict.categoryOptionCostPerModelSuffix : ""
                    }`
                  : dict.categoryOptionCostFree}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
