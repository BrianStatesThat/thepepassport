import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { cookies } from "next/headers";
import { ScrollToTopButton } from "@/app/components/ScrollToTopButton";
import { JsonLd } from "@/app/components/JsonLd";
import { CookieConsentGate } from "@/app/components/CookieConsentGate";
import {
  CORE_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  absoluteUrl,
  createOrganizationJsonLd,
  createWebsiteJsonLd,
  getSiteUrl,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_TITLE,
    template: "%s | The PE Passport",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: CORE_KEYWORDS,
  authors: [{ name: "The PE Passport" }],
  creator: "The PE Passport",
  publisher: "The PE Passport",
  alternates: {
    canonical: "/",
  },
  category: "travel",
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    shortcut: ["/icon"],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_ZA",
    url: getSiteUrl(),
    images: [{ url: absoluteUrl("/apple-icon") }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/apple-icon")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieConsent = cookieStore.get("pepassport-cookie-consent")?.value;
  const initialConsent =
    cookieConsent === "accepted" || cookieConsent === "rejected" ? cookieConsent : "unknown";

  return (
    <html lang="en">
      <body className="antialiased bg-white dark:bg-slate-950">
        <JsonLd id="website-jsonld" data={createWebsiteJsonLd()} />
        <JsonLd id="organization-jsonld" data={createOrganizationJsonLd()} />
        {children}
        <ScrollToTopButton />
        <CookieConsentGate initialConsent={initialConsent} />
        <Analytics/>
      </body>
    </html>
  );
}
