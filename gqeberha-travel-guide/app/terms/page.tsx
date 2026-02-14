import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark-gray dark:text-white mb-3">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-8">
          Last updated: February 14, 2026
        </p>

        <div className="space-y-8 text-gray-700 dark:text-slate-300 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By using this website, you agree to these Terms &amp; Conditions. If you do not agree,
              please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">2. Informational Use Only</h2>
            <p>
              Content on this site is provided for general travel guidance. While we aim for accuracy,
              we do not guarantee that all listing details, pricing, availability, or operating hours
              are complete, current, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">3. Listings and Third Parties</h2>
            <p>
              Listings may reference third-party businesses and services. We are not responsible for
              third-party actions, service quality, closures, booking outcomes, or pricing changes.
              Users should verify important details directly with the business.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">4. Donations</h2>
            <p>
              Donations are voluntary contributions to support the website. Unless required by law,
              donations are treated as final and non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">5. Acceptable Use</h2>
            <p className="mb-2">You agree not to misuse the site, including by:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Attempting unauthorized access to systems or data.</li>
              <li>Submitting malicious, fraudulent, or unlawful content.</li>
              <li>Interfering with normal site operation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">6. Intellectual Property</h2>
            <p>
              Website content, branding, and original materials are protected by applicable intellectual
              property laws. You may not copy, republish, or redistribute content without permission,
              except where law explicitly allows.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, The GQ Passport is not liable for losses or damages
              resulting from use of this website, reliance on listing information, or third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">8. Changes to Terms</h2>
            <p>
              We may update these Terms &amp; Conditions at any time. Updated terms will be posted on this page
              with a revised date.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

