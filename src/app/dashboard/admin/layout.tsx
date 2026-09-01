import { requireRole } from "@/lib/roles";
import Link from "next/link";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole(["ADMIN"]);

  return (
    <div className="flex min-h-[calc(100vh-16rem)] bg-muted/10 w-full">
      <aside className="w-64 border-r border-border bg-background">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold font-serif">Admin Panel</h2>
        </div>
        <nav className="flex flex-col px-4 py-4 space-y-2">
          <Link href="/dashboard/admin/volunteers" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground transition-colors">Volunteers</Link>
          <Link href="/dashboard/admin/moderation" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground transition-colors">Moderation</Link>
          <Link href="/dashboard/admin/consultations" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground transition-colors">Consultations</Link>
          <Link href="/dashboard/admin/articles" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground transition-colors">Articles</Link>
          <Link href="/dashboard/admin/analytics" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground transition-colors">Analytics</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
