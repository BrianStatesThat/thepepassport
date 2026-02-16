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

    blogPosts = ((postsData as BlogRow[]) || []).map((p, index): BlogPost => {
      const fallbackTimestamp = new Date().toISOString();
      const publishedAt = p.published_at ?? fallbackTimestamp;
      const parsedReadingTime = typeof p.reading_time === "string"
        ? Number.parseInt(p.reading_time, 10)
        : p.reading_time;
      const readingTimeValue = Number.isFinite(parsedReadingTime) && (parsedReadingTime ?? 0) > 0
        ? Number(parsedReadingTime)
        : 1;
      const id = p.id != null ? String(p.id) : `post-${index + 1}`;

      return {
        id,
        slug: p.slug ?? `post-${index + 1}`,
        title: p.title ?? "Untitled",
        excerpt: p.excerpt ?? "",
        content: p.content ?? "",
        featured_image: p.featured_image ?? "",
        published_at: publishedAt,
        published: typeof p.published === "boolean" ? p.published : true,
        author: p.author ?? "The PE Passport",
        reading_time: readingTimeValue,
        tags: Array.isArray(p.tags) ? p.tags : [],
        related_listings: Array.isArray(p.related_listings) ? p.related_listings : [],
        created_at: p.created_at ?? publishedAt,
        updated_at: p.updated_at ?? publishedAt,
        date: p.date ?? publishedAt,
        readTime: p.readTime ?? `${readingTimeValue} min`,
      };
    });
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
