import type { Metadata } from "next";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for The PE Passport travel guide and related services.",
  path: "/privacy",
  keywords: ["The PE Passport privacy policy"],
});

export const dynamic = "force-static";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark-gray dark:text-white mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-8">
          Last updated: February 14, 2026
        </p>

        <div className="space-y-8 text-gray-700 dark:text-slate-300 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">1. Overview</h2>
            <p>
              This Privacy Policy explains what personal information The GQ Passport collects,
              why we collect it, how we use it, and your rights. This site may be accessed from
              regions with privacy laws including POPIA (South Africa), GDPR (EU), and similar frameworks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Contact form data (for example: name, email, message, and related listing).</li>
              <li>Technical usage data (for example: IP address, browser/device data, and pages visited).</li>
              <li>Cookie-related data used for site functionality and performance.</li>
              <li>Donation-related records needed to confirm transactions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">3. Why We Use This Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To respond to enquiries sent through our forms.</li>
              <li>To operate, secure, and improve the website.</li>
              <li>To understand usage trends and improve user experience.</li>
              <li>To process or verify donations where applicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">4. Storage and Security</h2>
            <p>
              We use Supabase and other service providers to store and process data. We apply reasonable
              technical and organizational safeguards, but no internet transmission or online storage is ever
              completely risk-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">5. Sharing of Information</h2>
            <p className="mb-2">
              We do not sell personal information. We may share data only where needed with:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Infrastructure providers (for example, hosting/database services such as Supabase).</li>
              <li>Payment providers for donations.</li>
              <li>Analytics providers, where enabled.</li>
              <li>Authorities if legally required.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">6. Cookies and Analytics</h2>
            <p>
              This site may use cookies and analytics tools to support core functionality and measure usage.
              You can manage cookies through your browser settings. Disabling cookies may affect some features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">7. Your Rights</h2>
            <p className="mb-2">
              Depending on your location, you may have rights to access, correct, delete, or object to processing
              of your personal information.
            </p>
            <p>
              To request support regarding your data, contact us through the website contact form and include enough
              detail for us to verify and process your request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">8. Data Retention</h2>
            <p>
              We keep personal information only for as long as needed for the purposes listed above,
              or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark-gray dark:text-white mb-2">9. Policy Updates</h2>
            <p>
              We may update this Privacy Policy from time to time. Updates are posted on this page with a revised date.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
