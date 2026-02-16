import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { DiscoverSection } from "@/app/components/DiscoverSection";
import { CategoryNavigation } from "@/app/components/CategoryNavigation";
import { EventsSection } from "@/app/components/EventsSection";
import { BlogSection } from "@/app/components/BlogSection";
import { Footer } from "@/app/components/Footer";
import { listingsAPI, blogAPI } from "@/lib/supabase";
import { demoEvents, getUpcomingEvents } from "@/lib/demo/events";
import type { Listing, BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch data from Supabase
  let listings: Listing[] = [];
  let blogPosts: BlogPost[] = [];

  type BlogRow = Partial<BlogPost> & {
    id?: string | number;
    published_at?: string;
    date?: string;
    readTime?: string;
    reading_time?: number | string;
  };

  try {
    const [listingsData, postsData] = await Promise.all([
      listingsAPI.getFeaturedListings(6),
      blogAPI.getPosts(3),
    ]);
    listings = (listingsData as Listing[]) || [];

    blogPosts = (((postsData as BlogRow[]) || []).map((p) => ({
      ...p,
      // ensure id is a number
      id: typeof p.id === "string" ? parseInt(p.id, 10) || 0 : (p.id ?? 0),
      date: p.date ?? p.published_at ?? new Date().toISOString(),
      readTime: p.readTime ?? (p.reading_time ? `${p.reading_time} min` : "1 min"),
    })) as BlogPost[]);
  } catch (err) {
    console.error("Error fetching data:", err);
    // Components will use default mock data if fetch fails
  }

  const upcomingHomeEvents = getUpcomingEvents(demoEvents, 5);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <Hero />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DiscoverSection
          listings={listings}
          emptyMessage="No featured listings found in Supabase yet. Mark listings as featured to show them here."
        />
        <CategoryNavigation />
        <EventsSection
          events={upcomingHomeEvents}
          showViewAll
          viewAllHref="/events"
          title="Upcoming Events"
          subtitle="The next events coming up in date order. See all events for the full calendar."
        />
        <BlogSection posts={blogPosts} />
      </main>

      <Footer />
    </div>
  );
}
