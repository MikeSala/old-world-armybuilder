import { ScrollText, Sword } from "lucide-react";
import { getDictionary, locales, type Locale } from "../../lib/i18n/dictionaries";
import { Button } from "../../components/ui/Button";
import UnitSearch from "@/components/unit/UnitSearch";
import { MarginLayout } from "@/components/layout/MarginLayout";

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
