"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Users, AlertTriangle, MessageSquare, FileText, BarChart3, TrendingUp } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/admin", label: "Overview", icon: BarChart3, exact: true },
    { href: "/dashboard/admin/analytics", label: "Analytics & Trends", icon: TrendingUp },
    { href: "/dashboard/admin/volunteers", label: "Volunteers", icon: Users },
    { href: "/dashboard/admin/moderation", label: "Moderation Queue", icon: AlertTriangle },
    { href: "/dashboard/admin/consultations", label: "Consultations", icon: MessageSquare },
    { href: "/dashboard/admin/articles", label: "Articles (CMS)", icon: FileText },
  ];

  return (
    <aside className="w-72 border-r border-border bg-background shadow-sm flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
      <div className="p-6 border-b border-border/50 bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-foreground">Admin Portal</h2>
            <p className="text-xs text-muted-foreground font-medium">Control Center</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Menu</h3>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-primary-foreground/90" : "text-muted-foreground"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
