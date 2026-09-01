import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 md:py-12 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-sm">
          <Link href="/" className="font-serif text-2xl font-bold text-primary mb-4 block">
            TLC.
          </Link>
          <p className="text-sm text-muted-foreground">
            Connecting people who need legal help with verified volunteer lawyers via public Q&A and private consultations.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-foreground mb-2">Legal</h4>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-foreground mb-2">Support</h4>
          <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact / Report Concern</Link>
        </div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 mt-8 pt-8 border-t border-border/50 text-center">
        <p className="text-xs md:text-sm font-medium text-foreground p-3 bg-muted rounded-md inline-block">
          Legal Disclaimer: This is legal information, not formal legal representation.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} The Legal Aid Clinic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
