import type { LocaleDictionary } from "@/lib/i18n/dictionaries";

type HeroSectionProps = {
  dict: LocaleDictionary;
};

export function HeroSection({ dict }: HeroSectionProps) {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-6 sm:py-8">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-slate-900" />
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        {/* Title */}
        <h1
          className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text
                     text-xl font-bold tracking-tight text-transparent
                     sm:text-2xl md:text-3xl
                     animate-fade-in-up"
        >
          {dict.heroTitle}
        </h1>
      </div>
    </section>
  );
}
