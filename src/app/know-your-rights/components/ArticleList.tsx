"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  language: string;
  summary: string;
}

export function ArticleList({ articles, categories, languages }: { articles: Article[], categories: string[], languages: string[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All Categories");
  const [activeLanguage, setActiveLanguage] = useState<string>("All Languages");

  const filteredArticles = articles.filter(article => {
    const categoryMatch = activeCategory === "All Categories" || article.category === activeCategory;
    const languageMatch = activeLanguage === "All Languages" || article.language === activeLanguage;
    return categoryMatch && languageMatch;
  });

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {["All Categories", ...categories].map(cat => (
          <span 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors ${activeCategory === cat ? 'bg-primary/10 text-primary' : 'bg-background text-muted-foreground border border-border hover:bg-muted'}`}
          >
            {cat}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {["All Languages", ...languages].map(lang => (
          <span 
            key={lang}
            onClick={() => setActiveLanguage(lang)}
            className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors ${activeLanguage === lang ? 'bg-accent/10 text-accent' : 'bg-background text-muted-foreground border border-border hover:bg-muted'}`}
          >
            {lang}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-border"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{article.category}</span>
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">{article.language}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{article.title}</h3>
              <p className="text-muted-foreground flex-grow mb-4">{article.summary}</p>
              <div>
                <Link href={`/know-your-rights/${article.slug}`} className="text-primary font-medium hover:text-primary/80 transition-colors">
                  Read full guide &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredArticles.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No articles found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
