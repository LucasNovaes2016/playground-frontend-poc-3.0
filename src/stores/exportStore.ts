import { create } from "zustand";

export type ExportStoreState = {
  exportUrl: string | null;
  setExportUrl: (url: string) => void;
  clearExportUrl: () => void;
};

export const useExportStore = create<ExportStoreState>((set) => ({
  exportUrl: null,
  setExportUrl: (url) => set({ exportUrl: url }),
  clearExportUrl: () => set({ exportUrl: null }),
}));
