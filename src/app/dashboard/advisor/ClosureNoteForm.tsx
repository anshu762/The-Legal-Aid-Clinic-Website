"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveClosureNote } from "./actions";

export function ClosureNoteForm({ consultationId, initialNote }: { consultationId: string, initialNote: string }) {
  const [note, setNote] = useState(initialNote);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveClosureNote(consultationId, note);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Failed to save note");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h4 className="text-xs font-bold text-muted-foreground uppercase">Closure Note</h4>
      <p className="text-[10px] text-destructive/80 font-semibold mb-1">
        WARNING: Do not include confidential case details here.
      </p>
      <textarea
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        rows={2}
        placeholder="Brief outcome (e.g. Advised on housing rights)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-green-600 font-medium">{saved ? "Saved!" : ""}</span>
        <Button type="submit" size="sm" variant="secondary" disabled={loading}>
          {loading ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </form>
  );
}
