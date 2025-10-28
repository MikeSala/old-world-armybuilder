export interface SpecialRule {
  id: string;
  name: string;
  description: string;
}

export const SPECIAL_RULES: SpecialRule[] = [
  {
    id: "hold-the-line",
    name: "Hold the Line",
    description:
      "This character and any unit they have joined automatically passes any Panic tests they are required to make.",
  },
  {
    id: "rallying-cry",
    name: "Rallying Cry",
    description:
      "During the Command sub-phase of their turn, if they are not engaged in combat, this character may nominate a single fleeing friendly unit that is within their Command range. The nominated unit immediately makes a Rally test. If this test is failed, the unit may attempt to rally again as normal during the Rally sub-phase.",
  },
  // kolejne dopiszemy później
];

export const SPECIAL_RULES_MAP = Object.fromEntries(SPECIAL_RULES.map((r) => [r.id, r] as const));
