"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setMessage("Password has been reset successfully. You can now login.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive mb-4">Invalid or missing reset token.</p>
          <Link href="/forgot-password">
            <Button variant="outline">Request New Link</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-border">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold font-serif">Create New Password</CardTitle>
        <p className="text-center text-muted-foreground text-sm">
          Enter your new password below.
        </p>
      </CardHeader>
      <CardContent>
        {message ? (
          <div className="text-center">
            <p className="text-primary font-medium mb-4">{message}</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">New Password</label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
              />
            </div>
            
            {error && <p className="text-destructive text-sm bg-destructive/10 p-2 rounded">{error}</p>}
            
            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-16rem)] items-center justify-center p-4 py-24 bg-muted/20">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
