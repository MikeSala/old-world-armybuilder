"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import { LocaleButton } from "@/components/ui/LocaleButton";
import { LogoIcon } from "@/components/icons/LogoIcon";
import BuyMeCoffeeButton from "@/components/support/BuyMeCoffeeButton";
import { CHANGELOG_SLUG } from "@/lib/data/changelog";
import { getDictionary, locales, type Locale } from "@/lib/i18n/dictionaries";
import {
  buildLocalePath,
  buildLocalePathWithPrefix,
  resolveLocaleFromPathname,
} from "@/lib/i18n/paths";

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

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { activeLocale, restSegments, dictionary } = useMemo(() => {
    const { locale, segments } = resolveLocaleFromPathname(pathname);
    return {
      activeLocale: locale,
      restSegments: segments,
      dictionary: getDictionary(locale),
    };
  }, [pathname]);

  const buildHref = (targetLocale: Locale) => {
    if (restSegments[0] === CHANGELOG_SLUG) {
      return targetLocale === "en"
        ? buildLocalePathWithPrefix("en" as Locale, CHANGELOG_SLUG)
        : buildLocalePath(targetLocale);
    }

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

    const normalized = translatedSegments.join("/");
    return buildLocalePath(targetLocale, normalized);
  };

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-amber-400/30 bg-slate-950/95 backdrop-blur-md shadow-lg shadow-slate-950/50"
          : "border-amber-300/20 bg-slate-950/70 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex w-full max-w-main items-center justify-between gap-gap-sm px-container py-2.5 sm:py-3">
        {/* Logo and brand */}
        <Link
          href={buildLocalePath(activeLocale)}
          className="group flex items-center gap-2 sm:gap-3"
          aria-label={dictionary.headerBrandLabel}
          title={dictionary.headerBrandLabel}
        >
          <LogoIcon className="h-6 w-6 text-amber-400 transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7" />
          <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 transition-colors group-hover:text-amber-400 sm:inline sm:text-sm lg:tracking-[0.3em]">
            Army Builder
          </span>
        </Link>

        {/* Support button - center */}
        <div className="flex flex-1 justify-center">
          <BuyMeCoffeeButton />
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1 sm:gap-1.5">
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
