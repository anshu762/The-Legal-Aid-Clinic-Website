import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Volunteer Roster</h1>
        <div className="flex gap-2">
          <Button variant={!statusFilter ? "default" : "outline"} asChild size="sm">
            <Link href="/dashboard/admin/volunteers">All</Link>
          </Button>
          <Button variant={statusFilter === "PENDING" ? "default" : "outline"} asChild size="sm">
            <Link href="/dashboard/admin/volunteers?status=PENDING">Pending</Link>
          </Button>
          <Button variant={statusFilter === "VERIFIED" ? "default" : "outline"} asChild size="sm">
            <Link href="/dashboard/admin/volunteers?status=VERIFIED">Verified</Link>
          </Button>
          <Button variant={statusFilter === "REJECTED" ? "default" : "outline"} asChild size="sm">
            <Link href="/dashboard/admin/volunteers?status=REJECTED">Rejected</Link>
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
