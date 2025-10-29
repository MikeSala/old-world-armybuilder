import type { Dict } from "./types";

type Props = {
  dict: Dict;
};

export function CategoryLockedNotice({ dict }: Props) {
  return (
    <div className="rounded-2xl border border-amber-300/30 bg-slate-900/70 p-6 text-amber-100 shadow-lg shadow-amber-900/15">
      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
        Unit Selection Locked
      </h3>
      <p className="mt-3 text-sm text-amber-200/70">
        {dict.categoryHelpWarning ??
          "Complete the roster setup (army, name, points) and save your changes to start adding units."}
      </p>
    </div>
  );
}
