import React, { createContext, useState, type ReactNode } from "react";

export type ImageBaseUrlContextValue = {
  imageBaseUrl: string;
  setImageBaseUrl: (url: string) => void;
};

export const ImageBaseUrlContext =
  createContext<ImageBaseUrlContextValue | null>(null);

export function ImageBaseUrlProvider({ children }: { children: ReactNode }) {
  const [imageBaseUrl, setImageBaseUrl] = useState(
    "https://example.com/images",
  );

  return (
    <ImageBaseUrlContext.Provider value={{ imageBaseUrl, setImageBaseUrl }}>
      {children}
    </ImageBaseUrlContext.Provider>
  );
}
