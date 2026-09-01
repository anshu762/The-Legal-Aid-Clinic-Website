"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage("If an account with that email exists, we sent a password reset link.");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to request password reset");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-16rem)] items-center justify-center p-4 py-24 bg-muted/20">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold font-serif">Reset Password</CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Enter your email to receive a secure reset link.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
            {message && <p className="text-primary text-sm bg-primary/10 p-2 rounded">{message}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
              &larr; Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
