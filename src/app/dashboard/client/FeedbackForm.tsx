"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveFeedback } from "./actions";

export function FeedbackForm({ consultationId, initialRating, initialText }: { consultationId: string, initialRating: number, initialText: string }) {
  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveFeedback(consultationId, rating, text);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Failed to save feedback");
    }
    setLoading(false);
  };

  if (initialRating > 0 && !saved && !loading) {
    return (
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Your Feedback</h4>
        <div className="flex text-yellow-500 mb-2">
          {[1,2,3,4,5].map(star => (
            <svg key={star} className={`w-4 h-4 ${star <= rating ? "fill-current" : "text-muted"}`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        {text && <p className="text-sm text-muted-foreground italic">"{text}"</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h4 className="text-xs font-bold text-muted-foreground uppercase">Rate your session</h4>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border ${
              rating >= star ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground"
            }`}
          >
            {star}
          </button>
        ))}
      </div>

      <textarea
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        rows={2}
        placeholder="Any additional feedback? (Optional)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-green-600 font-medium">{saved ? "Saved!" : ""}</span>
        <Button type="submit" size="sm" disabled={loading || rating === 0}>
          {loading ? "Saving..." : "Submit Feedback"}
        </Button>
      </div>
    </form>
  );
}
