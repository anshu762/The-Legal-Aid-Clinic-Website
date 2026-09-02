import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { MessageSquare, Filter, Clock, CheckCircle2, FileCheck } from "lucide-react";

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            Consultation Oversight
          </h1>
          <p className="text-muted-foreground mt-1">Manage and assign incoming legal consultation requests.</p>
        </div>
        
        <div className="flex bg-muted/30 p-1 rounded-lg border border-border">
          <Button variant={!statusFilter ? "secondary" : "ghost"} asChild size="sm" className="h-8">
            <Link href="/dashboard/admin/consultations">
              <Filter className="w-4 h-4 mr-2" /> All
            </Link>
          </Button>
          <Button variant={statusFilter === "PENDING" ? "secondary" : "ghost"} asChild size="sm" className="h-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100/50">
            <Link href="/dashboard/admin/consultations?status=PENDING">
              <Clock className="w-4 h-4 mr-2" /> Pending
            </Link>
          </Button>
          <Button variant={statusFilter === "CONFIRMED" ? "secondary" : "ghost"} asChild size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100/50">
            <Link href="/dashboard/admin/consultations?status=CONFIRMED">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Confirmed
            </Link>
          </Button>
          <Button variant={statusFilter === "COMPLETED" ? "secondary" : "ghost"} asChild size="sm" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-100/50">
            <Link href="/dashboard/admin/consultations?status=COMPLETED">
              <FileCheck className="w-4 h-4 mr-2" /> Completed
            </Link>
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
