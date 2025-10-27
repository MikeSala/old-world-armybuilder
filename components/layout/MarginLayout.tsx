import type { ReactNode } from "react";

type MarginLayoutProps = {
  children: ReactNode;
};

export function MarginLayout({ children }: MarginLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 lg:px-12">
      {children}
    </div>
  );
}
