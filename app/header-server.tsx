"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import { LocaleButton } from "@/components/ui/LocaleButton";
import { LogoIcon } from "@/components/icons/LogoIcon";
import BuyMeCoffeeButton from "@/components/support/BuyMeCoffeeButton";
import { CHANGELOG_SLUG } from "@/lib/data/changelog";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n/dictionaries";
import {
  buildLocalePath,
  buildLocalePathWithPrefix,
  resolveLocaleFromPathname,
} from "@/lib/i18n/paths";

// Button styles
const localeBtnBase = "";
const localeBtnActive = "opacity-100 drop-shadow-[0_0_6px_rgba(99,102,241,0.8)]";
const localeBtnIdle =
  "opacity-50 hover:opacity-100 hover:drop-shadow-[0_0_6px_rgba(99,102,241,0.6)]";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.dataset.theme = nextTheme;
    root.classList.toggle("dark", nextTheme === "dark");
    setTheme(nextTheme);

    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // Ignore storage errors in restricted environments.
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = root.dataset.theme === "light" ? "light" : "dark";
    setTheme(currentTheme);
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
    const sanitizedSegments =
      restSegments.length > 0 && isLocale(restSegments[0])
        ? restSegments.slice(1)
        : restSegments;

    if (sanitizedSegments[0] === CHANGELOG_SLUG) {
      return targetLocale === "en"
        ? buildLocalePathWithPrefix("en" as Locale, CHANGELOG_SLUG)
        : buildLocalePath(targetLocale);
    }

    const translatedSegments =
      sanitizedSegments.length > 0
        ? (() => {
            const next = [...sanitizedSegments];
            const activeSlug = editSlugByLocale[activeLocale];
            const targetSlug = editSlugByLocale[targetLocale];
            if (next[0] === activeSlug && targetSlug) {
              next[0] = targetSlug;
            }
            return next;
          })()
        : sanitizedSegments;

    const normalized = translatedSegments.join("/");
    return buildLocalePath(targetLocale, normalized);
  };

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-stone-400/30 bg-stone-900/95 backdrop-blur-md shadow-lg shadow-stone-950/50"
          : "border-stone-300/20 bg-stone-900/70 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex w-full max-w-main items-center justify-between gap-gap-sm px-container py-2.5 sm:py-3">
        {/* Logo and brand */}
        <Link
          href={buildLocalePath(activeLocale)}
          className="flex items-center gap-2 sm:gap-3"
          aria-label={dictionary.headerBrandLabel}
          title={dictionary.headerBrandLabel}
        >
          <LogoIcon className="h-6 w-6 text-stone-400 sm:h-7 sm:w-7" />
          <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-stone-200 sm:inline sm:text-sm lg:tracking-[0.3em]">
            Army Builder
          </span>
        </Link>

        {/* Support button - center */}
        <div className="flex flex-1 justify-center">
          <BuyMeCoffeeButton />
        </div>

        {/* Language switcher (desktop) */}
        <div className="hidden items-center gap-2.5 sm:flex sm:gap-3">
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

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="theme-toggle relative flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border border-stone-600 bg-stone-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 active:scale-[0.97]"
        >
          {/* Sliding knob */}
          <span
            className={clsx(
              "absolute flex h-6 w-6 items-center justify-center rounded-full bg-stone-300 shadow transition-all duration-300",
              theme === "light" ? "left-1" : "left-9"
            )}
          >
            {theme === "light"
              ? <Sun className="h-3.5 w-3.5 text-stone-800" />
              : <Moon className="h-3.5 w-3.5 text-stone-800" />}
          </span>
          {/* Background hint icons */}
          <Moon className={clsx("ml-auto mr-1.5 h-3 w-3 text-stone-500 transition-opacity duration-300", theme === "light" ? "opacity-60" : "opacity-0")} />
          <Sun className={clsx("ml-1.5 mr-auto h-3 w-3 text-stone-500 transition-opacity duration-300", theme === "dark" ? "opacity-60" : "opacity-0")} />
        </button>

        {/* Mobile language menu */}
        <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300/40 bg-stone-700/70 text-stone-100 transition-all duration-200 hover:bg-stone-600/80 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 sm:hidden"
              aria-label={mobileMenuOpen ? "Close language menu" : "Open language menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-stone-900/60 data-[state=open]:animate-fade-in sm:hidden" />
            <Dialog.Content className="fixed left-4 right-4 top-16 z-50 rounded-2xl border border-stone-300/30 bg-stone-800/95 p-4 shadow-2xl shadow-stone-900/30 backdrop-blur focus:outline-none sm:hidden">
              <Dialog.Title className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-300">
                Languages
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Choose a language version of the site.
              </Dialog.Description>
              <div className="flex flex-col gap-2">
                {locales.map((locale) => {
                  const isActive = locale === activeLocale;
                  return (
                    <LocaleButton
                      key={`mobile-${locale}`}
                      locale={locale}
                      href={buildHref(locale)}
                      label={dictionary.headerSwitchLocaleLabel?.replace(
                        "{locale}",
                        locale.toUpperCase()
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                      className={clsx(
                        "w-full justify-start",
                        localeBtnBase,
                        isActive ? localeBtnActive : localeBtnIdle
                      )}
                    />
                  );
                })}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
