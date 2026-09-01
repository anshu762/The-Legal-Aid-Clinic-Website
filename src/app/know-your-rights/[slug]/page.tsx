import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArticleClientViewer } from "../components/ArticleClientViewer";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.knowYourRightsArticle.findUnique({
    where: { slug }
  });

  if (!article || !article.isActive) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/know-your-rights" className="text-sm text-primary hover:underline mb-8 inline-block">
          &larr; Back to all articles
        </Link>
        
        <div className="bg-background rounded-xl shadow-sm border border-border p-8 md:p-12">
          <div className="flex gap-2 mb-6">
            <Badge variant="outline">{article.category}</Badge>
            <Badge variant="secondary">{article.language}</Badge>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-foreground mb-4">
            {article.title}
          </h1>
          
          <div className="text-sm text-muted-foreground mb-12 border-b border-border pb-6 flex items-center justify-between">
            <div>
              Published on {article.publishedAt?.toLocaleDateString() || "Draft"}
            </div>
            {article.pdfUrl && (
              <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                Download PDF
              </a>
            )}
          </div>

          <ArticleClientViewer article={article} />
        </div>
      </div>
    </div>
  );
}
