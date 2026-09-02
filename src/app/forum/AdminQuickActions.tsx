"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { proactiveAdminAction } from "@/app/dashboard/admin/moderation/actions";
import { useRouter } from "next/navigation";
import { useAlertModal } from "@/components/ui/alert-modal";

export function AdminQuickActions({ 
  targetType, 
  targetId 
}: { 
  targetType: "QUESTION" | "ANSWER" | "ADVISOR_PROFILE", 
  targetId: string 
}) {
  const router = useRouter();
  const { showAlert, showPrompt } = useAlertModal();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "HIDE" | "REMOVE") => {
    const reason = await showPrompt("Reason Required", `Reason for ${action.toLowerCase()}?`);
    if (!reason) return;
    
    setLoading(true);
    try {
      await proactiveAdminAction(targetType, targetId, action, reason);
      showAlert("Success", `${targetType} has been ${action === "HIDE" ? "hidden" : "removed"}.`, "success");
      router.refresh();
    } catch (e: any) {
      showAlert("Error", "Failed: " + e.message, "error");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant="secondary" 
        className="h-7 text-xs bg-orange-100 text-orange-800 hover:bg-orange-200"
        onClick={() => handleAction("HIDE")}
        disabled={loading}
      >
        Admin Hide
      </Button>
      <Button 
        size="sm" 
        variant="destructive" 
        className="h-7 text-xs"
        onClick={() => handleAction("REMOVE")}
        disabled={loading}
      >
        Admin Remove
      </Button>
    </div>
  );
}
