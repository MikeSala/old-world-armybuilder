"use client";

import { useDispatch, useSelector } from "react-redux";

import TextField from "@/components/builder/TextField";
import type { LocaleDictionary } from "@/lib/i18n/dictionaries";
import type { AppDispatch, RootState } from "@/lib/store";
import { setDescription, setName } from "@/lib/store/slices/rosterSlice";

type Dict = Pick<
  LocaleDictionary,
  "rosterNameLabel" | "rosterNamePh" | "rosterDescLabel" | "rosterDescPh" | "optionalHint"
>;

type Props = {
  dict: Dict;
  nameMax?: number;
  descMax?: number;
  className?: string;
  nameAction?: React.ReactNode;
};

export default function RosterMetaClient({
  dict,
  nameMax = 60,
  descMax = 300,
  className,
  nameAction,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { name, description } = useSelector((state: RootState) => state.roster.draft);

  return (
    <section className={className}>
      <TextField
        label={dict.rosterNameLabel}
        placeholder={dict.rosterNamePh}
        optionalHint={dict.optionalHint}
        value={name}
        onChange={(next) => dispatch(setName(next))}
        maxChars={nameMax}
        labelAction={nameAction}
      />

      <div />

      <TextField
        label={dict.rosterDescLabel}
        placeholder={dict.rosterDescPh}
        optionalHint={dict.optionalHint}
        value={description}
        onChange={(next) => dispatch(setDescription(next))}
        multiline
        maxChars={descMax}
      />
    </section>
  );
}
