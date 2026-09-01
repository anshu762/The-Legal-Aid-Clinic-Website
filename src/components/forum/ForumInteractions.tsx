"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleUpvote, markResolved, submitAnswer } from "@/app/forum/actions";

export function UpvoteButton({ answerId, initialCount, initiallyUpvoted }: { answerId: string, initialCount: number, initiallyUpvoted: boolean }) {
  const [upvoted, setUpvoted] = useState(initiallyUpvoted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (loading) return;
    setLoading(true);
    
    // Optimistic update
    const newUpvoted = !upvoted;
    setUpvoted(newUpvoted);
    setCount(prev => newUpvoted ? prev + 1 : prev - 1);

    try {
      await toggleUpvote(answerId);
    } catch (e) {
      // Revert on failure
      setUpvoted(upvoted);
      setCount(initialCount);
      alert("Failed to upvote. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={upvoted ? "default" : "outline"} 
      size="sm" 
      onClick={handleUpvote}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      {count}
    </Button>
  );
}

export function MarkResolvedButton({ questionId }: { questionId: string }) {
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    if (!confirm("Are you sure you want to mark this question as resolved?")) return;
    setLoading(true);
    try {
      await markResolved(questionId);
    } catch (e) {
      alert("Failed to mark resolved.");
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={handleResolve} disabled={loading}>
      {loading ? "Updating..." : "Mark as Resolved"}
    </Button>
  );
}

export function AnswerForm({ questionId }: { questionId: string }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim().length < 20) {
      setError("Answer must be at least 20 characters.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await submitAnswer(questionId, body);
      setBody("");
    } catch (err: any) {
      setError(err.message || "Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-muted/20 p-6 rounded-xl border border-border">
      <h3 className="text-lg font-bold font-serif mb-4">Provide an Answer</h3>
      
      <div className="space-y-4">
        <textarea
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[150px]"
          placeholder="Share your legal expertise..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        
        {error && <p className="text-destructive text-sm">{error}</p>}
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground w-2/3">
            Your verified badge and name will be attached. A standard legal disclaimer will automatically be appended.
          </p>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Answer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
