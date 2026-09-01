"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <Button onClick={() => signOut({ callbackUrl: '/' })} className="bg-muted text-foreground hover:bg-muted/80">
          Sign Out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Hello <span className="font-semibold">{session?.user?.name}</span>,
          </p>
          <p className="mt-2">
            Role: <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-sm font-medium">{session?.user?.role}</span>
          </p>
          {session?.user?.verificationStatus && (
            <p className="mt-2">
              Verification Status:{" "}
              <span className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-2 py-1 text-sm font-medium">
                {session?.user?.verificationStatus}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8 p-4 bg-muted rounded-md text-sm text-muted-foreground text-center">
        Legal Disclaimer: This is legal information, not formal legal representation.
      </div>
    </main>
  );
}
