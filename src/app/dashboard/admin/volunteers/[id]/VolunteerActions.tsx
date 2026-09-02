"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveAdvisor, rejectAdvisor, toggleAdvisorActive } from "@/app/dashboard/admin/actions";
import { useRouter } from "next/navigation";
import { useAlertModal } from "@/components/ui/alert-modal";

export function VolunteerActions({ 
  advisorId, 
  status, 
  isActive 
}: { 
  advisorId: string, 
  status: string, 
  isActive: boolean 
}) {
  const { showAlert, showConfirm, showPrompt } = useAlertModal();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    const confirmed = await showConfirm("Approve Advisor?", "Are you sure you want to approve this application?");
    if (!confirmed) return;
    
    setLoading(true);
    try {
      await approveAdvisor(advisorId);
      showAlert("Approved", "The advisor has been approved and notified.", "success");
    } catch (e) {
      showAlert("Error", "Failed to approve advisor.", "error");
    }
    setLoading(false);
  };

  const handleReject = async () => {
    const reason = await showPrompt("Reject Application", "Enter rejection reason (will be emailed to the user):");
    if (!reason) return;
    
    setLoading(true);
    try {
      await rejectAdvisor(advisorId, reason);
      showAlert("Rejected", "The application was rejected and the user was notified.", "success");
    } catch (e) {
      showAlert("Error", "Failed to reject advisor.", "error");
    }
    setLoading(false);
  };

  const handleToggleActive = async () => {
    const action = isActive ? "Deactivate" : "Reactivate";
    const confirmed = await showConfirm(`${action} Account`, `Are you sure you want to ${action.toLowerCase()} this account?`);
    if (!confirmed) return;
    
    setLoading(true);
    try {
      await toggleAdvisorActive(advisorId, !isActive);
      showAlert("Success", `Account has been ${action.toLowerCase()}d.`, "success");
    } catch (e) {
      showAlert("Error", `Failed to ${action.toLowerCase()} account.`, "error");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-4 p-6 bg-muted/20 border-t border-border mt-8">
      {status === "PENDING" && (
        <>
          <Button onClick={handleApprove} disabled={loading} className="bg-green-600 hover:bg-green-700">Approve Application</Button>
          <Button onClick={handleReject} disabled={loading} variant="destructive">Reject Application</Button>
        </>
      )}
      {status === "VERIFIED" && (
        <Button onClick={handleToggleActive} disabled={loading} variant={isActive ? "destructive" : "default"}>
          {isActive ? "Deactivate Account" : "Reactivate Account"}
        </Button>
      )}
      {status === "REJECTED" && (
        <Button onClick={handleApprove} disabled={loading} className="bg-green-600 hover:bg-green-700">Reconsider & Approve</Button>
      )}
    </div>
  );
}
