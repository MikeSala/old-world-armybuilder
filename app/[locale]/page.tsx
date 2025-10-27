import Link from "next/link";
import { ScrollText, Sword } from "lucide-react";
import { CtaButton } from "../../components/landing/CtaButton";
import {
  getAlternateLocale,
  getDictionary,
  locales,
  type Locale,
} from "../../lib/i18n/dictionaries";
import { LocaleButton } from "../../components/ui/LocaleButton";

type PageProps = {
  params: {
    locale: Locale;
  };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LandingPage({ params }: PageProps) {
  const { locale } = params;

  if (!locales.includes(locale)) {
    return null;
  }

  const dictionary = getDictionary(locale);
  const alternateLocale = getAlternateLocale(locale);
  const alternateDictionary = getDictionary(alternateLocale);

  return (
    <main className="flex min-h-[calc(100vh-48px)] flex-col items-center justify-center gap-6 text-center">
      <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
        <LocaleButton href="pl" locale="pl" />
        <LocaleButton href="en" locale="en" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-amber-100 sm:text-5xl">
        {dictionary.heroTitle}
      </h1>
      <p className="mx-auto max-w-xl text-lg text-amber-200/80">
        {dictionary.heroDescription}
      </p>
      <CtaButton
        href={`/${locale}/${dictionary.editSlug}`}
        variant="gradient"
        size="lg"
        leftIcon={<ScrollText className="h-5 w-5" />}
        rightIcon={<Sword className="h-5 w-5" />}
      >
        {dictionary.rosterButton}
      </CtaButton>
    </main>
  );
}
