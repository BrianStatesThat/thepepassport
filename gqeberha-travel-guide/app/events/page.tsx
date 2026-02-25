import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { EventsSection } from "@/app/components/EventsSection";
import { demoEvents, getUpcomingEvents } from "@/lib/demo/events";
import { JsonLd } from "@/app/components/JsonLd";
import { absoluteUrl, buildPageMetadata, toJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Upcoming Events in Gqeberha",
  description:
    "Browse upcoming events in Gqeberha (Port Elizabeth), from festivals and markets to family activities and live entertainment.",
  path: "/events",
  keywords: ["Gqeberha events", "Port Elizabeth events", "what's on in Gqeberha"],
});

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const upcomingEvents = getUpcomingEvents(demoEvents);
  const eventsJsonLd = toJsonLd({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Upcoming Events in Gqeberha",
    url: absoluteUrl("/events"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: upcomingEvents.map((event, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Event",
          name: event.title,
          startDate: event.starts_at,
          endDate: event.ends_at || undefined,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: event.venue,
            address: event.city || "Gqeberha",
          },
          image: event.featured_image || undefined,
          url: event.ticket_url || undefined,
        },
      })),
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <JsonLd id="events-page-jsonld" data={eventsJsonLd} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-500 dark:text-blue-400 hover:underline"
          >
            <ChevronLeft className="mr-1" size={18} />
            Back to Home
          </Link>
        </nav>

        <section className="mb-8 rounded-2xl border border-blue-200/70 dark:border-blue-800/60 bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-wide uppercase text-blue-700 dark:text-blue-300 mb-2">
            Events Calendar
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-gray dark:text-white mb-2">
            Upcoming Events in Gqeberha
          </h1>
          <p className="text-gray-700 dark:text-slate-300 max-w-3xl">
            Browse all upcoming events sorted by nearest date. This currently uses demo data and can be swapped to Supabase fetches once your events table is live.
          </p>
        </section>

        <EventsSection
          title="All Upcoming Events"
          subtitle="Nearest events are listed first. Featured events are highlighted at the top."
          events={upcomingEvents}
          showViewAll={false}
        />
      </main>

      <Footer />
    </div>
  );
}
