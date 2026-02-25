import type { MetadataRoute } from "next";
import { blogAPI, categoriesAPI, listingsAPI } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/seo";
import type { Listing } from "@/lib/types";

export const revalidate = 3600;

function safeDate(value?: string | null) {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function hasStringSlug<T extends { slug?: string | null }>(item: T): item is T & { slug: string } {
  return typeof item.slug === "string" && item.slug.trim().length > 0;
}

function hasStringName<T extends { name?: string | null }>(item: T): item is T & { name: string } {
  return typeof item.name === "string" && item.name.trim().length > 0;
}

async function getAllListingsForSitemap(): Promise<Listing[]> {
  const pageSize = 200;
  const firstPage = await listingsAPI.getListingsPage(1, pageSize);
  const all = [...firstPage.data];

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const next = await listingsAPI.getListingsPage(page, pageSize);
    all.push(...next.data);
  }

  return all.filter((listing) => !!listing.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/explore"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/listings"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/events"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const [listings, posts, categories] = await Promise.all([
      getAllListingsForSitemap(),
      blogAPI.getPosts(1000),
      categoriesAPI.getCategories(),
    ]);

    routes.push(
      ...listings.map((listing) => ({
        url: absoluteUrl(`/listings/${listing.slug}`),
        lastModified: safeDate(listing.updated_at || listing.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    );

    routes.push(
      ...posts
        .filter(hasStringSlug)
        .map((post) => ({
          url: absoluteUrl(`/blog/${post.slug}`),
          lastModified: safeDate(post.updated_at ?? post.published_at ?? post.created_at),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
    );

    routes.push(
      ...categories
        .filter(hasStringName)
        .map((category) => ({
          url: absoluteUrl(`/categories/${encodeURIComponent(category.name)}`),
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
    );
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return routes;
}
