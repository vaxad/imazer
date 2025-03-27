import QueryProvider from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ProviderProps } from "@/lib/types/common";
import React from "react";

export default function AppProvider({ children }: ProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" enableSystem>
        <Toaster />
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
