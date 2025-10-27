"use client";
import { useMemo, useState } from "react";
import SingleSelect, { SelectOption } from "../ui/SingleSelect";

type ArmyNode = { id: string; label: string; children?: SelectOption[] };

export default function RosterEditClient({ armies }: { armies: ArmyNode[] }) {
  const [armyId, setArmyId] = useState<string | null>(null);
  const [compId, setCompId] = useState<string | null>(null);

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
      <SingleSelect
        label="Armia"
        options={armyOptions}
        value={armyId}
        onChange={(id) => {
          setArmyId(id);
          setCompId(null);
        }}
      />
      <SingleSelect
        label="Kompozycja"
        options={compositionOptions}
        value={compId}
        onChange={setCompId}
        disabled={!armyId}
      />
    </div>
  );
}
