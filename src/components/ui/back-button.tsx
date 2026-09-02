"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton({ fallbackUrl = "/" }: { fallbackUrl?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        // Just go back in history
        router.back();
      }}
      className="mb-4 text-muted-foreground hover:text-foreground -ml-2 h-8 px-2"
    >
      <ArrowLeft className="w-4 h-4 mr-1.5" />
      Back
    </Button>
  );
}
