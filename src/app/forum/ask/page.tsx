"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { askQuestion } from "@/app/forum/actions";

const schema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  body: z.string().min(20, "Body must be at least 20 characters").max(2000),
  category: z.string().min(1, "Please select a category"),
  isAnonymous: z.boolean(),
});

export default function AskQuestionPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      body: "",
      category: "",
      isAnonymous: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setError("");
    try {
      const q = await askQuestion(data);
      router.push(`/forum/${q.id}`);
    } catch (e: any) {
      setError(e.message || "Failed to submit question");
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <BackButton />
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-serif text-foreground">Ask a Legal Question</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Get free legal information from verified volunteers. Do not share highly sensitive data (like SSNs).
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  {...register("category")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Housing">Housing</option>
                  <option value="Family">Family</option>
                  <option value="Employment">Employment</option>
                  <option value="Immigration">Immigration</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  {...register("title")} 
                  placeholder="Summarize your legal question..."
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Details</label>
                <textarea 
                  {...register("body")}
                  rows={6}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Provide background context and your specific question..."
                />
                {errors.body && <p className="text-destructive text-sm">{errors.body.message}</p>}
              </div>

              <div className="flex items-start space-x-3 bg-primary/5 p-4 rounded-md border border-primary/20">
                <div className="flex items-center h-5">
                  <input
                    id="isAnonymous"
                    type="checkbox"
                    {...register("isAnonymous")}
                    className="w-4 h-4 text-primary bg-background border-input rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="isAnonymous" className="text-sm font-bold text-foreground cursor-pointer">
                    Post Anonymously
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Anonymous hides your name from other users and the public. Admins can always see your account for safety and moderation.
                  </p>
                </div>
              </div>

              {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded">{error}</div>}

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" isLoading={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Question"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
