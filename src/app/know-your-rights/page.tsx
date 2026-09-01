"use client";

import { motion } from "framer-motion";

const articles = [
  { id: 1, title: "Tenant Rights: Eviction Procedures", category: "Housing", language: "English", summary: "Learn about the legal steps landlords must take before eviction." },
  { id: 2, title: "Derechos del Inquilino", category: "Housing", language: "Spanish", summary: "Conozca los pasos legales que deben tomar los propietarios." },
  { id: 3, title: "Workplace Discrimination Guide", category: "Employment", language: "English", summary: "Identify and report discrimination at your workplace." },
  { id: 4, title: "Guía de Discriminación Laboral", category: "Employment", language: "Spanish", summary: "Identifique y reporte la discriminación en su lugar de trabajo." },
  { id: 5, title: "Understanding Child Custody", category: "Family", language: "English", summary: "Basic guide to how courts determine child custody arrangements." },
  { id: 6, title: "Domestic Violence: Protection Orders", category: "Family", language: "English", summary: "Steps to secure a protection order for your safety." },
];

export default function KnowYourRightsPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl font-serif">Know Your Rights</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">Empowering you with knowledge about your fundamental legal protections.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold cursor-pointer hover:bg-primary/20 transition-colors">All Categories</span>
          <span className="px-4 py-2 rounded-full bg-background text-muted-foreground border border-border text-sm font-semibold cursor-pointer hover:bg-muted transition-colors">Housing</span>
          <span className="px-4 py-2 rounded-full bg-background text-muted-foreground border border-border text-sm font-semibold cursor-pointer hover:bg-muted transition-colors">Employment</span>
          <span className="px-4 py-2 rounded-full bg-background text-muted-foreground border border-border text-sm font-semibold cursor-pointer hover:bg-muted transition-colors">Family</span>
          <span className="px-4 py-2 rounded-full bg-background text-muted-foreground border border-border text-sm font-semibold cursor-pointer hover:bg-muted transition-colors">English</span>
          <span className="px-4 py-2 rounded-full bg-background text-muted-foreground border border-border text-sm font-semibold cursor-pointer hover:bg-muted transition-colors">Spanish</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
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
                  <button className="text-primary font-medium hover:text-primary/80 transition-colors">Read full guide &rarr;</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
