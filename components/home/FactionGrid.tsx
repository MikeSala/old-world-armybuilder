"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ARMIES } from "@/lib/data/armies/armies";
import { FactionCard } from "./FactionCard";
import type { Locale } from "@/lib/i18n/dictionaries";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

type FactionGridProps = {
  locale: Locale;
  editSlug: string;
};

const CARDS_PER_SCROLL = 4;
const CARD_WIDTH = 170;
const GAP = 12;

export function FactionGrid({ locale, editSlug }: FactionGridProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const totalCards = ARMIES.length;
  const scrollUnit = (CARD_WIDTH + GAP) * CARDS_PER_SCROLL;

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    setCanScrollLeft(scroller.scrollLeft > 1);
    setCanScrollRight(scroller.scrollLeft < maxScrollLeft - 1);

    // Calculate active page index
    const cardIndex = Math.round(scroller.scrollLeft / (CARD_WIDTH + GAP));
    setActiveIndex(Math.floor(cardIndex / CARDS_PER_SCROLL));
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
    scroller.scrollBy({ left: scrollUnit, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: -scrollUnit, behavior: "smooth" });
  };

  const scrollToPage = (pageIndex: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({
      left: pageIndex * scrollUnit,
      behavior: "smooth",
    });
  };

  // Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setIsDragging(true);
    setStartX(e.pageX - scroller.offsetLeft);
    setScrollStart(scroller.scrollLeft);
    scroller.style.cursor = "grabbing";
    scroller.style.scrollSnapType = "none";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiplier for faster drag
    scroller.scrollLeft = scrollStart - walk;
  };

  const handleMouseUp = () => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.style.cursor = "grab";
      scroller.style.scrollSnapType = "x proximity";
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scroller.offsetLeft);
    setScrollStart(scroller.scrollLeft);
    scroller.style.scrollSnapType = "none";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const x = e.touches[0].pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1.5;
    scroller.scrollLeft = scrollStart - walk;
  };

  const handleTouchEnd = () => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.style.scrollSnapType = "x proximity";
    }
    setIsDragging(false);
  };

  const totalPages = Math.ceil(totalCards / CARDS_PER_SCROLL);

  return (
    <div className="relative group/carousel">
      {/* Left gradient fade */}
      <div
        className={`pointer-events-none absolute left-0 top-0 bottom-4 w-16 z-10
                    bg-gradient-to-r from-slate-950 to-transparent
                    transition-opacity duration-300
                    ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
      />

      {/* Right gradient fade */}
      <div
        className={`pointer-events-none absolute right-0 top-0 bottom-4 w-16 z-10
                    bg-gradient-to-l from-slate-950 to-transparent
                    transition-opacity duration-300
                    ${canScrollRight ? "opacity-100" : "opacity-0"}`}
      />

      {/* Scrollable container */}
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex gap-gap-md overflow-x-auto pb-4 scroll-smooth snap-x snap-proximity
                    scrollbar-hide cursor-grab select-none
                    ${isDragging ? "cursor-grabbing scroll-auto" : ""}`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {ARMIES.map((faction) => (
          <FactionCard
            key={faction.id}
            faction={faction}
            locale={locale}
            editSlug={editSlug}
            isDragging={isDragging}
          />
        ))}
      </div>

      {/* Left arrow button */}
      <button
        type="button"
        onClick={handleScrollLeft}
        aria-label="Scroll factions to the left"
        className={`absolute -left-[50px] top-[calc(50%-8px)] -translate-y-1/2
                    rounded-full border border-amber-300/40 bg-slate-900/90 p-2.5
                    text-amber-200 shadow-lg backdrop-blur-sm
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:border-amber-300 hover:text-amber-100 hover:bg-slate-800/90
                    active:scale-95
                    ${canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ChevronLeftIcon />
      </button>

      {/* Right arrow button */}
      <button
        type="button"
        onClick={handleScrollRight}
        aria-label="Scroll factions to the right"
        className={`absolute -right-[50px] top-[calc(50%-8px)] -translate-y-1/2
                    rounded-full border border-amber-300/40 bg-slate-900/90 p-2.5
                    text-amber-200 shadow-lg backdrop-blur-sm
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:border-amber-300 hover:text-amber-100 hover:bg-slate-800/90
                    active:scale-95
                    ${canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ChevronRightIcon />
      </button>

      {/* Pagination dots */}
      <div className="flex justify-center gap-gap-sm mt-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToPage(index)}
            aria-label={`Go to page ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ease-out
                        ${
                          index === activeIndex
                            ? "w-6 bg-amber-400"
                            : "w-2 bg-amber-400/30 hover:bg-amber-400/50"
                        }`}
          />
        ))}
      </div>
    </div>
  );
}
