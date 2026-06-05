import React, { createContext, useState, type ReactNode } from "react";

export type ExportContextValue = {
  exportUrl: string | null;
  setExportUrl: (url: string) => void;
  clearExportUrl: () => void;
};

export const ExportContext = createContext<ExportContextValue | null>(null);

export function ExportProvider({ children }: { children: ReactNode }) {
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const clearExportUrl = () => setExportUrl(null);

  return (
    <ExportContext.Provider value={{ exportUrl, setExportUrl, clearExportUrl }}>
      {children}
    </ExportContext.Provider>
  );
}
