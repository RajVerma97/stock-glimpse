"use client";
// axios-context.tsx
import React, { createContext, useContext, ReactNode } from "react";
import axios, { AxiosInstance } from "axios";

// Create an Axios context with the default value as undefined
const AxiosContext = createContext<AxiosInstance | undefined>(undefined);

interface AxiosProviderProps {
  children: ReactNode;
}

// Provide Axios instance through context
export function AxiosProvider({ children }: AxiosProviderProps) {
  const axiosInstance = axios.create({
    baseURL: "https://localhost:3000",
    // You can add headers or other configuration here
  });

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
}

// Custom hook to use Axios instance
export function useAxiosContext() {
  const context = useContext(AxiosContext);
  if (context === undefined) {
    throw new Error("useAxiosContext must be used within an AxiosProvider");
  }
  return context;
}
