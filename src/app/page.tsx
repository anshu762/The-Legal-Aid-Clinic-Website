"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, UserCheck, MessageCircle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/30 pt-24 pb-32">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl mx-auto space-y-6"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              <Scale className="mr-2 h-4 w-4" /> The Legal Aid Clinic
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              Justice should not depend on your <span className="text-primary">wallet.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with verified legal professionals for free guidance and consultations. We believe everyone deserves access to their rights.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/login?mode=register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                  Ask a Question <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/volunteers" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                  Find a Volunteer
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="pt-8 text-sm text-muted-foreground">
              Are you a legal professional? <Link href="/login?mode=register" className="text-primary hover:underline font-medium">Become a volunteer.</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold">500+</h3>
              <p className="text-primary-foreground/80 text-sm">Questions Answered</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold">120+</h3>
              <p className="text-primary-foreground/80 text-sm">Verified Volunteers</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold">100%</h3>
              <p className="text-primary-foreground/80 text-sm">Free Services</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold">24/7</h3>
              <p className="text-primary-foreground/80 text-sm">Access to Resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">How it works</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Getting the help you need is simple, secure, and always free.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: MessageCircle,
                title: "1. Ask or Book",
                desc: "Post a question anonymously on our forum or request a 1-on-1 consultation."
              },
              {
                icon: UserCheck,
                title: "2. Get Matched",
                desc: "We connect you with a verified legal volunteer who specializes in your issue."
              },
              {
                icon: BookOpen,
                title: "3. Get Help",
                desc: "Receive reliable guidance to understand your rights and next steps."
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-primary mb-6">
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-muted/30 border-t border-border/50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Trust & Privacy First
              </h2>
              <p className="text-lg text-muted-foreground">
                We understand that legal matters are sensitive. Our platform is built with your security in mind.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <UserCheck className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Verified Volunteers Only</h4>
                    <p className="text-sm text-muted-foreground">Every advisor must pass a strict credential verification process before they can answer questions or accept consultations.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <BookOpen className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Strictly Confidential</h4>
                    <p className="text-sm text-muted-foreground">Your contact information is never exposed publicly or shared without your explicit consent.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-border shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">"</div>
                    <div>
                      <p className="font-bold">Jane D.</p>
                      <p className="text-sm text-muted-foreground">Seeking Help</p>
                    </div>
                  </div>
                  <p className="text-lg italic text-foreground">
                    "I was overwhelmed by my eviction notice and couldn't afford a lawyer. Within 24 hours of posting on TLC, a verified volunteer explained my rights clearly. It gave me the confidence I needed."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
