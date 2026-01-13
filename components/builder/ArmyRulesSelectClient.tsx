"use client";
import { useEffect, useState } from "react";

import Select, { SelectOption } from "@/components/ui/Select";
import { ARMY_RULES } from "@/lib/data/armies/armies";
import { tData } from "@/lib/i18n/data";

type Props = {
  dict: { selectPlaceholder: string; armyRule: string; localeName: string };
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

  useEffect(() => {
    setValue(defaultValue ?? null);
  }, [defaultValue]);

  const options: SelectOption[] = ARMY_RULES.map((r) => ({
    id: r.id,
    label: tData(r.nameKey, dict),
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
