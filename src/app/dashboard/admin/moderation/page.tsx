import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roles";
import { Card } from "@/components/ui/card";
import { ReportRow } from "./ReportRow";

import { AlertTriangle } from "lucide-react";

export default async function ModerationQueuePage() {
  await requireRole(["ADMIN"]);

  const reports = await prisma.report.findMany({
    where: { status: "OPEN" },
    include: {
      reporter: { select: { fullName: true, email: true } }
    },
    orderBy: [
      { isEmergency: "desc" },
      { createdAt: "asc" } // Oldest unresolved issues first
    ]
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif flex items-center gap-2">
          <AlertTriangle className="w-8 h-8 text-primary" />
          Moderation Queue
        </h1>
        <p className="text-muted-foreground mt-1">Review and resolve flagged content and user reports.</p>
      </div>

      <Card className="shadow-sm border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-medium">Target</th>
                <th className="p-4 font-medium">Reason</th>
                <th className="p-4 font-medium">Reporter (Internal)</th>
                <th className="p-4 font-medium">Submitted</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <ReportRow key={report.id} report={report} />
              ))}
              
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground">
                    The moderation queue is clear. Good job!
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
