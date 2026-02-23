"use client";

import { useSelector } from "react-redux";

import CategoryBuckets from "@/components/builder/CategoryBucket";
import RosterSummary from "@/components/builder/RosterSummary";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import type { RootState } from "@/lib/store";
import { rosterInitialState } from "@/lib/store/slices/rosterSlice";

type Props = {
  dict: LocaleDictionary;
};

export default function RosterUnlockedContent({ dict }: Props) {
  const savedAt = useSelector(
    (s: RootState) => s.roster?.ui?.savedAt ?? rosterInitialState.ui.savedAt
  );

  if (!savedAt) return null;

  return (
    <>
      <CategoryBuckets dict={dict} />
      <div id="summary-print-root" className="w-full">
        <RosterSummary dict={dict} />
      </div>
    </>
  );
}
