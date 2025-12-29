"use client";

import React, { createContext, useContext } from "react";

interface EditModeContextType {
  isEditMode: boolean;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({
  children,
  isEditMode,
}: {
  children: React.ReactNode;
  isEditMode: boolean;
}) {
  return (
    <EditModeContext.Provider value={{ isEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error("useEditMode must be used within EditModeProvider");
  }
  return context;
}

