"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateAvailability } from "@/app/dashboard/advisor/actions";
import { useRouter } from "next/navigation";

import { useAlertModal } from "@/components/ui/alert-modal";

export function AvailabilityForm({ 
  initialIsPaused, 
  initialSchedule, 
  initialDurations 
}: { 
  initialIsPaused: boolean, 
  initialSchedule: string, 
  initialDurations: number[] 
}) {
  const router = useRouter();
  const { showAlert } = useAlertModal();
  const [isPaused, setIsPaused] = useState(initialIsPaused);
  const [schedule, setSchedule] = useState(initialSchedule);
  
  const has15 = initialDurations.includes(15);
  const has30 = initialDurations.includes(30);
  const has60 = initialDurations.includes(60);

  const [d15, setD15] = useState(has15);
  const [d30, setD30] = useState(has30);
  const [d60, setD60] = useState(has60);
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const durations = [];
    if (d15) durations.push(15);
    if (d30) durations.push(30);
    if (d60) durations.push(60);

    try {
      await updateAvailability({
        isPaused,
        weeklyAvailability: schedule,
        preferredDurations: durations,
      });
      showAlert("Success!", "Your availability preferences have been saved.", "success");
      router.push("/dashboard/advisor");
      router.refresh();
    } catch (e) {
      showAlert("Error", "Failed to update availability. Please try again.", "error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="flex items-start space-x-3 bg-muted/20 p-4 rounded-md border border-border">
        <div className="flex items-center h-5">
          <input
            id="isPaused"
            type="checkbox"
            checked={isPaused}
            onChange={(e) => setIsPaused(e.target.checked)}
            className="w-4 h-4 text-primary bg-background border-input rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="isPaused" className="text-sm font-bold text-foreground cursor-pointer">
            Pause New Consultation Requests
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            When checked, you will not be matched with any new clients. (Phase 5 TODO: Ensure matching engine reads this toggle).
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Weekly Schedule (e.g., Mon/Wed 2pm-5pm EST)</label>
        <textarea
          value={schedule}
          onChange={e => setSchedule(e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="I am typically available on..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Preferred Consultation Durations</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={d15} onChange={e => setD15(e.target.checked)} />
            15 mins
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={d30} onChange={e => setD30(e.target.checked)} />
            30 mins
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={d60} onChange={e => setD60(e.target.checked)} />
            60 mins
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="submit" isLoading={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </form>
  );
}
