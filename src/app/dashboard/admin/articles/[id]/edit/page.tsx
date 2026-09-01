import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArticleForm } from "../../components/ArticleForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.knowYourRightsArticle.findUnique({
    where: { id }
  });

  if (!article) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold font-serif">Edit Article</h1>
      <div className="bg-background rounded-xl border border-border p-6">
        <ArticleForm initialData={article} />
      </div>
    </div>
  );
}
