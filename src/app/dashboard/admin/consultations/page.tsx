import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminConsultationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireRole(["ADMIN"]);
  const sp = await searchParams;
  const statusFilter = sp.status;

  const requests = await prisma.consultationRequest.findMany({
    where: statusFilter ? { status: statusFilter as any } : {},
    orderBy: [
      { urgencyFlag: "desc" },
      { id: "asc" }
    ],
    include: {
      requester: { select: { fullName: true } },
    }
  }) as any[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Consultation Oversight</h1>
        <div className="flex gap-2">
          <Button variant={!statusFilter ? "default" : "outline"} asChild size="sm">
            <Link href="/dashboard/admin/consultations">All</Link>
          </Button>
          <Button variant={statusFilter === "PENDING" ? "default" : "outline"} asChild size="sm">
            <Link href="/dashboard/admin/consultations?status=PENDING">Pending</Link>
          </Button>
          <Button variant={statusFilter === "CONFIRMED" ? "default" : "outline"} asChild size="sm">
            <Link href="/dashboard/admin/consultations?status=CONFIRMED">Confirmed</Link>
          </Button>
          <Button variant={statusFilter === "COMPLETED" ? "default" : "outline"} asChild size="sm">
            <Link href="/dashboard/admin/consultations?status=COMPLETED">Completed</Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Seeker</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Length</th>
                <th className="px-6 py-4 font-medium">Urgency</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req.id} className="bg-background hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{req.preferredName || req.requester.fullName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{req.category}</td>
                  <td className="px-6 py-4 text-muted-foreground">{req.requestedLengthMinutes}m</td>
                  <td className="px-6 py-4">
                    {req.urgencyFlag ? <Badge variant="destructive">Urgent</Badge> : <span className="text-muted-foreground">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    {req.status === "PENDING" && <Badge variant="secondary">Pending Match</Badge>}
                    {req.status === "CONFIRMED" && <Badge className="bg-green-600">Confirmed</Badge>}
                    {req.status === "COMPLETED" && <Badge variant="outline">Completed</Badge>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/admin/consultations/${req.id}`}>Manage</Link>
                    </Button>
                  </td>
                </tr>
              ))}
              
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No consultation requests found.
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
