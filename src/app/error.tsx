"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-extrabold font-serif text-destructive mb-4">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error. Our team has been notified. Please try again or return to the homepage.
      </p>
      <div className="flex gap-4">
        <Button variant="default" onClick={() => reset()}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
