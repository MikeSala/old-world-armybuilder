"use client";

import * as React from "react";

type Options = {
  detailSheetSelector?: string;
  printRootId?: string;
};

const DEFAULT_DETAIL_SELECTOR = ".print-roster-sheet";
const DEFAULT_PRINT_ROOT_ID = "summary-print-root";

export function useRosterExport(options?: Options) {
  const detailSheetSelector = options?.detailSheetSelector ?? DEFAULT_DETAIL_SELECTOR;
  const printRootId = options?.printRootId ?? DEFAULT_PRINT_ROOT_ID;

  const [showDetailSheet, setShowDetailSheet] = React.useState(false);
  const [pdfExporting, setPdfExporting] = React.useState(false);
  const [autoPdf, setAutoPdf] = React.useState(false);
  const [printRoot, setPrintRoot] = React.useState<HTMLElement | null>(null);

  const pdfRestoreSheetRef = React.useRef(false);
  const pdfFileNameRef = React.useRef("roster.pdf");

  const ensurePdfFilename = React.useCallback((raw?: string | null) => {
    const base = raw?.trim() ?? "";
    const normalized =
      base.length > 0
        ? base
            .replace(/[^a-z0-9\s._-]/gi, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
        : "roster";
    return normalized.toLowerCase().replace(/\.pdf$/i, "") + ".pdf";
  }, []);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const node = document.getElementById(printRootId);
    setPrintRoot(node);
  }, [printRootId]);

  const closeDetailSheet = React.useCallback(() => {
    setShowDetailSheet(false);
    setAutoPdf(false);
    setPdfExporting(false);
    pdfRestoreSheetRef.current = false;
  }, []);

  const handleDialogOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) {
        setShowDetailSheet(true);
        return;
      }
      closeDetailSheet();
    },
    [closeDetailSheet]
  );

  const handlePdfExport = React.useCallback((fileName?: string) => {
    if (pdfExporting) return;
    pdfRestoreSheetRef.current = showDetailSheet;
    setPdfExporting(true);
    pdfFileNameRef.current = ensurePdfFilename(fileName);
    if (!showDetailSheet) {
      setShowDetailSheet(true);
    }
    setAutoPdf(true);
  }, [ensurePdfFilename, pdfExporting, showDetailSheet]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    if (showDetailSheet) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [showDetailSheet]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!autoPdf || !showDetailSheet) return;
    let cancelled = false;

    const capture = async () => {
      try {
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const sheet = document.querySelector(detailSheetSelector) as HTMLElement | null;
        if (!sheet) return;

        sheet.classList.add("pdf-capture");
        const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
          import("html2canvas"),
          import("jspdf"),
        ]);
        if (cancelled) return;

        const captureScale = Math.max(window.devicePixelRatio || 1, 2);
        const canvas = await html2canvas(sheet, {
          scale: captureScale,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        if (cancelled) return;

        const orientation = canvas.width >= canvas.height ? "l" : "p";
        const pdf = new jsPDF({ orientation, unit: "pt", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const renderScale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const renderWidth = imgWidth * renderScale;
        const renderHeight = imgHeight * renderScale;
        const marginX = (pageWidth - renderWidth) / 2;
        const marginY = (pageHeight - renderHeight) / 2;

        const imageData = canvas.toDataURL("image/png", 1.0);
        pdf.addImage(
          imageData,
          "PNG",
          marginX,
          marginY,
          renderWidth,
          renderHeight,
          undefined,
          "FAST"
        );
        pdf.save(ensurePdfFilename(pdfFileNameRef.current));
      } catch (error) {
        console.error("Failed to export roster PDF", error);
      } finally {
        const sheetEl = document.querySelector(detailSheetSelector) as HTMLElement | null;
        if (sheetEl) {
          sheetEl.classList.remove("pdf-capture");
        }
        if (!cancelled) {
          setPdfExporting(false);
          setAutoPdf(false);
          if (!pdfRestoreSheetRef.current) {
            setShowDetailSheet(false);
          }
          pdfRestoreSheetRef.current = false;
        }
      }
    };

    capture();

    return () => {
      cancelled = true;
      pdfRestoreSheetRef.current = false;
      setPdfExporting(false);
      setAutoPdf(false);
    };
  }, [autoPdf, detailSheetSelector, showDetailSheet]);

  return {
    showDetailSheet,
    pdfExporting,
    printRoot,
    handleDialogOpenChange,
    handlePdfExport,
    closeDetailSheet,
    openDetailSheet: () => setShowDetailSheet(true),
  };
}

export type UseRosterExportReturn = ReturnType<typeof useRosterExport>;
