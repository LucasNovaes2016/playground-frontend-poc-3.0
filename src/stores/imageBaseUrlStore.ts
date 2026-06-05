import { create } from "zustand";

export type ImageBaseUrlStoreState = {
  imageBaseUrl: string;
  setImageBaseUrl: (url: string) => void;
};

export const useImageBaseUrlStore = create<ImageBaseUrlStoreState>((set) => ({
  imageBaseUrl: "https://example.com/images",
  setImageBaseUrl: (url) => set({ imageBaseUrl: url }),
}));
