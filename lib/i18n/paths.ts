import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/dictionaries";

export const isLocalePrefix = (value: string): value is Locale =>
  isLocale(value);

export const resolveLocaleFromPathname = (
  pathname: string
): { locale: Locale; segments: string[] } => {
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  if (maybeLocale && isLocalePrefix(maybeLocale)) {
    return { locale: maybeLocale as Locale, segments: segments.slice(1) };
  }
  return { locale: defaultLocale, segments };
};

export const buildLocalePath = (locale: Locale, path?: string): string => {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  if (path === undefined || path === "") {
    return prefix || "/";
  }

  if (path === "/") {
    return `${prefix}/` || "/";
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${prefix}${normalized}`;
};

export const buildLocaleUrl = (baseUrl: string, locale: Locale, path?: string): string =>
  `${baseUrl}${buildLocalePath(locale, path)}`;

export const buildLocalePathWithPrefix = (locale: Locale, path?: string): string => {
  const prefix = `/${locale}`;

  if (path === undefined || path === "") {
    return `${prefix}/`;
  }

  if (path === "/") {
    return `${prefix}/`;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${prefix}${normalized}`;
};

export const buildLocaleUrlWithPrefix = (baseUrl: string, locale: Locale, path?: string): string =>
  `${baseUrl}${buildLocalePathWithPrefix(locale, path)}`;
