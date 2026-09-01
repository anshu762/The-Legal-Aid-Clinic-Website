import { prisma } from "@/lib/prisma";
import { ArticleList } from "./components/ArticleList";

export default async function KnowYourRightsPage() {
  const articlesRaw = await prisma.knowYourRightsArticle.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: 'desc' },
  });

  const categories = Array.from(new Set(articlesRaw.map(a => a.category))).sort();
  const languages = Array.from(new Set(articlesRaw.map(a => a.language))).sort();

  const articles = articlesRaw.map(a => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    language: a.language,
    summary: a.bodyMarkdown.substring(0, 150) + "...", // basic summary
  }));

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl font-serif">Know Your Rights</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">Empowering you with knowledge about your fundamental legal protections.</p>
        </div>

        <ArticleList articles={articles} categories={categories} languages={languages} />
      </div>
    </div>
  );
}
