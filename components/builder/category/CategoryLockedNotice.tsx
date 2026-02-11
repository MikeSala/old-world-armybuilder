import type { Dict } from "./types";

type Props = {
  dict: Dict;
};

export function CategoryLockedNotice({ dict }: Props) {
  return (
    <div className="rounded-2xl border border-stone-300/30 bg-stone-800/70 p-6 text-stone-100 shadow-lg shadow-stone-900/15">
      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-300">
        {dict.categoryUnitSectionLocked}
      </h3>
      <p className="mt-3 text-sm text-stone-200/70">
        {dict.categoryLockedNoticeDescription}
      </p>
    </div>
  );
}
