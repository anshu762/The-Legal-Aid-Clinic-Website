"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { processReport } from "./actions";
import { Badge } from "@/components/ui/badge";

export function ReportRow({ report }: { report: any }) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const handleAction = async (action: "DISMISS" | "HIDE" | "REMOVE") => {
    if (!note) {
      alert("Please provide a resolution note for the audit trail.");
      return;
    }
    
    if (action === "REMOVE" && !confirm("Remove this content from public view completely?")) return;

    setLoading(true);
    try {
      await processReport(report.id, action, note);
    } catch (e: any) {
      alert("Failed: " + e.message);
    }
    setLoading(false);
  };

  return (
    <tr className={`border-b border-border ${report.isEmergency ? "bg-red-50/50" : "bg-background"}`}>
      <td className="p-4">
        <div className="flex items-center gap-2">
          {report.isEmergency && <Badge variant="destructive">URGENT</Badge>}
          <span className="font-semibold">{report.targetType}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">
          ID: {report.targetId}
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm">{report.reason}</div>
      </td>
      <td className="p-4">
        <div className="text-sm">{report.reporter?.fullName || "Anonymous"}</div>
        <div className="text-xs text-muted-foreground">{report.reporter?.email || "No Email"}</div>
      </td>
      <td className="p-4">
        <div className="text-sm text-muted-foreground">{new Date(report.createdAt).toLocaleString()}</div>
      </td>
      <td className="p-4 min-w-[300px]">
        <div className="space-y-2">
          <input
            type="text"
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            placeholder="Audit/resolution note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={loading} onClick={() => handleAction("DISMISS")}>
              Dismiss
            </Button>
            {report.targetType !== "GENERAL" && (
              <>
                <Button size="sm" variant="secondary" disabled={loading} onClick={() => handleAction("HIDE")}>
                  Hide
                </Button>
                <Button size="sm" variant="destructive" disabled={loading} onClick={() => handleAction("REMOVE")}>
                  Remove
                </Button>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
