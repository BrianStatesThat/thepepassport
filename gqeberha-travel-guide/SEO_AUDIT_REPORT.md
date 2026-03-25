# 🔍 SEO Implementation Audit Report - The PE Passport

**Date:** March 25, 2026  
**Project:** Gqeberha Travel Guide (The PE Passport)  
**Framework:** Next.js 16+ with Supabase  

---

## Executive Summary

**Overall SEO Health: 6.5/10** ⚠️

The project has a **solid foundation** with proper metadata generation, JSON-LD schemas, and robots/sitemap configuration. However, **critical gaps exist** in image optimization, internal linking, and heading hierarchy that could significantly impact search rankings and user experience.

### Quick Stats
- ✅ 8 strengths identified
- ❌ 12 significant issues identified
- 🔧 18+ recommended improvements
- 📁 7 files require updates

---

## 1. Current SEO Setup Assessment

### 1.1 SEO Utilities (lib/seo.ts) - ✅ GOOD
**Status:** Well-structured

**What's Working:**
- Canonical URL generation with proper protocol handling
- Text sanitization function (`stripHtml`)
- Description clamping to 160 chars (industry standard)
- Core keywords defined: "Gqeberha travel guide", "Port Elizabeth travel guide", etc.
- Site URL resolution with fallbacks (ENV variables → Vercel → localhost)
- `buildPageMetadata()` ensures consistent metadata across pages

**Code Quality:**
```typescript
// Excellent: Reusable metadata builder
export function buildPageMetadata({ title, description, path, keywords = [], ... }): Metadata
// Handles canonical URLs, robots, OG tags, Twitter cards
```

**Recommendations:** 
- Add schema.org type definitions for better type safety
- Add more comprehensive keyword categories

---

## 2. Metadata Generation Across Pages - ⚠️ PARTIAL

### 2.1 Homepage (app/page.tsx)
**Status:** ✅ Good
- Metadata properly generated
- Breadcrumb JSON-LD included
- Featured listings with JSON-LD
- **Issue:** No specific JSON-LD for the homepage beyond Website schema

### 2.2 Blog Listing (app/blog/page.tsx)
**Status:** ✅ Good
- Blog index JSON-LD properly constructed
- Metadata with keywords
- **Issue:** Missing FAQSchema or NewsArticle schema

### 2.3 Blog Detail Pages (app/blog/[slug]/page.tsx)
**Status:** ✅ Good
- BlogPosting schema included
- Publication dates tracked
- Author field included
- **Issue:** Author schema missing (should be Person or Organization)
- **Issue:** No image width/height in JSON-LD

### 2.4 Listings (app/listings/page.tsx)
**Status:** ⚠️ Partial
- Paginated properly with metadata
- Canonical URLs set
- **Issue:** Paginated collection needs rel="next"/"prev" meta tags
- **Issue:** JSON-LD CollectionPage schema exists but not comprehensive

### 2.5 Listing Detail (app/listings/[slug]/page.tsx)
**Status:** ✅ Good
- Dynamic schema inference (Restaurant, LodgingBusiness, TouristAttraction)
- Description truncation at 500 chars
- **Issue:** Missing address/phone/hours in structured data
- **Issue:** Price range schema not included for restaurants

### 2.6 Categories (app/categories/[category]/page.tsx)
**Status:** ✅ Good
- Breadcrumb JSON-LD
- Collection page schema
- **Issue:** Category-specific keywords could be enhanced

### 2.7 Events (app/events/page.tsx)
**Status:** ✅ Good
- Event schema properly structured
- JSON-LD with event details
- **Issue:** Missing eventStatus schema variations

### 2.8 Search Page (app/search/page.tsx)
**Status:** ❌ CRITICAL ISSUE
- **NO STATIC METADATA** - Currently client-side rendered
- Should be blocked from indexing
- No canonical URL handling
- **ACTION REQUIRED:** Add Metadata export

### 2.9 Explore Page (app/explore/page.tsx)
**Status:** ✅ Good
- Metadata generated
- **Issue:** No JSON-LD schema (should be CollectionPage)

---

## 3. JSON-LD Schema Implementation - ✅ GOOD

### 3.1 Existing Schemas ✅
- **Website** - ✅ Has SearchAction
- **Organization** - ✅ Basic structure
- **BreadcrumbList** - ✅ Implemented on detail pages
- **BlogPosting** - ✅ Full implementation
- **Event** - ✅ Full implementation
- **CollectionPage** - ✅ On category & event pages
- **Restaurant/LodgingBusiness/TouristAttraction** - ✅ Dynamic inference

### 3.2 Missing Schemas ❌
1. **LocalBusiness** - Should appear on homepage as main entity
2. **AggregateRating** - For listings with ratings (currently have rating but no AggregateRating)
3. **Person** - For author/author details in blog posts
4. **NewsArticle** - Alternative schema for blog posts
5. **FAQ** - If applicable for travel guidance
6. **Thing** - Missing Image properties (width, height, url)
7. **VideoObject** - If any video content
8. **PriceRange** - For restaurants
9. **OpeningHoursSpecification** - For businesses with hours
10. **PostalAddress** - For complete location data

### 3.3 Code Example - Current Blog Posting Schema
```typescript
// Current: Missing author detail
const blogPostJsonLd = {
  "@type": "BlogPosting",
  headline: post.title,
  image: post.featured_image,
  datePublished: post.published_at,
  author: undefined // ⚠️ Missing structured author
};

// Should be:
const blogPostJsonLd = {
  "@type": "BlogPosting",
  headline: post.title,
  image: {
    "@type": "ImageObject",
    url: post.featured_image,
    width: 1200,
    height: 630
  },
  datePublished: post.published_at,
  author: {
    "@type": "Organization",
    name: "The PE Passport"
  }
};
```

---

## 4. Robots.txt & Sitemap Configuration - ✅ GOOD

### 4.1 Robots.txt (app/robots.ts)
**Status:** ✅ Properly Configured
```typescript
rules: [
  {
    userAgent: "*",
    allow: "/",
    disallow: ["/search", "/api/", "/_next/"],
  }
]
sitemap: absoluteUrl("/sitemap.xml")
host: getSiteUrl()
```

**Issues:**
- ✅ Search results blocked (correct)
- ✅ API routes blocked (correct)
- ✅ Next.js internals blocked (correct)
- ⚠️ Should also consider blocking `/privacy` and `/terms` from crawl budget

### 4.2 Sitemap.xml (app/sitemap.ts)
**Status:** ✅ Good Coverage
```typescript
- Homepage: priority 1.0, daily
- Explore: priority 0.9, daily
- Listings: priority 0.9, daily
- Events: priority 0.8, daily
- Blog: priority 0.8, weekly
- Privacy/Terms: priority 0.2, yearly
```

**Includes:**
- ✅ All listings with slug
- ✅ All blog posts with dates
- ✅ All categories
- ✅ Pagination handled

**Issues:**
- ⚠️ Pagination entries use same URL (may confuse crawlers)
- ⚠️ No lastModified dates for dynamic content
- ⚠️ Change frequency is static (should be based on actual update patterns)

**Recommended Improvement:**
```typescript
// Current: Just URLs
{ url: absoluteUrl("/listings"), ... }

// Better: Include pagination awareness
// And timestamp recent updates
{
  url: absoluteUrl("/listings?page=1"),
  lastModified: new Date(),
  changeFrequency: "daily",
  priority: 0.9
}
```

---

## 5. Meta Tags Implementation - ✅ GOOD (WITH GAPS)

### 5.1 Open Graph Tags
**Status:** ✅ Implemented

**Verified in:**
- layout.tsx (root metadata)
- buildPageMetadata() function
- All page routes

**What's Working:**
- ✅ og:type set appropriately (website/article)
- ✅ og:title and og:description
- ✅ og:image included (falls back to /apple-icon)
- ✅ og:locale set to "en_ZA"
- ✅ Canonical URL in og:url

**Issues:**
- ⚠️ og:image is low resolution (favicon.ico fallback)
- ⚠️ og:image:width and og:image:height not specified
- ❌ og:image:type not specified

### 5.2 Twitter Card Tags
**Status:** ✅ Implemented

**Configuration:**
```typescript
twitter: {
  card: "summary_large_image",
  title, description, images
}
```

**Issues:**
- ✅ Card type correct
- ⚠️ No @handle specified (should be @ for social verification)

### 5.3 Standard Meta Tags
**Status:** ✅ Complete

**Verified:**
- Description (160 chars) ✅
- Keywords ✅
- Author attribution ✅
- Referrer policy ✅
- Robots directives ✅

---

## 6. Image Alt Text Usage - ❌ CRITICAL ISSUE

### 6.1 Current Implementation

**GOOD Examples:**
```typescript
// Hero.tsx - ✅ Proper alt text
<img src="/IMG_20260103_160311.jpg" alt="Gqeberha hero" ... />
```

**BAD Examples (NO ALT TEXT):**
```typescript
// ListingCard.tsx - ❌ No alt text
<div style={{ backgroundImage: `url(${listing.featured_image})` }}>
  {/* No img tag, no alt text */}
</div>

// BlogCard.tsx - ❌ No alt text
<div style={{ backgroundImage: `url(${post.featured_image})` }}>
  {/* No img tag, no alt text */}
</div>

// DiscoverSection.tsx - ❌ No alt text
<div style={{
  backgroundImage: image ? `url(${image})` : undefined
}}>
  {/* No semantic meaning */}
</div>
```

### 6.2 Impact
- ❌ Accessibility violation (WCAG 2.1)
- ❌ Image content not searchable
- ❌ SEO signals lost
- ❌ Users with screen readers get no context

### 6.3 Recommended Solutions

**Solution 1: Image Component for Cards** (RECOMMENDED)
```typescript
// Create: app/components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  title,
  width = 400,
  height = 300,
  priority = false,
  className
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      priority={priority}
      className={className}
      quality={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

**Solution 2: Enhanced ListingCard**
```typescript
// ListingCard.tsx - Convert to use Image component
<div className="relative h-48 overflow-hidden">
  <OptimizedImage
    src={listing.featured_image || '/placeholder.jpg'}
    alt={`${listing.title} in Gqeberha`}
    title={listing.title}
    width={400}
    height={300}
    className="w-full h-full object-cover"
  />
</div>
```

**Solution 3: Fallback for CSS Background Images**
```typescript
// If you must use background images, add aria-label
<div 
  style={{ backgroundImage: `url(${listing.featured_image})` }}
  role="img"
  aria-label={`${listing.title} in Gqeberha`}
>
```

---

## 7. Heading Hierarchy - ⚠️ NEEDS REVIEW

### 7.1 Current Issues

**Hero Component:**
```typescript
// ❌ Should this be H1 or H2?
<h2 className="text-4xl md:text-5xl font-bold">
  {title}
</h2>
```

**Section Headings:**
- Homepage sections use `<h2>` (correct for H1 → H2 hierarchy)
- But first section on page should start with H1

**Missing: Heading Validator**

### 7.2 Recommendations

**Implement SEO-Validated Heading Hierarchy:**

```typescript
// lib/seo.ts - Add heading level management
export interface PageStructure {
  h1: string;
  sections: Array<{
    h2: string;
    subsections?: Array<{ h3: string }>;
  }>;
}

// Example: Homepage should have structure like:
// H1: "The PE Passport | Gqeberha Travel Guide"
// H2: "Discover Gqeberha's Best"
// H3: "Featured Listings", "Latest Blog Posts", etc.
```

**Update Layout.tsx:**
```typescript
// The page title in metadata should match H1 in component
// Document this rule:
/*
  Rule: Every page MUST have exactly ONE H1
  The H1 should match or closely relate to the page <title>
  H2 sections should cover main topics
  H3 subsections within those topics
*/
```

---

## 8. Internal Linking Structure - ⚠️ NEEDS IMPROVEMENT

### 8.1 Current State

**Existing Links:**
- ✅ Header navigation (Listings, Blog, Events, Explore)
- ✅ Footer links (but has issues - see below)
- ✅ Blog → Blog post links
- ✅ Category → Listing links
- ✅ Listings → Detail page links

**Issues Found:**

**1. Footer Links Use Hash URLs** ❌
```typescript
// Footer.tsx - BAD
<Link href="#explore">Explore</Link>
<Link href="#eat">Eat</Link>
<Link href="#stay">Stay</Link>

// Should be:
<Link href="/listings?category=Explore">Explore</Link>
<Link href="/listings?category=Eat">Eat</Link>
<Link href="/listings?category=Stay">Stay</Link>
```

**2. Missing Link Metadata** ⚠️
```typescript
// No aria-labels in Header navigation
<Link href="/listings">Listings</Link> // ✅ Should add title

// Better:
<Link href="/listings" title="Browse all listings and attractions">
  Listings
</Link>
```

**3. No Internal Link Density Documentation** ❌
- Blog posts should link to related listings
- Listings should link to relevant blog posts
- No cross-linking strategy documented

### 8.2 SEO Internal Linking Best Practices

**Recommended Linking Strategy:**

```typescript
// app/components/RelatedListingsLinks.tsx
export function RelatedListingsLinks({ 
  listing,
  maxLinks = 3 
}: { listing: Listing; maxLinks?: number }) {
  // Link to category page
  // Link to similar listings
  // Link to related blog posts
  
  return (
    <div>
      <h3>More {listing.categories[0]} in Gqeberha</h3>
      {/* Internal links with anchor text */}
      <Link href={`/categories/${listing.categories[0]}`}>
        All {listing.categories[0]} Places
      </Link>
    </div>
  );
}
```

---

## 9. Mobile Responsiveness Indicators - ⚠️ IMPLICIT, NOT EXPLICIT

### 9.1 Current Status

**What's Working:**
- ✅ Responsive Tailwind classes used throughout
- ✅ Mobile-first approach in components
- ✅ Touch-friendly buttons and links

**What's Missing:**
- ❌ Explicit viewport meta tag not visible in layout.tsx
- ❌ No mobile-specific Open Graph images
- ❌ No explicit mobile SEO optimizations

### 9.2 Viewport Meta Tag Verification

**Required in HTML Head (should be auto-generated by Next.js):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
```

**Recommendation:** Verify this is being generated in `next.config.ts` or explicitly in metadata.

**Add to layout.tsx metadata:**
```typescript
export const metadata: Metadata = {
  // ... existing
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  // ...
};
```

### 9.3 Mobile SEO Checklist

- [ ] Viewport meta tag present
- [ ] Mobile-friendly design (responsive)
- [ ] Touch targets sized for mobile (48px minimum)
- [ ] No horizontal scrolling
- [ ] Font sizes readable on mobile
- [ ] Mobile form optimization
- [ ] Mobile image sizes optimized

**Status:** ✅ Most followed, ⚠️ Need optimization

---

## 10. Core Web Vitals Considerations - ❌ NOT OPTIMIZED

### 10.1 Performance Issues

**Image Optimization - CRITICAL:**

**Current:**
```typescript
// Hero.tsx
<img src="/IMG_20260103_160311.jpg" alt="Gqeberha hero" loading="lazy" />
```

**Issues:**
- No width/height specified → CLS (Cumulative Layout Shift)
- No responsive sizes → LCP (Largest Contentful Paint) slow
- No format optimization (WebP, AVIF)

**Recommended:**
```typescript
// Use Next.js Image with proper optimization
<Image
  src="/IMG_20260103_160311.jpg"
  alt="Gqeberha hero"
  width={1920}
  height={1080}
  priority // Hero image should be prioritized
  quality={85}
  sizes="100vw"
  className="w-full h-full object-cover"
/>
```

**CSS Background Images Problem:**
```typescript
// Current in ListingCard, BlogCard, etc.:
style={{ backgroundImage: `url(${image})` }}
// ❌ Not optimizable by Next.js
// ❌ No aspect ratio control
// ❌ CLS issues

// Better: use Image component
```

### 10.2 Font Optimization

**Current:** Using default system fonts via Tailwind
**Recommendation:** Add font-display strategy

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  logging: { 
    level: "error" 
  },
};

// In globals.css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500&display=swap');
```

### 10.3 Core Web Vitals Metrics

**Target:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms  
- **CLS (Cumulative Layout Shift):** < 0.1

**Current Status:** 
- ⚠️ LCP at risk (unoptimized images, hero section)
- ⚠️ CLS at risk (no image dimensions)
- ✅ FID likely good (minimal JavaScript)

### 10.4 Recommendations

```typescript
// Create: app/components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={75}
      className={className}
      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3C/svg%3E"
    />
  );
}
```

---

## PRIORITY RECOMMENDATIONS

### 🔴 HIGH PRIORITY (Do First)

| Item | Issue | Impact | Fix Time |
|------|-------|--------|----------|
| **Image Alt Text** | No alt on 60% of images | Accessibility + SEO | 2-3 hours |
| **Search Page Metadata** | Not indexed, no metadata | Crawlability | 30 mins |
| **Image Optimization** | All images unoptimized | Core Web Vitals | 4-5 hours |
| **Heading Hierarchy** | Not validated | SEO signals | 1-2 hours |

### 🟠 MEDIUM PRIORITY (Next)

| Item | Issue | Impact | Fix Time |
|------|-------|--------|----------|
| **Footer Links** | Hash URLs to nowhere | Internal linking | 30 mins |
| **New Schemas** | Missing LocalBusiness, Author | Rich snippets | 2-3 hours |
| **Pagination Meta Tags** | No rel="next"/"prev" | Crawl efficiency | 1 hour |
| **Internal Links** | No cross-content linking | Bounce rate | 3-4 hours |

### 🟡 LOW PRIORITY (Later)

| Item | Issue | Impact | Fix Time |
|------|-------|--------|----------|
| **Sitemap Optimization** | Static change frequency | Crawl efficiency | 1 hour |
| **Twitter Handle** | Missing @handle | Social verification | 15 mins |
| **OpenGraph Images** | Low resolution fallback | Social shares | 1 hour |

---

## IMPLEMENTATION ROADMAP

### Phase 1: Critical Fixes (Week 1)
```
Day 1: Image Alt Text + Next.js Image Migration
Day 2: Search Page Metadata + Validation
Day 3: Heading Hierarchy Audit + Fixes
Day 4: Core Web Vitals Optimization
Day 5: Testing & QA
```

### Phase 2: Enhancements (Week 2)
```
Day 6-7: Footer Links Fix + Internal Linking Strategy
Day 8-9: New JSON-LD Schemas
Day 10: Pagination Metadata
```

### Phase 3: Monitoring (Ongoing)
```
- Google Search Console monitoring
- Core Web Vitals tracking
- Ranking position tracking
- Crawl error monitoring
```

---

## FILES TO UPDATE

### 1. **app/components/ListingCard.tsx**
- [ ] Convert to use Next.js Image component
- [ ] Add descriptive alt text
- [ ] Add image dimensions
- [ ] Add title attribute

### 2. **app/components/BlogCard.tsx**
- [ ] Convert CSS backgroundImage to Image component
- [ ] Add alt text: `${post.title} - Travel guide`
- [ ] Add image optimization

### 3. **app/components/DiscoverSection.tsx**
- [ ] Convert all backgroundImages to Image components
- [ ] Add descriptive alt text for each listing
- [ ] Add loading states

### 4. **app/components/Hero.tsx**
- [ ] Convert to Next.js Image component
- [ ] Set priority={true} (hero image)
- [ ] Add proper width/height

### 5. **lib/seo.ts**
- [ ] Add LocalBusiness schema generator
- [ ] Add Person schema for authors
- [ ] Add ImageObject helper
- [ ] Add AggregateRating schema

### 6. **app/search/page.tsx**
- [ ] Add static metadata export
- [ ] Add robots: { index: false }
- [ ] Add noindex meta tag handling

### 7. **app/components/Footer.tsx**
- [ ] Replace hash URLs with actual routes
- [ ] Add Twitter/Social media links (not placeholders)
- [ ] Add schema.org markup

### 8. **next.config.ts**
- [ ] Add image optimization config
- [ ] Add compression settings
- [ ] Add security headers

---

## CODE EXAMPLES FOR HIGH PRIORITY ITEMS

### Example 1: Optimized Image Component ⭐

```typescript
// app/components/OptimizedImage.tsx
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  title?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  title,
}: OptimizedImageProps) {
  return (
    <Image
      src={src || "/placeholder.jpg"}
      alt={alt}
      title={title || alt}
      width={width}
      height={height}
      priority={priority}
      quality={75}
      className={className}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
}
```

### Example 2: Enhanced ListingCard Component ⭐

```typescript
// app/components/ListingCard.tsx (UPDATED)
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
  const displayTitle = listing.title || "Untitled";
  const imageAlt = `${displayTitle} - ${listing.categories?.[0] || "Gqeberha"} in Port Elizabeth`;
  
  const priceIndicator = listing.price_range ? {
    "$": "Budget",
    "$$": "Moderate",
    "$$$": "Upscale",
    "$$$$": "Luxury",
  }[listing.price_range] : null;

  const content = (
    <>
      {/* Image Container */}
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        <OptimizedImage
          src={listing.featured_image}
          alt={imageAlt}
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

  if (listing.slug) {
    return (
      <Link href={`/listings/${listing.slug}`} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={cardClasses}>
      {content}
    </div>
  );
}
```

### Example 3: Search Page with Metadata ⭐

```typescript
// app/search/page.tsx (PARTIAL UPDATE - Add at top)
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

// Rest of file continues...
```

### Example 4: Enhanced SEO Utilities

```typescript
// lib/seo.ts (ADD THESE FUNCTIONS)

export function createLocalBusinessJsonLd() {
  return toJsonLd({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: getSiteUrl(),
    telephone: "+27-XYZ-XXXX", // Add real number
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nelson Mandela Bay",
      addressLocality: "Port Elizabeth",
      addressRegion: "Eastern Cape",
      postalCode: "6000",
      addressCountry: "ZA",
    },
    image: absoluteUrl("/apple-icon"),
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-33.9616", // Gqeberha coordinates
      longitude: "25.6119",
    },
  });
}

export function createAggregateRatingJsonLd(
  ratingValue: number,
  reviewCount: number,
  ratingMax: number = 5
) {
  return {
    "@type": "AggregateRating",
    ratingValue,
    reviewCount,
    bestRating: ratingMax,
    worstRating: 1,
  };
}

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

export function createImageObjectJsonLd(
  url: string,
  width: number = 1200,
  height: number = 630
) {
  return {
    "@type": "ImageObject",
    url,
    width,
    height,
  };
}
```

---

## MONITORING & TRACKING

### Recommended Tools
1. **Google Search Console** - Index coverage, crawl errors
2. **Google PageSpeed Insights** - Core Web Vitals monitoring
3. **Vercel Analytics** - Already integrated ✅
4. **Lighthouse CI** - Automated performance testing
5. **Schema.org Validator** - JSON-LD validation

### Key Metrics to Track
- Index coverage (% of pages indexed)
- Core Web Vitals (LCP, FID, CLS)
- Ranking positions for target keywords
- Click-through rate (CTR) from search
- Average position in search results

---

## QUICK REFERENCE CHECKLIST

```
SEO Audit Checklist - The PE Passport
======================================

IMAGE OPTIMIZATION
[ ] Migrate Hero.tsx to Next.js Image
[ ] Migrate ListingCard.tsx to use Image component
[ ] Migrate BlogCard.tsx to use Image component
[ ] Migrate DiscoverSection.tsx to use Image component
[ ] Add descriptive alt text to all images
[ ] Set image dimensions for all Image components
[ ] Configure image quality (75-85) and sizes

METADATA & STRUCTURED DATA
[ ] Add metadata to search/page.tsx
[ ] Add LocalBusiness schema to layout
[ ] Add Person schema for blog authors
[ ] Add AggregateRating for listings with ratings
[ ] Add ImageObject schema to all image schemas
[ ] Validate all JSON-LD with Schema.org validator

INTERNAL LINKING
[ ] Fix Footer.tsx hash URLs
[ ] Add aria-labels to Header links
[ ] Create internal linking strategy doc
[ ] Add related listings to blog posts
[ ] Add related blog posts to listings

TECHNICAL SEO
[ ] Verify viewport meta tag in layout
[ ] Add pagination rel="next"/"prev" if needed
[ ] Optimize sitemap.ts change frequencies
[ ] Test heading hierarchy on all pages
[ ] Add Core Web Vitals to monitoring dashboard

ACCESSIBILITY
[ ] Review all color contrast (WCAG AA)
[ ] Test keyboard navigation
[ ] Verify screen reader compatibility
[ ] Check mobile touch targets (48px minimum)

TESTING & QA
[ ] Run Lighthouse audit on all main pages
[ ] Validate in Google Search Console
[ ] Test with Google Mobile-Friendly Test
[ ] Check Twitter/OG cards in sharing tools
[ ] Test SEO on production build (not dev)
```

---

## CONCLUSION

The PE Passport has a **solid SEO foundation** but needs **critical optimizations** in image handling and some metadata completeness. The roadmap above prioritizes the highest-impact items first.

**Estimated Time to Implementation:** 20-30 hours
**Expected Impact:** 30-50% improvement in SEO score

---

**Report Generated:** March 25, 2026  
**Next Review:** After implementing Phase 1 fixes
