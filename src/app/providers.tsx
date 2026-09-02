"use client";
import { SessionProvider } from "next-auth/react";
import { AlertModalProvider } from "@/components/ui/alert-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AlertModalProvider>
        {children}
      </AlertModalProvider>
    </SessionProvider>
  );
}
