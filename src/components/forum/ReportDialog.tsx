"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { reportItem } from "@/app/forum/actions";
import { ReportTargetType } from "@prisma/client";
import { useAlertModal } from "@/components/ui/alert-modal";

export function ReportDialog({ targetType, targetId }: { targetType: "QUESTION" | "ANSWER" | "ADVISOR_PROFILE", targetId: string }) {
  const { showAlert } = useAlertModal();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setIsSubmitting(true);
    
    try {
      await reportItem(targetType, targetId, reason, note, isUrgent);
      setSuccess(true);
      setTimeout(() => setIsOpen(false), 2000);
    } catch (error) {
      showAlert("Error", "Failed to submit report. Please log in.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
      >
        Report
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4 font-serif text-foreground">Report Content</h3>
          
          {success ? (
            <div className="text-center py-6 text-green-600 font-medium">
              Report submitted successfully. Thank you.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Reason</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="SPAM">Spam or advertising</option>
                  <option value="INAPPROPRIATE">Inappropriate or offensive</option>
                  <option value="PERSONAL_INFO">Exposes personal information</option>
                  <option value="UNHELPFUL">Factually incorrect / harmful</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Additional details (Optional)</label>
                <textarea 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="urgentFlag"
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-input rounded"
                />
                <label htmlFor="urgentFlag" className="text-sm font-bold text-red-700">
                  Flag as an emergency
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" variant="destructive" disabled={isSubmitting || !reason}>
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
