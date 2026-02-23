import type { Dict } from "./types";

type Props = {
  dict: Dict;
};

export function CategoryLockedNotice({ dict }: Props) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-900 shadow-lg shadow-stone-200/50 dark:border-stone-300/30 dark:bg-stone-800/70 dark:text-stone-100 dark:shadow-stone-900/15">
      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-600 dark:text-stone-300">
        {dict.categoryUnitSectionLocked}
      </h3>
      <p className="mt-3 text-sm text-stone-500 dark:text-stone-200/70">
        {dict.categoryLockedNoticeDescription}
      </p>
    </div>
  );
}
