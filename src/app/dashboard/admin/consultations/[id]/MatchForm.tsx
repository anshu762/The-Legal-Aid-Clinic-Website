"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { confirmConsultationMatch } from "@/app/dashboard/admin/consultations/actions";
import { useRouter } from "next/navigation";

export function MatchForm({ 
  requestId, 
  advisors,
  preferredSlots
}: { 
  requestId: string, 
  advisors: any[],
  preferredSlots: string[]
}) {
  const router = useRouter();
  const [selectedAdvisorId, setSelectedAdvisorId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvisorId || !selectedSlot) {
      alert("Please select both an advisor and a time slot.");
      return;
    }
    
    setLoading(true);
    try {
      await confirmConsultationMatch(requestId, selectedAdvisorId, new Date(selectedSlot));
      alert("Match confirmed and emails sent!");
      router.refresh();
    } catch (err: any) {
      alert("Failed to confirm: " + err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">1. Select Match</label>
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
          value={selectedAdvisorId}
          onChange={(e) => setSelectedAdvisorId(e.target.value)}
        >
          <option value="">-- Choose an Advisor --</option>
          {advisors.map(adv => (
            <option key={adv.id} value={adv.id}>
              {adv.fullName} ({adv.advisorProfile?.specialization.join(", ")})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">2. Select Time (Seeker Preferred Slots)</label>
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
        >
          <option value="">-- Choose a Time --</option>
          {preferredSlots.map((slot, i) => (
            <option key={i} value={slot}>
              {new Date(slot).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Confirming..." : "Confirm Match & Dispatch Links"}
        </Button>
      </div>
    </form>
  );
}
