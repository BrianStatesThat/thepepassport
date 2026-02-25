import type { Metadata } from "next";

export const SITE_NAME = "The PE Passport";
export const SITE_TITLE = "The PE Passport | Gqeberha & Port Elizabeth Travel Guide";
export const SITE_DESCRIPTION =
  "Explore Gqeberha (Port Elizabeth) with local listings, attractions, places to eat and stay, events, and practical travel tips from The PE Passport.";
export const DEFAULT_OG_IMAGE = "/favicon.ico";

const DEFAULT_SITE_URL = "http://localhost:3000";

function ensureUrlProtocol(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function cleanSiteUrl(value: string | undefined | null) {
  if (!value) return null;
  try {
    const parsed = new URL(ensureUrlProtocol(value.trim()));
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return (
    cleanSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
    ?? cleanSiteUrl(process.env.SITE_URL)
    ?? cleanSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
    ?? cleanSiteUrl(process.env.VERCEL_URL)
    ?? DEFAULT_SITE_URL
  );
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

type CanonicalParamValue = string | number | boolean | null | undefined;

export function canonicalUrl(
  path: string,
  params?: Record<string, CanonicalParamValue | CanonicalParamValue[]>
) {
  const url = new URL(path, `${getSiteUrl()}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value == null || value === "") continue;
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item == null || item === "") return;
          url.searchParams.append(key, String(item));
        });
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export function stripHtml(input: string | null | undefined) {
  if (!input) return "";
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function clampText(input: string | null | undefined, max = 160) {
  const value = (input ?? "").trim();
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 3)).trimEnd()}...`;
}

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean)
    )
  );
}

export const CORE_KEYWORDS = [
  "Gqeberha travel guide",
  "Port Elizabeth travel guide",
  "things to do in Gqeberha",
  "things to do in Port Elizabeth",
  "Gqeberha attractions",
  "Port Elizabeth restaurants",
  "Port Elizabeth accommodation",
  "Nelson Mandela Bay travel",
];

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string | null;
  images?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string | null;
  modifiedTime?: string | null;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  images = [],
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const canonical = canonicalUrl(path);
  const resolvedImages = uniqueStrings([image, ...images]).map((src) =>
    src.startsWith("http") ? src : absoluteUrl(src)
  );

  const finalImages = resolvedImages.length > 0 ? resolvedImages : [absoluteUrl(DEFAULT_OG_IMAGE)];

  return {
    title,
    description,
    keywords: uniqueStrings([...CORE_KEYWORDS, ...keywords]),
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          nocache: false,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
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
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_ZA",
      images: finalImages.map((url) => ({ url })),
      ...(publishedTime || modifiedTime
        ? {
            ...(type === "article"
              ? {
                  publishedTime: publishedTime ?? undefined,
                  modifiedTime: modifiedTime ?? undefined,
                }
              : {}),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: finalImages,
    },
  };
}

export function toJsonLd<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => {
      if (value === undefined) return undefined;
      return value;
    })
  ) as T;
}

export function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return toJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  });
}

export function createWebsiteJsonLd() {
  return toJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "The PE Passport Travel Guide",
    url: getSiteUrl(),
    description: SITE_DESCRIPTION,
    inLanguage: "en-ZA",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

export function createOrganizationJsonLd() {
  return toJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    sameAs: [],
  });
}
