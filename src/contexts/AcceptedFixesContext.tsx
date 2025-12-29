"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface AcceptedFix {
  id: string;
  impact: number;
  cardId: string;
}

interface AcceptedFixesContextType {
  acceptedFixes: AcceptedFix[];
  acceptFix: (fix: AcceptedFix) => void;
  removeFix: (id: string) => void;
  getTotalImpact: () => number;
}

const AcceptedFixesContext = createContext<AcceptedFixesContextType | undefined>(undefined);

export function AcceptedFixesProvider({ children }: { children: React.ReactNode }) {
  const [acceptedFixes, setAcceptedFixes] = useState<AcceptedFix[]>([]);

  const acceptFix = useCallback((fix: AcceptedFix) => {
    setAcceptedFixes((prev) => {
      // Don't add duplicates
      if (prev.some((f) => f.id === fix.id)) return prev;
      return [...prev, fix];
    });
  }, []);

  const removeFix = useCallback((id: string) => {
    setAcceptedFixes((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const getTotalImpact = useCallback(() => {
    return acceptedFixes.reduce((sum, fix) => sum + fix.impact, 0);
  }, [acceptedFixes]);

  return (
    <AcceptedFixesContext.Provider
      value={{
        acceptedFixes,
        acceptFix,
        removeFix,
        getTotalImpact,
      }}
    >
      {children}
    </AcceptedFixesContext.Provider>
  );
}

export function useAcceptedFixes() {
  const context = useContext(AcceptedFixesContext);
  if (context === undefined) {
    throw new Error("useAcceptedFixes must be used within AcceptedFixesProvider");
  }
  return context;
}

