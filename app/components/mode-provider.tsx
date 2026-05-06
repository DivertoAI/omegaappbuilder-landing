"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type OmegaMode = "human" | "machine";

type OmegaModeContextValue = {
  mode: OmegaMode;
  setMode: (mode: OmegaMode) => void;
};

const OmegaModeContext = createContext<OmegaModeContextValue | null>(null);

export function OmegaModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<OmegaMode>("human");

  useEffect(() => {
    const stored = window.localStorage.getItem("omega_mode");
    if (stored === "machine" || stored === "human") {
      setModeState(stored);
    }
  }, []);

  useEffect(() => {
    document.body.dataset.mode = mode;
    window.localStorage.setItem("omega_mode", mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode: setModeState,
    }),
    [mode]
  );

  return <OmegaModeContext.Provider value={value}>{children}</OmegaModeContext.Provider>;
}

export function useOmegaMode() {
  const value = useContext(OmegaModeContext);
  if (!value) throw new Error("useOmegaMode must be used within OmegaModeProvider");
  return value;
}
