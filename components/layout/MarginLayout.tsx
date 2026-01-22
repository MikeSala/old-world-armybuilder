import type { ReactNode } from "react";

type MarginLayoutProps = {
  children: ReactNode;
};

export function MarginLayout({ children }: MarginLayoutProps) {
  return <div className="mx-auto w-full max-w-main px-container">{children}</div>;
}
