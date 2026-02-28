import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { ScrollToTopButton } from "@/app/components/ScrollToTopButton";
import { JsonLd } from "@/app/components/JsonLd";
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
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_ZA",
    url: getSiteUrl(),
    images: [{ url: absoluteUrl("/favicon.ico") }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/favicon.ico")],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white dark:bg-slate-950">
        <JsonLd id="website-jsonld" data={createWebsiteJsonLd()} />
        <JsonLd id="organization-jsonld" data={createOrganizationJsonLd()} />
        {children}
        <ScrollToTopButton />
        <Analytics/>
      </body>
    </html>
  );
}
