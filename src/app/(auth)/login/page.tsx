"use client";

import { useState, Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("SEEKING_HELP");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("mode") === "register") {
      setIsLogin(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password, role }),
        });

        if (res.ok) {
          await signIn("credentials", {
            redirect: false,
            email,
            password,
          });
          router.push("/dashboard");
        } else {
          const data = await res.json();
          setError(data.error || "Failed to register");
          setIsLoading(false);
        }
      } catch (err) {
        setError("Something went wrong");
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold font-serif">
          {isLogin ? "Welcome Back" : "Join TLC"}
        </CardTitle>
        <p className="text-center text-muted-foreground text-sm">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">I want to...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("SEEKING_HELP")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                      role === "SEEKING_HELP"
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="font-semibold text-sm">Get Help</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("LEGAL_ADVISOR")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                      role === "LEGAL_ADVISOR"
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="font-semibold text-sm">Volunteer</span>
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {isLogin ? "Sign In" : "Register"}
          </Button>
        </form>
        
        <div className="mt-4 flex flex-col space-y-2 text-center text-sm">
          {isLogin && (
            <a href="/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">
              Forgot your password?
            </a>
          )}
          <div className="text-muted-foreground text-sm flex items-center justify-center gap-1">
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-semibold"
            >
              {isLogin ? "Register" : "Sign in"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-16rem)] items-center justify-center p-4 py-24">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
