"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Scale, MessageCircle, UserCheck, BookOpen, Shield, HelpCircle, FileText, Users, ChevronDown } from "lucide-react";
import { useState } from "react";

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger: any = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-background">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] opacity-20 bg-primary/10 blur-[100px] rounded-full mix-blend-multiply"></div>
        <div className="absolute left-0 bottom-0 -z-10 h-[500px] w-[500px] opacity-20 bg-accent/10 blur-[100px] rounded-full mix-blend-multiply"></div>
        
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto space-y-8">
            <motion.div variants={fadeUp} className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-2 shadow-sm border border-primary/20">
              <Scale className="mr-2 h-4 w-4" /> The Legal Aid Clinic
            </motion.div>
            
            {/* Reduced text size for better readability */}
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Justice should not depend on your <span className="text-primary relative inline-block">wallet.<motion.span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 rounded-sm" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.8, duration: 0.6 }}></motion.span></span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with verified legal professionals for free guidance, community Q&A, and private 1-on-1 consultations.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/login?mode=register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Get Free Legal Help <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/#volunteers" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 border-2">
                  Meet Our Volunteers
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS STRIP */}
      <section className="bg-muted/30 border-y border-border/50 py-16 relative z-10">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "500+", label: "Questions Answered" },
              { num: "120+", label: "Verified Volunteers" },
              { num: "100%", label: "Free Services" },
              { num: "24/7", label: "Access to Resources" }
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{stat.num}</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs md:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR MISSION */}
      <section id="mission" className="py-24 bg-background scroll-mt-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[400px] rounded-3xl overflow-hidden shadow-sm bg-primary border border-border">
              {/* Using a beautiful Unsplash image for Justice/Mission */}
              <img 
                src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80" 
                alt="Our Mission" 
                className="w-full h-full object-cover grayscale opacity-90"
              />
              <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">Our Mission</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Bridging the justice gap for everyone.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The legal system is complex and expensive. We created TLC to ensure that basic legal information and guidance are accessible to those who need it most, regardless of their financial situation.
              </p>
              <ul className="space-y-4">
                {[
                  "Free, anonymous public Q&A forum",
                  "1-on-1 private consultations with experts",
                  "Vetted and verified legal volunteers"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-foreground font-medium">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-muted/30 border-y border-border/50 scroll-mt-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">How it works</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">Getting the help you need is simple, secure, and always free.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: MessageCircle, title: "1. Ask or Book", desc: "Post a question anonymously on our forum or request a private 1-on-1 consultation session." },
              { icon: UserCheck, title: "2. Get Matched", desc: "We connect you with a verified legal volunteer who specializes in your specific issue." },
              { icon: BookOpen, title: "3. Get Help", desc: "Receive reliable guidance to understand your rights and determine your next steps." }
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-background p-8 rounded-3xl shadow-sm border border-border text-center space-y-6 relative group hover:shadow-md transition-all">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. KNOW YOUR RIGHTS */}
      <section id="know-your-rights" className="py-24 bg-background scroll-mt-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">Empower Yourself</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Know Your Rights</h2>
              <p className="text-muted-foreground mt-4 text-lg">Read our comprehensive, easy-to-understand guides on common legal issues.</p>
            </div>
            <Link href="/know-your-rights">
              <Button variant="outline" size="lg">Read All Articles <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Tenant Rights", desc: "Eviction notices, deposit returns, and dealing with landlords.", icon: FileText },
              { title: "Worker Rights", desc: "Unpaid wages, wrongful termination, and workplace safety.", icon: FileText },
              { title: "Family Law", desc: "Divorce proceedings, child custody, and domestic violence support.", icon: FileText }
            ].map((article, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href="/know-your-rights">
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer bg-muted/30 border-border">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-background text-primary shadow-sm border border-border">
                        <article.icon size={24} />
                      </div>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{article.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VOLUNTEERS */}
      <section id="volunteers" className="py-24 bg-muted/30 border-y border-border/50 scroll-mt-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Powered by Volunteers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Our community of verified legal professionals dedicate their time to provide guidance to those who need it.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
            {[1, 2, 3, 4].map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-background border-border text-foreground shadow-sm">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <Users size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold">Legal Advisor</h4>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/volunteers">
              <Button variant="outline" size="lg" className="border-2 text-foreground font-medium">
                View Volunteer Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-24 bg-background scroll-mt-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is this service really free?", a: "Yes. All features including forum questions and 1-on-1 consultations are 100% free. We never ask for payment information." },
              { q: "Will you represent me in court?", a: "No. Our volunteers provide legal information and guidance, not formal legal representation. You will still need to hire a lawyer if you go to court." },
              { q: "Is my information kept private?", a: "Absolutely. We do not share your contact details with volunteers until a consultation is confirmed, and you can post anonymously on the public forum." },
              { q: "Who are the volunteers?", a: "Our volunteers are practicing lawyers, law students, and legal professionals whose credentials have been manually verified by our admin team." }
            ].map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-border rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex justify-between items-center bg-muted/30 hover:bg-muted/50 transition-colors text-left font-semibold text-foreground text-lg"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-6 py-4 text-muted-foreground bg-background">
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-24 bg-muted/50 border-t border-border/50">
        <div className="container max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Whether you need help or want to give back to the community, join TLC today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link href="/login?mode=register">
              <Button size="lg" className="h-14 px-8 text-base w-full sm:w-auto shadow-md hover:-translate-y-1 transition-transform">
                I Need Legal Help
              </Button>
            </Link>
            <Link href="/volunteer-with-us">
              <Button variant="outline" size="lg" className="h-14 px-8 text-base w-full sm:w-auto hover:-translate-y-1 transition-transform border-2">
                I Want to Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
