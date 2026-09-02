"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { processReport as resolveReport } from "./actions";
import { Badge } from "@/components/ui/badge";
import { useAlertModal } from "@/components/ui/alert-modal";

export function ReportRow({ report }: { report: any }) {
  const router = useRouter();
  const { showAlert, showConfirm } = useAlertModal();
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  const handleResolve = async (action: "DISMISS" | "HIDE" | "REMOVE") => {
    if (action !== "DISMISS" && !resolutionNote.trim()) {
      showAlert("Warning", "Please provide a resolution note for the audit trail.", "info");
      return;
    }
    
    if (action === "REMOVE") {
      const confirmed = await showConfirm("Remove Content?", "Remove this content from public view completely?");
      if (!confirmed) return;
    }

    setIsResolving(true);
    try {
      await resolveReport(report.id, action, resolutionNote || "");
      showAlert("Success", "Report resolved successfully.", "success");
      router.refresh();
    } catch (e: any) {
      showAlert("Error", "Failed: " + e.message, "error");
    } finally {
      setIsResolving(false);
    }
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
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={isResolving} onClick={() => handleResolve("DISMISS")}>
              Dismiss
            </Button>
            {report.targetType !== "GENERAL" && (
              <>
                <Button size="sm" variant="secondary" disabled={isResolving} onClick={() => handleResolve("HIDE")}>
                  Hide
                </Button>
                <Button size="sm" variant="destructive" disabled={isResolving} onClick={() => handleResolve("REMOVE")}>
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
