"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { LocaleButton } from "@/components/ui/LocaleButton";
import { getDictionary, locales, defaultLocale, type Locale } from "@/lib/i18n/dictionaries";

// Layout styles
const headerClass =
  "fixed inset-x-0 top-0 z-50 border-b border-amber-300/20 bg-slate-950/80 backdrop-blur";
const innerClass =
  "mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-4 py-3 sm:px-8 lg:px-10";

// Button styles
const localeBtnBase = "border text-amber-200/80 transition-colors";
const localeBtnActive = "border-amber-400 bg-amber-500/10 text-amber-200";
const localeBtnIdle = "border-amber-300/40 hover:!border-amber-400 hover:!text-amber-100";

const editSlugByLocale: Record<Locale, string> = locales.reduce(
  (acc, locale) => {
    acc[locale] = getDictionary(locale).editSlug;
    return acc;
  },
  {} as Record<Locale, string>
);

function extractLocaleAndSegments(pathname: string): { locale: Locale; segments: string[] } {
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  if (maybeLocale && locales.includes(maybeLocale as Locale)) {
    return { locale: maybeLocale as Locale, segments: segments.slice(1) };
  }
  return { locale: defaultLocale, segments };
}

export default function Header() {
  const pathname = usePathname() ?? "/";

  const { activeLocale, restSegments, dictionary } = useMemo(() => {
    const { locale, segments } = extractLocaleAndSegments(pathname);
    return {
      activeLocale: locale,
      restSegments: segments,
      dictionary: getDictionary(locale),
    };
  }, [pathname]);

  const buildHref = (targetLocale: Locale) => {
    const translatedSegments =
      restSegments.length > 0
        ? (() => {
            const next = [...restSegments];
            const activeSlug = editSlugByLocale[activeLocale];
            const targetSlug = editSlugByLocale[targetLocale];
            if (next[0] === activeSlug && targetSlug) {
              next[0] = targetSlug;
            }
            return next;
          })()
        : restSegments;

    const normalized = [targetLocale, ...translatedSegments].join("/");
    return `/${normalized}`;
  };

  return (
    <header className={headerClass}>
      <div className={innerClass}>
        <Link
          href={`/${activeLocale}`}
          className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200 hover:text-amber-400"
          aria-label={dictionary.headerBrandLabel}
          title={dictionary.headerBrandLabel}
        >
          {dictionary.headerBrandLabel}
        </Link>
        <div className="flex items-center gap-2">
          {locales.map((locale) => {
            const isActive = locale === activeLocale;
            return (
              <LocaleButton
                key={locale}
                locale={locale}
                href={buildHref(locale)}
                label={dictionary.headerSwitchLocaleLabel?.replace(
                  "{locale}",
                  locale.toUpperCase()
                )}
                className={clsx(localeBtnBase, isActive ? localeBtnActive : localeBtnIdle)}
              />
            );
          })}
        </div>
      </div>
    </header>
  );
}
