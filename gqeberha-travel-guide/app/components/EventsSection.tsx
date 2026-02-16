import Link from "next/link";
import { Calendar, Clock3, MapPin, Ticket } from "lucide-react";
import { demoEvents, getUpcomingEvents } from "@/lib/demo/events";
import type { EventItem } from "@/lib/types";

interface EventsSectionProps {
  title?: string;
  subtitle?: string;
  events?: EventItem[];
  showViewAll?: boolean;
  viewAllHref?: string;
  featuredLimit?: number;
  emptyMessage?: string;
}

function formatEventDate(startsAt: string): string {
  const parsed = new Date(startsAt);
  if (Number.isNaN(parsed.getTime())) return "Date TBC";
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatEventTime(startsAt: string, endsAt?: string): string {
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return "Time TBC";

  const timeFormatter = new Intl.DateTimeFormat("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!endsAt) return timeFormatter.format(start);

  const end = new Date(endsAt);
  if (Number.isNaN(end.getTime())) return timeFormatter.format(start);
  return `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
}

export function EventsSection({
  title = "Upcoming Events",
  subtitle = "Plan ahead with live music, food markets, family festivals, and local experiences happening around Gqeberha.",
  events = [],
  showViewAll = false,
  viewAllHref = "/events",
  featuredLimit = 2,
  emptyMessage = "No upcoming events right now. Check back soon.",
}: EventsSectionProps) {
  const sourceEvents = events.length > 0 ? events : demoEvents;
  const displayEvents = getUpcomingEvents(sourceEvents);

  if (displayEvents.length === 0) {
    return (
      <section className="mb-20 py-12 border-t border-gray-200 dark:border-slate-800">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold text-dark-gray dark:text-white mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-slate-300">{subtitle}</p>
          </div>
          {showViewAll && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center rounded-md border border-gray-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              View all events
            </Link>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/40 px-6 py-10 text-center">
          <p className="text-gray-600 dark:text-slate-300">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  const featuredEvents = displayEvents.filter((event) => event.featured).slice(0, featuredLimit);
  const featuredIds = new Set(featuredEvents.map((event) => event.id));
  const standardEvents = displayEvents.filter((event) => !featuredIds.has(event.id));

  return (
    <section className="mb-20 py-12 border-t border-gray-200 dark:border-slate-800">
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-dark-gray dark:text-white mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-slate-300">{subtitle}</p>
        </div>
        {showViewAll && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center rounded-md border border-gray-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
          >
            View all events
          </Link>
        )}
      </div>

      {featuredEvents.length > 0 && (
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredEvents.map((event) => (
            <article
              key={event.id}
              className="rounded-xl overflow-hidden border border-amber-200/70 dark:border-amber-700/40 bg-white dark:bg-slate-900 shadow-md"
            >
              <div
                className="h-44 bg-cover bg-center"
                style={{
                  backgroundColor: "#cbd5e1",
                  backgroundImage: event.featured_image ? `url(${event.featured_image})` : undefined,
                }}
              />
              <div className="p-5">
                <span className="inline-flex rounded-full bg-amber-100 dark:bg-amber-900/40 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-3">
                  Featured Event
                </span>
                <h3 className="text-xl font-bold text-dark-gray dark:text-white mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">{event.description}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatEventDate(event.starts_at)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="w-4 h-4" />
                    {formatEventTime(event.starts_at, event.ends_at)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {standardEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {standardEvents.map((event) => (
            <article
              key={event.id}
              className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-gray-200 dark:border-slate-800 flex flex-col"
            >
              <div
                className="h-36 bg-cover bg-center"
                style={{
                  backgroundColor: "#cbd5e1",
                  backgroundImage: event.featured_image ? `url(${event.featured_image})` : undefined,
                }}
              />
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 rounded-full px-2.5 py-1">
                    {event.category || "Event"}
                  </span>
                  {event.price_label && (
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                      {event.price_label}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 mb-4 line-clamp-2">{event.description}</p>
                <div className="mt-auto space-y-2 text-sm text-gray-600 dark:text-slate-300">
                  <p className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatEventDate(event.starts_at)}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Clock3 className="w-4 h-4" />
                    {formatEventTime(event.starts_at, event.ends_at)}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </p>
                </div>
                {event.ticket_url ? (
                  <a
                    href={event.ticket_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >
                    <Ticket className="w-4 h-4" />
                    Get Tickets
                  </a>
                ) : (
                  <span className="mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 dark:border-slate-700 px-3 py-2 text-sm font-medium text-gray-500 dark:text-slate-400">
                    <Ticket className="w-4 h-4" />
                    Details coming soon
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
