import Link from "next/link";
import { CalendarDays, Compass, Route, Sparkles, Ticket, Wallet } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { ListingCard } from "@/app/components/ListingCard";
import { categoriesAPI, listingsAPI } from "@/lib/supabase";
import { demoEvents, getUpcomingEvents } from "@/lib/demo/events";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

type CategoryLink = {
  id: string;
  name: string;
  count?: number;
};

const fallbackCategories: CategoryLink[] = [
  { id: "cat-explore", name: "Explore" },
  { id: "cat-eat", name: "Eat" },
  { id: "cat-stay", name: "Stay" },
  { id: "cat-adventures", name: "Adventures" },
];

const explorationModes = [
  {
    title: "First Time in Gqeberha",
    description: "A balanced mix of iconic spots, local food, and relaxed coastal time.",
    href: "/listings",
    icon: Compass,
  },
  {
    title: "Weekend Adventure",
    description: "Outdoor routes, high-energy activities, and sunset-friendly stops.",
    href: "/categories/Adventures",
    icon: Route,
  },
  {
    title: "Value-Friendly Plan",
    description: "Great experiences that are easy on your budget without missing highlights.",
    href: "/search?q=free",
    icon: Wallet,
  },
];

function formatEventDate(iso: string) {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "Date TBC";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatEventTime(iso: string) {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "Time TBC";
  return new Intl.DateTimeFormat("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export default async function ExplorePage() {
  let featuredListings: Listing[] = [];
  let categoryLinks: CategoryLink[] = fallbackCategories;

  try {
    const [featuredData, categoriesData] = await Promise.all([
      listingsAPI.getFeaturedListings(6),
      categoriesAPI.getCategoriesWithCounts(),
    ]);

    featuredListings = (featuredData || []).slice(0, 3);
    const dbCategories = (categoriesData || [])
      .slice(0, 8)
      .map((cat: { id?: string; name?: string; count?: number }, index: number) => ({
        id: cat.id || cat.name || `cat-${index}`,
        name: cat.name || "General",
        count: typeof cat.count === "number" ? cat.count : undefined,
      }))
      .filter((cat) => !!cat.name);

    if (dbCategories.length > 0) {
      categoryLinks = dbCategories;
    }
  } catch (error) {
    console.error("Error loading explore page data:", error);
  }

  const upcomingEvents = getUpcomingEvents(demoEvents, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section className="relative overflow-hidden rounded-2xl border border-blue-200/70 dark:border-blue-800/40 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 sm:p-8">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300 mb-2">
              Explore Planner
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-dark-gray dark:text-white mb-3">
              Build Your Perfect Gqeberha Day
            </h1>
            <p className="text-gray-700 dark:text-slate-300 max-w-3xl mb-6">
              Use this page as your starting point: search by interest, jump into top categories, and combine places with events happening soon.
            </p>

            <form
              action="/search"
              method="get"
              className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-2 shadow-sm"
              role="search"
              aria-label="Explore search"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  name="q"
                  type="search"
                  placeholder="Try: beachfront, family-friendly, coffee, hiking..."
                  className="w-full rounded-lg px-4 py-3 text-sm text-dark-gray dark:text-white bg-white dark:bg-slate-900 outline-none border border-transparent focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-sm font-semibold transition"
                >
                  <Sparkles className="w-4 h-4" />
                  Find Places
                </button>
              </div>
            </form>
          </div>
        </section>

        <section aria-labelledby="quick-links-title" className="mt-8">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 id="quick-links-title" className="text-2xl font-bold text-dark-gray dark:text-white">
              Quick Category Links
            </h2>
            <Link
              href="/listings"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all listings
            </Link>
          </div>
          <nav aria-label="Category shortcuts" className="flex flex-wrap gap-2">
            {categoryLinks.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
              >
                <Compass className="w-4 h-4" />
                {category.name}
                {typeof category.count === "number" ? (
                  <span className="text-xs text-blue-600/80 dark:text-blue-300/80">({category.count})</span>
                ) : null}
              </Link>
            ))}
          </nav>
        </section>

        <section aria-labelledby="modes-title" className="mt-12">
          <h2 id="modes-title" className="text-2xl font-bold text-dark-gray dark:text-white mb-4">
            How Do You Want To Explore?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {explorationModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Link
                  key={mode.title}
                  href={mode.href}
                  className="group rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-gray dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {mode.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">{mode.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="featured-places-title" className="mt-12 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h2 id="featured-places-title" className="text-2xl font-bold text-dark-gray dark:text-white">
                Featured Places Right Now
              </h2>
              <Link
                href="/listings"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Browse all places
              </Link>
            </div>
            {featuredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredListings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.slug}`} className="block">
                    <ListingCard listing={listing} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/40 p-6">
                <p className="text-gray-600 dark:text-slate-300 mb-2">No featured places yet.</p>
                <Link href="/listings" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                  Explore all listings
                </Link>
              </div>
            )}
          </div>

          <aside aria-labelledby="next-events-title">
            <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 id="next-events-title" className="text-xl font-bold text-dark-gray dark:text-white">
                  Next Events
                </h2>
                <Link href="/events" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Full calendar
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <article key={event.id} className="rounded-lg border border-gray-200 dark:border-slate-800 p-4">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      {event.category || "Event"}
                    </p>
                    <h3 className="text-sm font-semibold text-dark-gray dark:text-white mb-2">{event.title}</h3>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-slate-300">
                      <p className="inline-flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatEventDate(event.starts_at)}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <Ticket className="w-3.5 h-3.5" />
                        {formatEventTime(event.starts_at)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
