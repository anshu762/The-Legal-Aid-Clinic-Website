import { requireRole } from "@/lib/roles";
import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole(["ADMIN"]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20 w-full">
      <AdminSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
