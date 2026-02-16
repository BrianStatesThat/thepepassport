import type { EventItem } from "@/lib/types";

export const demoEvents: EventItem[] = [
  {
    id: "ev-1",
    slug: "summer-sunset-jazz-at-the-bay",
    title: "Summer Sunset Jazz at the Bay",
    description: "A relaxed open-air jazz evening with local artists and oceanfront views.",
    starts_at: "2026-03-14T18:00:00+02:00",
    venue: "Kings Beach Amphitheatre",
    city: "Gqeberha",
    category: "Music",
    price_label: "From R120",
    featured: true,
    ticket_url: "https://example.com/events/jazz-bay",
    featured_image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ev-2",
    slug: "street-food-and-craft-market",
    title: "Gqeberha Street Food & Craft Market",
    description: "Sample local food stalls, artisan products, and family activities in one place.",
    starts_at: "2026-03-21T10:00:00+02:00",
    ends_at: "2026-03-21T17:00:00+02:00",
    venue: "Baakens Valley Market Grounds",
    city: "Gqeberha",
    category: "Food",
    price_label: "Free Entry",
    featured: true,
    ticket_url: "https://example.com/events/food-market",
    featured_image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ev-3",
    slug: "algoa-bay-coastal-trail-run",
    title: "Algoa Bay Coastal Trail Run",
    description: "A scenic run for all levels with timed routes and hydration stations.",
    starts_at: "2026-04-05T07:00:00+02:00",
    venue: "Sardinia Bay Trailhead",
    city: "Gqeberha",
    category: "Sports",
    price_label: "From R90",
    ticket_url: "https://example.com/events/trail-run",
    featured_image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ev-4",
    slug: "family-picnic-day",
    title: "Nelson Mandela Bay Family Picnic Day",
    description: "Games, live performances, and kids activities in a safe family setting.",
    starts_at: "2026-04-12T11:00:00+02:00",
    ends_at: "2026-04-12T16:00:00+02:00",
    venue: "St George's Park",
    city: "Gqeberha",
    category: "Family",
    price_label: "Free Entry",
    featured_image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ev-5",
    slug: "boardwalk-night-cinema",
    title: "Boardwalk Night Cinema",
    description: "Outdoor movie night with food vendors and beanbag seating by the waterfront.",
    starts_at: "2026-04-19T19:30:00+02:00",
    venue: "The Boardwalk Piazza",
    city: "Gqeberha",
    category: "Entertainment",
    price_label: "From R80",
    ticket_url: "https://example.com/events/night-cinema",
    featured_image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ev-6",
    slug: "marine-conservation-day",
    title: "Marine Conservation Discovery Day",
    description: "Interactive educational day with guided talks and beach clean-up activity.",
    starts_at: "2026-05-02T09:00:00+02:00",
    ends_at: "2026-05-02T13:00:00+02:00",
    venue: "Bayworld Waterfront",
    city: "Gqeberha",
    category: "Community",
    price_label: "Free Entry",
    featured_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ev-7",
    slug: "winter-wine-and-food-pairing",
    title: "Winter Wine & Food Pairing Experience",
    description: "Local cellar selection paired with tasting plates by top regional chefs.",
    starts_at: "2026-05-16T17:30:00+02:00",
    venue: "Richmond Hill Social Club",
    city: "Gqeberha",
    category: "Food",
    price_label: "From R250",
    ticket_url: "https://example.com/events/wine-pairing",
    featured_image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1200&q=80",
  },
];

export function getUpcomingEvents(events: EventItem[], limit?: number, referenceDate = new Date()): EventItem[] {
  const startOfToday = new Date(referenceDate);
  startOfToday.setHours(0, 0, 0, 0);

  const upcoming = events
    .filter((event) => {
      const startsAt = Date.parse(event.starts_at);
      return Number.isFinite(startsAt) && startsAt >= startOfToday.getTime();
    })
    .sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at));

  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}
