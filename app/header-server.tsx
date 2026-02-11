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
const localeBtnBase = "border text-stone-200/80";
const localeBtnActive = "border-stone-400 bg-stone-500/10 text-stone-200";
const localeBtnIdle = "border-stone-300/40 hover:border-stone-400 hover:text-stone-100";

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
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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
          className="group flex items-center gap-2 sm:gap-3"
          aria-label={dictionary.headerBrandLabel}
          title={dictionary.headerBrandLabel}
        >
          <LogoIcon className="h-6 w-6 text-stone-400 transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7" />
          <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-stone-200 transition-colors group-hover:text-stone-400 sm:inline sm:text-sm lg:tracking-[0.3em]">
            Army Builder
          </span>
        </Link>

        {/* Support button - center */}
        <div className="flex flex-1 justify-center">
          <BuyMeCoffeeButton />
        </div>

        {/* Language switcher (desktop) */}
        <div className="hidden items-center gap-1 sm:flex sm:gap-1.5">
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

        {/* Theme switcher (desktop) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="hidden h-9 items-center gap-2 rounded-md border border-stone-300/40 bg-stone-700/70 px-3 text-xs font-semibold uppercase tracking-wide text-stone-100 transition-all duration-200 hover:bg-stone-600/80 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 sm:inline-flex"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

        {/* Theme switcher (mobile) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300/40 bg-stone-700/70 text-stone-100 transition-all duration-200 hover:bg-stone-600/80 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 sm:hidden"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
