"use client";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/lib/store";
import { setArmy, setComposition } from "@/lib/store/slices/rosterSlice";

import Select, { SelectOption } from "../ui/Select";

type ArmyNode = { id: string; label: string; children?: SelectOption[] };

export default function RosterEditClient({
  armies,
  dict,
}: {
  armies: ArmyNode[];
  dict: { selectPlaceholder: string; army: string; armyComposition: string };
}) {
  const dispatch = useDispatch();
  const { armyId, compositionId: compId } = useSelector((s: RootState) => s.roster.draft);

  const armyOptions: SelectOption[] = useMemo(
    () => armies.map((a) => ({ id: a.id, label: a.label })),
    [armies]
  );

  const compositionOptions: SelectOption[] = useMemo(() => {
    const found = armies.find((a) => a.id === armyId);
    return found?.children ?? [];
  }, [armies, armyId]);

  return (
    <div className="space-y-4">
      <Select
        label={dict.army}
        placeholder={dict.selectPlaceholder}
        options={armyOptions}
        value={armyId}
        onChange={(id) => {
          dispatch(setArmy(id));
        }}
      />
      <Select
        label={dict.armyComposition}
        placeholder={dict.selectPlaceholder}
        options={compositionOptions}
        value={compId}
        onChange={(id) => dispatch(setComposition(id))}
        disabled={!armyId}
      />
    </div>
  );
}
