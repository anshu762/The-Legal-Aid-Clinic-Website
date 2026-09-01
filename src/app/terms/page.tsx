export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-muted-foreground">
        <h1 className="text-4xl font-extrabold text-foreground mb-8 font-serif">Terms of Use</h1>
        
        <p className="mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using The Legal Aid Clinic platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
            <p>
              The Legal Aid Clinic provides a platform to connect individuals seeking legal help with verified legal advisors. We provide tools for scheduling consultations and a forum for general legal questions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Strict No-Fee Policy</h2>
            <p>
              Our services are provided completely free of charge. You will never be asked for payment information on this platform. There are no paid tiers or premium features. If an advisor attempts to charge you for services rendered through this platform, please report them immediately using our Contact form.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. No Attorney-Client Relationship on Public Forums</h2>
            <p>
              Information provided on the public Q&A forum does not constitute formal legal advice and does not create an attorney-client relationship. An attorney-client relationship is only formed through direct, private consultation as agreed upon by both parties.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. User Conduct & Verification</h2>
            <p>
              Users agree to communicate respectfully. We reserve the right to suspend or terminate accounts that engage in abusive behavior, spam, or violation of these terms. Volunteer Legal Advisors must pass our internal verification process before answering questions or accepting consultations. No personal contact information (email/phone) should be shared publicly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
