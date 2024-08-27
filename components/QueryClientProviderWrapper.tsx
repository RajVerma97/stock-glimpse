"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import React from "react";

const QueryClientProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientProviderWrapper;
