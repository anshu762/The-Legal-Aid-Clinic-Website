import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Users, Filter, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default async function AdminVolunteersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const sp = await searchParams;
  const statusFilter = sp.status;

  const users = await prisma.user.findMany({
    where: {
      role: "LEGAL_ADVISOR",
      ...(statusFilter ? { advisorProfile: { verificationStatus: statusFilter as any } } : {}),
    },
    include: {
      advisorProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Volunteer Roster
          </h1>
          <p className="text-muted-foreground mt-1">Manage and verify legal advisors on the platform.</p>
        </div>
        
        <div className="flex bg-muted/30 p-1 rounded-lg border border-border">
          <Button variant={!statusFilter ? "secondary" : "ghost"} asChild size="sm" className="h-8">
            <Link href="/dashboard/admin/volunteers">
              <Filter className="w-4 h-4 mr-2" /> All
            </Link>
          </Button>
          <Button variant={statusFilter === "PENDING" ? "secondary" : "ghost"} asChild size="sm" className="h-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100/50">
            <Link href="/dashboard/admin/volunteers?status=PENDING">
              <Clock className="w-4 h-4 mr-2" /> Pending
            </Link>
          </Button>
          <Button variant={statusFilter === "VERIFIED" ? "secondary" : "ghost"} asChild size="sm" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-100/50">
            <Link href="/dashboard/admin/volunteers?status=VERIFIED">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Verified
            </Link>
          </Button>
          <Button variant={statusFilter === "REJECTED" ? "secondary" : "ghost"} asChild size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-100/50">
            <Link href="/dashboard/admin/volunteers?status=REJECTED">
              <AlertCircle className="w-4 h-4 mr-2" /> Rejected
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Specialization</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="bg-background hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {user.fullName}
                    {!user.isActive && <Badge variant="destructive" className="ml-2 text-[10px]">Deactivated</Badge>}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">
                    {user.advisorProfile?.specialization.join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    {user.advisorProfile?.verificationStatus === "PENDING" && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>}
                    {user.advisorProfile?.verificationStatus === "VERIFIED" && <Badge className="bg-green-600 hover:bg-green-700">Verified</Badge>}
                    {user.advisorProfile?.verificationStatus === "REJECTED" && <Badge variant="destructive">Rejected</Badge>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/admin/volunteers/${user.id}`}>Review</Link>
                    </Button>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No volunteers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
