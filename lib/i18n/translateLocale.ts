import type { LocaleDictionary } from "./dictionaries";
import { translateEnNameToPl, translateEnTextToPl } from "./translateEnToPl";

type LocaleHint = Pick<LocaleDictionary, "localeName">;

export const isPolishLocale = (dict?: LocaleHint | null): boolean =>
  dict?.localeName?.toLowerCase() === "pl";

export const translateNameForDict = (value: string, dict: LocaleHint): string =>
  isPolishLocale(dict) ? translateEnNameToPl(value) : value;

export const translateTextForDict = (value: string, dict: LocaleHint): string =>
  isPolishLocale(dict) ? translateEnTextToPl(value) : value;

export const translateNameMaybe = (
  value: string | null | undefined,
  dict: LocaleHint
): string | null | undefined => (typeof value === "string" ? translateNameForDict(value, dict) : value);

export const translateTextMaybe = (
  value: string | null | undefined,
  dict: LocaleHint
): string | null | undefined => (typeof value === "string" ? translateTextForDict(value, dict) : value);
