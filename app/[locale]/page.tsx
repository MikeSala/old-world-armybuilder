import { ScrollText, Sword } from "lucide-react";

import { MarginLayout } from "@/components/layout/MarginLayout";
import { Button } from "@/components/ui/Button";
import UnitSearch from "@/components/unit/UnitSearch";
import { getDictionary, locales, defaultLocale, type Locale } from "@/lib/i18n/dictionaries";

type PageProps = {
  params: Promise<Record<string, unknown>>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LandingPage({ params }: PageProps) {
  const resolvedParams = await params;
  const localeParam = resolvedParams?.locale;
  const locale = typeof localeParam === "string" && locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const dictionary = getDictionary(locale);

  return (
    <main>
      <MarginLayout>
        <form action={`/${locale}/${dictionary.editSlug}`}>
          <Button
            className="mb-20"
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<ScrollText className="h-5 w-5" />}
            rightIcon={<Sword className="h-5 w-5" />}
          >
            {dictionary.rosterButton}
          </Button>
        </form>
        <UnitSearch dict={dictionary} className="w-full max-w-4xl text-left" />
      </MarginLayout>
    </main>
  );
}
