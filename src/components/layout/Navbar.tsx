"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/#mission", label: "Our Mission" },
    { href: "/#know-your-rights", label: "Know Your Rights" },
    { href: "/#faq", label: "FAQ" },
    { href: "/#volunteers", label: "Volunteers" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-serif text-2xl font-bold text-primary">
            TLC.
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            {pathname === "/" && links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-primary">
                Sign In
              </Link>
              <Link href="/login?mode=register">
                <Button>Get Help</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background"
          >
            <div className="flex flex-col px-4 py-4 space-y-4">
              {pathname === "/" && links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              {pathname === "/" && <div className="h-px bg-border my-2" />}
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-medium">
                    Dashboard
                  </Link>
                  <Button variant="outline" onClick={() => signOut()} className="w-full justify-start">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="text-sm font-medium">
                    Sign In
                  </Link>
                  <Link href="/login?mode=register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Get Help</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
