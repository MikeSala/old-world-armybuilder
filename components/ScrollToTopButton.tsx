"use client";

import * as React from "react";

import { ArrowUpIcon } from "@/components/icons/ArrowUpIcon";
import { Button } from "@/components/ui/Button";

type Props = {
  label: string;
  className?: string;
};

export default function ScrollToTopButton({ label, className }: Props) {
  const handleClick = React.useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Button
      leftIcon={<ArrowUpIcon className="h-4 w-4 shrink-0" />}
      className={`rounded-lg border border-stone-400 bg-stone-100 px-4 py-2.5 font-semibold text-stone-900 transition-all duration-200 hover:border-stone-500 hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:border-stone-400 dark:hover:bg-stone-700${className ? ` ${className}` : ""}`}
      type="button"
      size="md"
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
