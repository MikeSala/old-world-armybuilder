"use client";
import { useState } from "react";

import Select, { SelectOption } from "@/components/ui/Select";
import { ARMY_RULES } from "@/lib/data/armies/armies";

type Props = {
  dict: { selectPlaceholder: string; armyRule: string };
  defaultValue?: string | null;
  className?: string;
  onChange?: (id: string | null) => void;
};

export default function ArmyRulesSelectClient({
  dict,
  defaultValue = null,
  className,
  onChange,
}: Props) {
  const [value, setValue] = useState<string | null>(defaultValue);

  const options: SelectOption[] = ARMY_RULES.map((r) => ({
    id: r.id,
    label: r.name,
  }));

  return (
    <Select
      label={dict.armyRule}
      placeholder={dict.selectPlaceholder}
      options={options}
      value={value}
      className={className}
      onChange={(id) => {
        setValue(id);
        onChange?.(id);
      }}
    />
  );
}
