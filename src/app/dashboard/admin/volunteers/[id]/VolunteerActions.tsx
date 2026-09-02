"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveAdvisor, rejectAdvisor, toggleAdvisorActive } from "@/app/dashboard/admin/actions";
import { useRouter } from "next/navigation";

export function VolunteerActions({ 
  advisorId, 
  status, 
  isActive 
}: { 
  advisorId: string, 
  status: string, 
  isActive: boolean 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm("Approve this advisor?")) return;
    setLoading(true);
    try {
      await approveAdvisor(advisorId);
    } catch (e) {
      alert("Error approving");
    }
    setLoading(false);
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason (will be emailed to the user):");
    if (!reason) return;
    setLoading(true);
    try {
      await rejectAdvisor(advisorId, reason);
    } catch (e) {
      alert("Error rejecting");
    }
    setLoading(false);
  };

  const handleToggleActive = async () => {
    const action = isActive ? "Deactivate" : "Reactivate";
    if (!confirm(`Are you sure you want to ${action} this account?`)) return;
    setLoading(true);
    try {
      await toggleAdvisorActive(advisorId, !isActive);
    } catch (e) {
      alert(`Error ${action.toLowerCase()}ing`);
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
