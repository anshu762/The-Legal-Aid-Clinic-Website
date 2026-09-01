"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="py-24 container max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Our Mission</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
          <p className="text-xl text-foreground font-medium">
            We believe that access to legal guidance is a fundamental right, not a luxury reserved for those who can afford it.
          </p>
          <p>
            The Legal Aid Clinic (TLC) was founded with a simple goal: bridge the gap between people facing legal challenges and qualified legal professionals willing to help for free. Every day, thousands of individuals struggle with eviction notices, workplace discrimination, or family law issues without knowing their basic rights.
          </p>
          <p>
            Our platform connects these individuals with verified volunteer lawyers who provide guidance, answer questions on our public forum, and offer private 1-on-1 video consultations—all entirely free of charge.
          </p>
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Why We Do This</h2>
          <p>
            The justice system can be overwhelmingly complex. Without proper guidance, vulnerable populations often lose their homes, livelihoods, or families simply because they didn't know what paperwork to file or what to say in court. By providing early intervention and basic legal education, we empower our users to navigate the system with confidence.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
