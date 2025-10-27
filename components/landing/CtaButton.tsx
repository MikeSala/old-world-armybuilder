"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button, type ButtonProps } from "../ui/Button";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
} & Omit<ButtonProps, "onClick">;

export function CtaButton({ href, children, ...props }: CtaButtonProps) {
  const router = useRouter();

  return (
    <Button
      {...props}
      onClick={() => {
        router.push(href);
      }}
    >
      {children}
    </Button>
  );
}
