import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { DiscoverSection } from "@/app/components/DiscoverSection";
import { CategoryNavigation } from "@/app/components/CategoryNavigation";
import { BlogSection } from "@/app/components/BlogSection";
import { Footer } from "@/app/components/Footer";
import { listingsAPI, blogAPI } from "@/lib/supabase";
import type { Listing, BlogPost, FeaturedListing } from "@/lib/types";

export default async function HomePage() {
  // Fetch data from Supabase
  let listings: FeaturedListing[] = [];
  let blogPosts: BlogPost[] = [];
  let error: unknown = null;

  try {
    const [listingsData, postsData] = await Promise.all([
      listingsAPI.getFeaturedListings(6),
      blogAPI.getPosts(3),
    ]);
    listings = ((listingsData as any[]) || []).map((l: any) => ({
      ...l,
      // ensure id is a number
      id: typeof l.id === "string" ? parseInt(l.id, 10) || 0 : (l.id ?? 0),
      category: l.category ?? (Array.isArray(l.categories) ? l.categories[0] ?? "general" : "general"),
    })) as FeaturedListing[];

    blogPosts = (((postsData as any[]) || []).map((p: any) => ({
      ...p,
      // ensure id is a number
      id: typeof p.id === "string" ? parseInt(p.id, 10) || 0 : (p.id ?? 0),
      date: p.date ?? p.published_at ?? new Date().toISOString(),
      readTime: p.readTime ?? (p.reading_time ? `${p.reading_time} min` : "1 min"),
    })) as BlogPost[]);
  } catch (err) {
    console.error("Error fetching data:", err);
    error = err;
    // Components will use default mock data if fetch fails
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <Hero />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DiscoverSection listings={listings} />
        <CategoryNavigation />
        <BlogSection posts={blogPosts} />
      </main>

      <Footer />
    </div>
  );
}
