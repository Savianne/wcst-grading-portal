"use client"
import React, { createContext, useContext, useState } from "react";

type ErrorAlertContextType = {
  error: string | null;
  setError: (error: string | null) => void;
};

const ErrorAlertContext = createContext<ErrorAlertContextType | undefined>(undefined);

export const ErrorAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <ErrorAlertContext.Provider value={{ error, setError }}>
      {children}
    </ErrorAlertContext.Provider>
  );
};

export const useErrorAlert = () => {
  const context = useContext(ErrorAlertContext);
  if (!context) {
    throw new Error("useErrorAlert must be used within an ErrorAlertProvider");
  }
  return context;
};
