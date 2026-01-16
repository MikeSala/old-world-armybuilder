import type { LocaleDictionary } from "./dictionaries";

type LocaleHint = Pick<LocaleDictionary, "localeName">;

/**
 * Type for objects that may contain localized name fields
 */
type LocalizedName = {
  name_en?: string;
  name_pl?: string;
  name_de?: string;
  name_fr?: string;
  name_es?: string;
  name_cn?: string;
};

export const isPolishLocale = (dict?: LocaleHint | null): boolean =>
  dict?.localeName?.toLowerCase() === "pl";

/**
 * Gets the localized name from an object with name_* fields.
 * Falls back to English if name_pl is not available.
 *
 * @param source - Object containing name_en and optionally name_pl
 * @param dict - Dictionary to determine locale
 * @returns Translated name or original if not Polish locale
 */
export const getLocalizedName = (source: LocalizedName | null | undefined, dict: LocaleHint): string => {
  if (!source?.name_en) return "";

  if (isPolishLocale(dict)) {
    // Prefer name_pl if available, otherwise keep English
    return source.name_pl || source.name_en;
  }

  // For other locales, return English name (extend in future for other languages)
  return source.name_en;
};

/**
 * Translates a plain string name.
 * For unit data with name_pl, use getLocalizedName instead.
 */
export const translateNameForDict = (value: string, dict: LocaleHint): string =>
  isPolishLocale(dict) ? value : value;

export const translateTextForDict = (value: string, dict: LocaleHint): string =>
  isPolishLocale(dict) ? value : value;

export const translateNameMaybe = (
  value: string | null | undefined,
  dict: LocaleHint
): string | null | undefined => (typeof value === "string" ? translateNameForDict(value, dict) : value);

export const translateTextMaybe = (
  value: string | null | undefined,
  dict: LocaleHint
): string | null | undefined => (typeof value === "string" ? translateTextForDict(value, dict) : value);

// Export types for use in other modules
export type { LocaleHint, LocalizedName };
