"use client"
import React, { createContext, useContext, useState } from "react";

type SuccessAlertContextType = {
  message: string | null;
  setMessage: (error: string | null) => void;
};

const SuccessAlertContext = createContext<SuccessAlertContextType | undefined>(undefined);

export const SuccessAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <SuccessAlertContext.Provider value={{ message, setMessage }}>
      {children}
    </SuccessAlertContext.Provider>
  );
};

export const useSuccessAlert = () => {
  const context = useContext(SuccessAlertContext);
  if (!context) {
    throw new Error("useErrorAlert must be used within an ErrorAlertProvider");
  }
  return context;
};
