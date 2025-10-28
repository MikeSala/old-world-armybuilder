"use client";

import { useDispatch, useSelector } from "react-redux";
import TextFieldLabeled from "@/components/builder/TextFieldLabeled";
import { setDescription, setName } from "@/lib/store/slices/rosterSlice";
import type { AppDispatch, RootState } from "@/lib/store";

type Dict = {
  rosterNameLabel: string;
  rosterNamePh?: string;
  rosterDescLabel: string;
  rosterDescPh?: string;
  optionalHint?: string;
};

type Props = {
  dict: Dict;
  nameMax?: number; // default 60
  descMax?: number; // default 300
  className?: string;
};

export default function RosterMetaClient({ dict, nameMax = 60, descMax = 300, className }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { name, description } = useSelector((state: RootState) => state.roster.draft);

  return (
    <section className={className}>
      <TextFieldLabeled
        label={dict.rosterNameLabel}
        placeholder={dict.rosterNamePh}
        optionalHint={dict.optionalHint}
        value={name}
        onChange={(next) => dispatch(setName(next))}
        maxChars={nameMax}
      />

      <div className="mt-6" />

      <TextFieldLabeled
        label={dict.rosterDescLabel}
        placeholder={dict.rosterDescPh}
        optionalHint={dict.optionalHint}
        value={description}
        onChange={(next) => dispatch(setDescription(next))}
        multiline
        rows={4}
        maxChars={descMax}
      />
    </section>
  );
}
