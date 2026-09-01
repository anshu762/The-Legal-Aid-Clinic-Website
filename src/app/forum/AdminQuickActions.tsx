"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { proactiveAdminAction } from "@/app/dashboard/admin/moderation/actions";
import { useRouter } from "next/navigation";

export function AdminQuickActions({ 
  targetType, 
  targetId 
}: { 
  targetType: "QUESTION" | "ANSWER" | "ADVISOR_PROFILE", 
  targetId: string 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "HIDE" | "REMOVE") => {
    const reason = prompt(`Reason for ${action.toLowerCase()}?`);
    if (!reason) return;
    
    setLoading(true);
    try {
      await proactiveAdminAction(targetType, targetId, action, reason);
      router.refresh();
    } catch (e: any) {
      alert("Failed: " + e.message);
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
