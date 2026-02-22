"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Army } from "@/lib/data/armies/armies";
import { FactionCard } from "./FactionCard";
import type { Locale } from "@/lib/i18n/dictionaries";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

type FactionGridProps = {
  locale: Locale;
  editSlug: string;
  armies: Army[];
};

const SCROLL_UNIT = 400;

export function FactionGrid({ locale, editSlug, armies }: FactionGridProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    setCanScrollLeft(scroller.scrollLeft > 1);
    setCanScrollRight(scroller.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const handleScrollRight = () => {
    scrollerRef.current?.scrollBy({ left: SCROLL_UNIT, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    scrollerRef.current?.scrollBy({ left: -SCROLL_UNIT, behavior: "smooth" });
  };

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
    const walk = (x - startX) * 1.5;
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
    if (isDragging) handleMouseUp();
  };

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
    if (scroller) scroller.style.scrollSnapType = "x proximity";
    setIsDragging(false);
  };

  return (
    <div className="relative">
      {/* Scrollable container — px-10 reserves space for the overlay arrows */}
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
        className={`overflow-x-auto overflow-y-clip py-2 px-10 scroll-smooth snap-x snap-proximity scrollbar-hide cursor-grab select-none${isDragging ? " cursor-grabbing scroll-auto" : ""}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* w-fit mx-auto: centers when items fit, scrolls from left when they overflow */}
        <div className="flex gap-2 w-fit mx-auto">
          {armies.map((faction) => (
            <FactionCard
              key={faction.id}
              faction={faction}
              locale={locale}
              editSlug={editSlug}
              isDragging={isDragging}
            />
          ))}
        </div>
      </div>

      {/* Left arrow */}
      <button
        type="button"
        onClick={handleScrollLeft}
        aria-label="Scroll factions to the left"
        className={`absolute left-1 top-1/2 -translate-y-1/2 z-10
                    rounded-full border border-stone-300/40 bg-stone-800/90 p-2.5
                    text-stone-200 shadow-lg backdrop-blur-sm
                    transition-all duration-200
                    hover:scale-110 hover:border-stone-300 hover:text-stone-100 hover:bg-stone-700/90
                    active:scale-95
                    ${canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ChevronLeftIcon />
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={handleScrollRight}
        aria-label="Scroll factions to the right"
        className={`absolute right-1 top-1/2 -translate-y-1/2 z-10
                    rounded-full border border-stone-300/40 bg-stone-800/90 p-2.5
                    text-stone-200 shadow-lg backdrop-blur-sm
                    transition-all duration-200
                    hover:scale-110 hover:border-stone-300 hover:text-stone-100 hover:bg-stone-700/90
                    active:scale-95
                    ${canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
