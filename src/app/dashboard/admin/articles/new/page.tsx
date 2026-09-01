import { ArticleForm } from "../components/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold font-serif">Create New Article</h1>
      <div className="bg-background rounded-xl border border-border p-6">
        <ArticleForm />
      </div>
    </div>
  );
}
