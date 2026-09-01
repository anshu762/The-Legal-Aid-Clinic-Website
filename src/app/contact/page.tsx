"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { submitGeneralReport } from "./actions";

export default function ContactPage() {
  const [isReport, setIsReport] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await submitGeneralReport({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
        isConcern: isReport,
        isUrgent: isReport && isUrgent
      });
      setIsSubmitted(true);
    } catch (e) {
      alert("Failed to submit");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-foreground font-serif">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">We're here to help. Send us a message or report a concern.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-lg border-border">
            <CardContent className="py-8 px-6 sm:px-10">
              {isSubmitted ? (
                <div className="text-center py-10">
                  <div className="mx-auto h-12 w-12 text-primary flex items-center justify-center rounded-full bg-primary/10 mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-xl font-medium text-foreground">Message sent successfully!</h3>
                  <p className="mt-2 text-muted-foreground">Thank you for reaching out. We will review it shortly.</p>
                  <Button variant="outline" className="mt-6" onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Are you reporting a concern/issue?</span>
                    <button
                      type="button"
                      onClick={() => setIsReport(!isReport)}
                      className={`${
                        isReport ? 'bg-red-500' : 'bg-muted-foreground/30'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          isReport ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                  
                  {isReport && (
                    <div className="flex items-start space-x-3 bg-red-50/50 p-4 rounded-md border border-red-100 mb-6">
                      <div className="flex items-center h-5">
                        <input
                          id="isUrgent"
                          type="checkbox"
                          checked={isUrgent}
                          onChange={(e) => setIsUrgent(e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-background border-input rounded"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="isUrgent" className="text-sm font-bold text-red-700 cursor-pointer">
                          This is an emergency / urgent
                        </label>
                        <p className="text-xs text-red-600/80 mt-1">
                          Checking this will flag it for priority review by our admins.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-border">
                    <label htmlFor="name" className="text-sm font-medium">Name (Optional)</label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email (Required)</label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      required
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      {isReport ? "Concern Details (Required)" : "Message (Required)"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      placeholder={isReport ? "Please describe the issue or concern in detail..." : "How can we help you?"}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant={isReport ? "destructive" : "default"}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : (isReport ? "Submit Report" : "Send Message")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
