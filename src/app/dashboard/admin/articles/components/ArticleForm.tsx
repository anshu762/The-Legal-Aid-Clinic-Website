"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createArticle, updateArticle } from "../actions";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  category: z.string().min(1, "Category is required"),
  language: z.string().min(1, "Language is required"),
  bodyMarkdown: z.string().min(10, "Content must be at least 10 characters"),
  pdfUrl: z.string().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function ArticleForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      title: initialData.title,
      slug: initialData.slug,
      category: initialData.category,
      language: initialData.language,
      bodyMarkdown: initialData.bodyMarkdown,
      pdfUrl: initialData.pdfUrl || "",
      isActive: initialData.isActive,
    } : {
      title: "",
      slug: "",
      category: "Family Law",
      language: "English",
      bodyMarkdown: "",
      pdfUrl: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      if (initialData) {
        await updateArticle(initialData.id, data);
      } else {
        await createArticle(data);
      }
      router.push("/dashboard/admin/articles");
    } catch (err: any) {
      setError(err.message || "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input {...register("title")} placeholder="E.g., Domestic Violence Act" />
          {errors.title && <p className="text-red-600 text-xs">{errors.title.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <Input {...register("slug")} placeholder="domestic-violence-act" />
          {errors.slug && <p className="text-red-600 text-xs">{errors.slug.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select {...register("category")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="Family Law">Family Law</option>
            <option value="Property Law">Property Law</option>
            <option value="Criminal Defense">Criminal Defense</option>
            <option value="NALSA/DLSA Schemes">NALSA/DLSA Schemes</option>
            <option value="Civil Rights">Civil Rights</option>
          </select>
          {errors.category && <p className="text-red-600 text-xs">{errors.category.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <select {...register("language")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
          </select>
          {errors.language && <p className="text-red-600 text-xs">{errors.language.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content (Markdown)</label>
        <Textarea {...register("bodyMarkdown")} className="min-h-[300px] font-mono text-sm" placeholder="## Introduction..." />
        {errors.bodyMarkdown && <p className="text-red-600 text-xs">{errors.bodyMarkdown.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">PDF URL (Optional)</label>
        <Input {...register("pdfUrl")} placeholder="/uploads/file.pdf" />
        {errors.pdfUrl && <p className="text-red-600 text-xs">{errors.pdfUrl.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" {...register("isActive")} className="rounded border-gray-300" />
        <label htmlFor="isActive" className="text-sm font-medium">Publish immediately</label>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin/articles")}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Article"}</Button>
      </div>
    </form>
  );
}
