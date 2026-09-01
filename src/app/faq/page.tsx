"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { question: "Who is eligible for free legal aid?", answer: "Our services are primarily aimed at low-income individuals and families who cannot afford private legal representation. Eligibility may depend on your specific legal issue and income level." },
  { question: "What types of cases do you handle?", answer: "We assist with civil matters including housing (evictions), family law (custody, protection orders), employment issues, and basic immigration queries. We do not handle criminal cases." },
  { question: "Is my information kept confidential?", answer: "Yes. All communications with our legal advisors are strictly confidential and protected by attorney-client privilege." },
  { question: "How long does it take to get matched with an advisor?", answer: "Typically, we aim to match you with a verified legal advisor within 2-3 business days, depending on availability and specialization required." },
  { question: "Are your advisors qualified attorneys?", answer: "Yes, all our legal volunteers go through a strict verification process to ensure they are licensed and in good standing before they can offer advice on the platform." }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-muted/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground font-serif">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about our services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div 
                key={index} 
                className="bg-background border border-border rounded-xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-muted/50 transition-colors"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-semibold text-foreground text-lg">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-primary transition-transform duration-300 ${isActive ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-4 pt-2 text-muted-foreground border-t border-border/50 bg-background">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
