"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ARMIES } from "@/lib/data/armies/armies";
import { FactionCard } from "./FactionCard";
import type { Locale } from "@/lib/i18n/dictionaries";

type FactionGridProps = {
  locale: Locale;
  editSlug: string;
};

export function FactionGrid({ locale, editSlug }: FactionGridProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    setCanScrollLeft(scroller.scrollLeft > 1);
    setCanScrollRight(scroller.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateScrollState]);

  const handleScrollRight = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: Math.round(scroller.clientWidth * 0.85), behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: -Math.round(scroller.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex gap-3 overflow-x-auto pb-4 pr-16 scroll-smooth snap-x snap-mandatory"
      >
        {ARMIES.map((faction) => (
          <FactionCard
            key={faction.id}
            faction={faction}
            locale={locale}
            editSlug={editSlug}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-slate-600 via-slate-600/90 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-slate-600 via-slate-600/90 to-transparent" />
      <button
        type="button"
        onClick={handleScrollLeft}
        aria-label="Scroll factions to the left"
        className={`absolute -left-[50px] top-1/2 -translate-y-1/2 rounded-full border border-amber-300/40 bg-slate-900/70 p-2 text-amber-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-amber-300 hover:text-amber-100 ${
          canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={handleScrollRight}
        aria-label="Scroll factions to the right"
        className={`absolute -right-[50px] top-1/2 -translate-y-1/2 rounded-full border border-amber-300/40 bg-slate-900/70 p-2 text-amber-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-amber-300 hover:text-amber-100 ${
          canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
