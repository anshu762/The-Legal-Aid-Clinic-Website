import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FileText, Plus } from "lucide-react";

export default async function AdminArticlesPage() {
  const articles = await prisma.knowYourRightsArticle.findMany({
    orderBy: { title: 'asc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Articles Manager
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage content for the Know Your Rights section.</p>
        </div>
        <Link href="/dashboard/admin/articles/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Article
          </Button>
        </Link>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Language</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles.map(article => (
              <tr key={article.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{article.title}</td>
                <td className="px-4 py-3"><Badge variant="outline">{article.category}</Badge></td>
                <td className="px-4 py-3">{article.language}</td>
                <td className="px-4 py-3">
                  {article.isActive ? <Badge className="bg-green-600">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/dashboard/admin/articles/${article.id}/edit`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No articles found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
