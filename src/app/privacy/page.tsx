export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-muted-foreground">
        <h1 className="text-4xl font-extrabold text-foreground mb-8 font-serif">Privacy Policy</h1>
        
        <p className="mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p>
              At The Legal Aid Clinic, we take your privacy very seriously. We collect minimal personal information required to facilitate matching you with a legal advisor. We do not expose emails or phone numbers to the public, nor do we expose them to verified volunteers until a consultation match is confirmed by an admin.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>
              Your information is used strictly to provide you with legal assistance and to improve our platform. We never sell or share your personal data with third parties for marketing purposes. Payments are not processed on this platform, and we will never ask for your credit card information.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Security</h2>
            <p>
              We implement strong security measures to ensure your data is protected. All consultations are strictly confidential and protected by attorney-client privilege where applicable. We use industry-standard encryption for data at rest and in transit. Moderation data and verification history are soft-deleted and archived for audit trails.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Anonymity</h2>
            <p>
              When participating in community forums, you have the option to post anonymously to further protect your identity from the public. We encourage you not to share sensitive personal details (like SSN, account numbers, etc.) in public forums.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please reach out to us via our Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
