"use client";

import { useEffect } from "react";

export default function RootRedirect() {
  useEffect(() => {
    window.location.replace("/pl");
  }, []);

  return (
    <main className="min-h-screen bg-slate-600 text-amber-300">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:px-8 lg:px-10">
        <h1 className="text-xl font-semibold text-amber-100">Redirecting…</h1>
        <p className="text-sm text-amber-200/80">
          If you are not redirected, open{" "}
          <a className="text-amber-100 underline hover:text-amber-200" href="/pl">
            /pl
          </a>
          .
        </p>
      </div>
    </main>
  );
}
