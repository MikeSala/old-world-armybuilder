"use client";

import * as React from "react";

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
    <Button className={className} type="button" size="md" onClick={handleClick}>
      {label}
    </Button>
  );
}
