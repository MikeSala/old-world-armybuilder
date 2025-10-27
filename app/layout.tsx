import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { MarginLayout } from "../components/layout/MarginLayout";

export const metadata: Metadata = {
  title: "Warhammer Army Builder",
  description: "Narzędzie do tworzenia rozpiski armii Warhammer.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body className="bg-slate-600 text-amber-300">
        <MarginLayout>{children}</MarginLayout>
      </body>
    </html>
  );
}
