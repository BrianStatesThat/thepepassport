# 🛠️ SEO Implementation Guide - Ready-to-Use Code

This document contains **production-ready code** for implementing all HIGH and MEDIUM priority SEO fixes.

---

## 1. OPTIMIZED IMAGE COMPONENT

**File to create:** `app/components/OptimizedImage.tsx`

```typescript
import Image from "next/image";

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  title?: string;
  placeholderColor?: string;
}

/**
 * Optimized Image Component for SEO
 * 
 * Features:
 * - Uses Next.js Image for format optimization (WebP, AVIF)
 * - Prevents CLS with explicit width/height
 * - Responsive sizes for different viewports
 * - Quality optimization (75 by default)
 * - Automatic placeholder
 * 
 * Usage:
 * <OptimizedImage
 *   src="/path/to/image.jpg"
 *   alt="Descriptive alt text"
 *   width={400}
 *   height={300}
 *   priority={false}
 * />
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  title,
  placeholderColor = "#f3f4f6",
}: OptimizedImageProps) {
  // Fallback to placeholder if no image
  const imageSrc = src || "/placeholder.jpg";

  return (
    <Image
      src={imageSrc}
      alt={alt}
      title={title || alt}
      width={width}
      height={height}
      priority={priority}
      quality={75}
      className={className}
      // Responsive sizes: mobile, tablet, desktop
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      // Prevent layout shift
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
      // Blur placeholder for better perceived performance
      placeholder="blur"
      blurDataURL={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='${placeholderColor.replace(
        "#",
        "%23"
      )}' width='${width}' height='${height}'/%3E%3C/svg%3E`}
    />
  );
}
```

---

## 2. REFACTORED LISTING CARD COMPONENT

**File to update:** `app/components/ListingCard.tsx`

```typescript
import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { OptimizedImage } from "./OptimizedImage";

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const isFeatured = listing.featured || listing.is_featured;
  const displayTitle = listing.title || (listing as { name?: string }).name || "Untitled";
  
  // Enhanced alt text: descriptive and SEO-friendly
  const imageAlt = `${displayTitle} - ${
    listing.categories?.[0] || "attraction"
  } in Gqeberha, Port Elizabeth`;

  const priceIndicator = listing.price_range
    ? {
        $: "Budget",
        $$: "Moderate",
        $$$: "Upscale",
        $$$$: "Luxury",
      }[listing.price_range]
    : null;

  const cardContent = (
    <>
      {/* Image Container with Optimized Image */}
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        <OptimizedImage
          src={listing.featured_image}
          alt={imageAlt}
          title={displayTitle}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
        {isFeatured && (
          <div className="absolute top-3 right-3 bg-sunset-orange text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-800 rounded-full p-2">
          <MapPin className="w-5 h-5 text-pe-blue" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-2 line-clamp-2">
          {displayTitle}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">
          {listing.description}
        </p>

        <div className="mb-4 flex items-center gap-2">
          {listing.rating && (
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(listing.rating || 0)
                        ? "text-sunset-orange fill-sunset-orange"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-slate-400">
                {listing.review_count && `(${listing.review_count})`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2">
            {listing.categories.map((cat, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold text-pe-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
          {priceIndicator && (
            <span className="text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">
              {priceIndicator}
            </span>
          )}
        </div>
      </div>
    </>
  );

  const cardClasses =
    "group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer";

  // Render as link if slug available, otherwise as div
  if (listing.slug) {
    return (
      <Link
        href={`/listings/${listing.slug}`}
        className={cardClasses}
        title={`View ${displayTitle}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={cardClasses} role="button" tabIndex={0}>
      {cardContent}
    </div>
  );
}
```

---

## 3. REFACTORED BLOG CARD COMPONENT

**File to update:** `app/components/BlogCard.tsx`

```typescript
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { OptimizedImage } from "./OptimizedImage";

interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
}

export function BlogCard({ post, onClick }: BlogCardProps) {
  const imageAlt = `${post.title} - Travel guide for Gqeberha`;
  const publishDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const cardContent = (
    <article className="flex flex-col h-full">
      {/* Image Container */}
      <div className="h-40 bg-slate-200 overflow-hidden shrink-0">
        <OptimizedImage
          src={post.featured_image}
          alt={imageAlt}
          title={post.title}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-3 line-clamp-2 flex-1">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex gap-2 flex-wrap">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-pe-blue px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 border-t border-gray-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.published_at || ""}>
              {publishDate || "Date TBC"}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {post.reading_time
                ? typeof post.reading_time === "number"
                  ? `${post.reading_time} min`
                  : post.reading_time
                : ""}
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  // Render as link if slug available
  if (post.slug) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-gray-200 dark:border-slate-800"
        title={`Read: ${post.title}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-gray-200 dark:border-slate-800 cursor-pointer"
      role="button"
      tabIndex={0}
    >
      {cardContent}
    </div>
  );
}
```

---

## 4. REFACTORED DISCOVER SECTION COMPONENT

**File to update:** `app/components/DiscoverSection.tsx` (Key sections)

```typescript
// Update the map section in DiscoverSection.tsx

{displayListings.map((listing, idx) => {
  const image = listing.featured_image || listing.image;
  const category = listing.category || listing.categories?.[0] || "General";
  const showFeatured = listing.localTip || listing.featured || listing.is_featured;
  const displayTitle = listing.title || listing.name || "Untitled";
  const imageAlt = `${displayTitle} - ${category} in Gqeberha, Port Elizabeth`;
  const cardHref = listing.slug ? `/listings/${listing.slug}` : null;
  const cardClasses =
    "group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer block";

  const cardBody = (
    <>
      {/* Image Container - Updated */}
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        {image ? (
          <OptimizedImage
            src={image}
            alt={imageAlt}
            title={displayTitle}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-200 to-blue-300 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">No Image</span>
          </div>
        )}
        {showFeatured && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {listing.localTip ? "Local Tip" : "Featured"}
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-800 rounded-full p-2">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-2">
          {displayTitle}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
          {listing.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            {category}
          </span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return cardHref ? (
    <Link
      key={listing.id || `${displayTitle}-${idx}`}
      href={cardHref}
      className={cardClasses}
      title={`View ${displayTitle}`}
    >
      {cardBody}
    </Link>
  ) : (
    <div
      key={listing.id || `${displayTitle}-${idx}`}
      className={cardClasses}
      role="button"
      tabIndex={0}
    >
      {cardBody}
    </div>
  );
})}
```

**Add import at top:**
```typescript
import { OptimizedImage } from "./OptimizedImage";
```

---

## 5. UPDATE HERO COMPONENT

**File to update:** `app/components/Hero.tsx`

```typescript
"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface HeroProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function Hero({
  title = "Your Guide to Gqeberha's Hidden Gems",
  subtitle = "Explore the untouched beauty and vibrant culture of the Friendly City.",
  showSearch = true,
}: HeroProps) {
  return (
    <section className="relative min-h-[65vh] md:min-h-screen overflow-hidden">
      {/* Updated: Using Next.js Image with priority */}
      <Image
        src="/IMG_20260103_160311.jpg"
        alt="Gqeberha hero - Port Elizabeth coastal city views"
        title="Welcome to Gqeberha (Port Elizabeth)"
        fill
        priority
        quality={85}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 30%" }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/20 to-black/50" />

      <div className="relative min-h-[65vh] md:min-h-screen flex flex-col items-center justify-center px-4 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl drop-shadow-lg">
          {title}
        </h1>
        <p className="text-lg text-white mb-8 max-w-2xl drop-shadow-md">{subtitle}</p>

        {showSearch && <SearchBar />}
      </div>
    </section>
  );
}
```

**Key Changes:**
- Changed `<h2>` to `<h1>` (hero should be first heading)
- Using `Image` component with `fill` and `priority`
- Added descriptive alt text
- Removed explicit width/height (using `fill` for responsive)

---

## 6. SEARCH PAGE WITH METADATA

**File to update:** `app/search/page.tsx` (Add at top)

```typescript
import type { Metadata } from "next";

// Add this export at the top of the file, before the component
export const metadata: Metadata = {
  title: "Search | The PE Passport",
  description: "Search for attractions, restaurants, accommodations, and events in Gqeberha (Port Elizabeth).",
  robots: {
    index: false, // Don't index search results pages
    follow: true,
  },
};

// Rest of file continues...
```

---

## 7. ENHANCED SEO UTILITIES

**File to update:** `lib/seo.ts` (Add these functions at end)

```typescript
// Add these new schema generators to lib/seo.ts

/**
 * LocalBusiness Schema
 * Describes the main business for Google Knowledge Panel
 */
export function createLocalBusinessJsonLd() {
  return toJsonLd({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    alternateName: "PE Passport",
    description: SITE_DESCRIPTION,
    url: getSiteUrl(),
    image: absoluteUrl("/apple-icon"),
    // Add your actual contact info
    // telephone: "+27-41-XXX-XXXX",
    // email: "info@thepepassport.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gqeberha",
      addressRegion: "Eastern Cape",
      postalCode: "6000",
      addressCountry: "ZA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -33.9616,
      longitude: 25.6119,
    },
    sameAs: [
      // Add your social profiles
      // "https://www.facebook.com/thepepassport",
      // "https://www.instagram.com/thepepassport",
      // "https://www.twitter.com/thepepassport",
    ],
  });
}

/**
 * AggregateRating Schema
 * For listing ratings
 */
export function createAggregateRatingJsonLd(
  ratingValue: number,
  reviewCount: number,
  ratingMax: number = 5
) {
  return toJsonLd({
    "@type": "AggregateRating",
    ratingValue: Math.min(ratingValue, ratingMax),
    reviewCount,
    bestRating: ratingMax,
    worstRating: 1,
  });
}

/**
 * Person Schema
 * For blog authors
 */
export function createPersonJsonLd(
  name: string,
  url?: string
) {
  return toJsonLd({
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
  });
}

/**
 * ImageObject Schema
 * For proper image representation in JSON-LD
 */
export function createImageObjectJsonLd(
  url: string,
  width: number = 1200,
  height: number = 630,
  caption?: string
) {
  return toJsonLd({
    "@type": "ImageObject",
    url,
    width,
    height,
    ...(caption ? { caption } : {}),
  });
}

/**
 * FAQ Schema
 * If you have frequently asked questions
 */
export function createFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return toJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
}

/**
 * VideoObject Schema
 * If you have video content
 */
export function createVideoObjectJsonLd(
  name: string,
  description: string,
  thumbnailUrl: string,
  uploadDate: string,
  duration: string
) {
  return toJsonLd({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
  });
}

/**
 * Enhanced BlogPosting with Author
 * Use this in blog pages
 */
export function createEnhancedBlogPostingJsonLd(
  title: string,
  description: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  authorName: string = "The PE Passport",
  articleBody?: string
) {
  return toJsonLd({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: createImageObjectJsonLd(imageUrl),
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: authorName,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon"),
      },
    },
    ...(articleBody ? { articleBody } : {}),
  });
}

/**
 * PriceRange Schema
 * For restaurants with price indicators
 */
export function createPriceRangeJsonLd(priceRange: string): Record<string, unknown> {
  const priceMap: Record<string, string> = {
    $: "$",
    $$: "$$",
    $$$: "$$$",
    $$$$: "$$$$",
  };
  return {
    priceRange: priceMap[priceRange] || priceRange,
  };
}
```

---

## 8. UPDATE FOOTER LINKS

**File to update:** `app/components/Footer.tsx` (Fix the links section)

```typescript
{/* Quick Links - UPDATED */}
<div>
  <h4 className="font-bold text-dark-gray dark:text-white mb-4 text-sm md:text-base">
    Quick Links
  </h4>
  <ul className="space-y-2">
    <li>
      <Link
        href="/listings"
        className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition text-sm"
        title="View all listings"
      >
        Listings
      </Link>
    </li>
    <li>
      <Link
        href="/blog"
        className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition text-sm"
        title="Read travel tips and guides"
      >
        Blog
      </Link>
    </li>
    <li>
      <Link
        href="/events"
        className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition text-sm"
        title="View upcoming events"
      >
        Events
      </Link>
    </li>
    <li>
      <Link
        href="/explore"
        className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition text-sm"
        title="Plan your itinerary"
      >
        Explore
      </Link>
    </li>
  </ul>
</div>

{/* Social Links - UPDATED with real URLs (replace with actual for your project) */}
<div>
  <h4 className="font-bold text-dark-gray dark:text-white mb-4 text-sm md:text-base">
    Connect
  </h4>
  <div className="flex gap-3">
    <a
      href="https://facebook.com/thepepassport"
      title="Visit our Facebook"
      className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition shrink-0"
      rel="noopener noreferrer"
      target="_blank"
    >
      <Facebook className="w-5 h-5" />
    </a>
    <a
      href="https://twitter.com/thepepassport"
      title="Follow us on Twitter"
      className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition shrink-0"
      rel="noopener noreferrer"
      target="_blank"
    >
      <Twitter className="w-5 h-5" />
    </a>
    <a
      href="https://instagram.com/thepepassport"
      title="Follow us on Instagram"
      className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition shrink-0"
      rel="noopener noreferrer"
      target="_blank"
    >
      <Instagram className="w-5 h-5" />
    </a>
  </div>
</div>
```

---

## 9. UPDATE LAYOUT WITH VIEWPORT META

**File to update:** `app/layout.tsx` (Update metadata)

```typescript
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  // Add explicit viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
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
    images: [
      {
        url: absoluteUrl("/apple-icon"),
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/apple-icon")],
    // Add your Twitter handle when available
    // creator: "@thepepassport",
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
```

---

## IMPLEMENTATION CHECKLIST

```markdown
PHASE 1: Image Optimization (2-3 hours)
- [ ] Create OptimizedImage.tsx component
- [ ] Update ListingCard.tsx to use OptimizedImage
- [ ] Update BlogCard.tsx to use OptimizedImage
- [ ] Update DiscoverSection.tsx to use OptimizedImage
- [ ] Update Hero.tsx to use Next.js Image
- [ ] Test all components render correctly

PHASE 2: Metadata & Structured Data (2-3 hours)
- [ ] Add metadata to search/page.tsx
- [ ] Add new schema functions to lib/seo.ts
- [ ] Update layout.tsx with viewport meta
- [ ] Add LocalBusiness schema to layout.tsx
- [ ] Validate JSON-LD with Schema.org validator

PHASE 3: Internal Linking & Accessibility (1-2 hours)
- [ ] Fix Footer.tsx links (remove hash URLs)
- [ ] Add title attributes to links
- [ ] Test keyboard navigation
- [ ] Run Lighthouse audit

PHASE 4: Testing & Deployment (2-3 hours)
- [ ] Test on production build
- [ ] Validate with Google Search Console
- [ ] Test Twitter/OG cards
- [ ] Monitor Core Web Vitals
```

---

## TESTING COMMANDS

Run these after implementation:

```bash
# Build for production
npm run build

# Run Next.js in production mode
npm run start

# Run ESLint
npm run lint
```

**Tools to validate:**
1. [Schema.org Validator](https://validator.schema.org/)
2. [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
3. [Twitter Card Validator](https://cards-dev.twitter.com/validator)
4. [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## QUICK REFERENCE

| Issue | Fix | File | Priority |
|-------|-----|------|----------|
| No image alt text | Add OptimizedImage component | ListingCard.tsx, BlogCard.tsx, etc. | 🔴 HIGH |
| Image CLS + LCP issues | Use Next.js Image with width/height | Hero.tsx, all image components | 🔴 HIGH |
| Search page not indexed | Add metadata with robots.index: false | search/page.tsx | 🔴 HIGH |
| Footer hash URLs broken | Update to real routes | Footer.tsx | 🟠 MEDIUM |
| Missing schemas | Add new schema functions | lib/seo.ts | 🟠 MEDIUM |
| No viewport meta | Add viewport in metadata | layout.tsx | 🟡 LOW |

---

**Created:** March 25, 2026  
**Last Updated:** Ready for Implementation
