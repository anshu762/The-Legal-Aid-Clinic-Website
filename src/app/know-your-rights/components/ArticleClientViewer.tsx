"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { DLSA_DIRECTORY, STATES } from "@/lib/dlsa-directory";

export function ArticleClientViewer({ article }: { article: any }) {
  const [selectedState, setSelectedState] = useState(STATES[0]);
  const dlsaInfo = DLSA_DIRECTORY[selectedState];

  return (
    <div className="space-y-8">
      <div className="prose prose-sm sm:prose max-w-none text-foreground">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
          {article.bodyMarkdown}
        </ReactMarkdown>
      </div>

      {article.category === "NALSA/DLSA Schemes" && (
        <div className="mt-12 bg-muted/30 border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold font-serif mb-4">Find your nearest Legal Services Authority</h3>
          <p className="text-sm text-muted-foreground mb-4">Select your state to find the contact information for your local DLSA office.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          {dlsaInfo && (
            <div className="bg-background border border-border p-4 rounded-md">
              <div className="font-bold text-foreground mb-1">{dlsaInfo.office}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <strong>Helpline:</strong> {dlsaInfo.phone}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <strong>Website:</strong> <a href={dlsaInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{dlsaInfo.website}</a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Disclaimer */}
      <div className="mt-8 bg-muted p-4 rounded-md border border-border text-sm text-muted-foreground italic">
        Disclaimer: This is legal information, not formal legal representation. Contact a legal professional for personalized advice.
      </div>
    </div>
  );
}
