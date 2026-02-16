import Link from "next/link";
import { ChevronLeft, MapPin, Phone, Mail, Globe, Clock, Tag, Star, ShieldCheck, Navigation } from "lucide-react";
import { notFound } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { listingsAPI } from "@/lib/supabase";

interface ListingPageProps {
  params: {
    slug: string;
  } | Promise<{
    slug: string;
  }>;
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await Promise.resolve(params);
  const listing = await listingsAPI.getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const relatedCategory = listing.categories?.[0];
  const relatedListings = relatedCategory
    ? ((await listingsAPI.getListings(relatedCategory, 6)) || []).filter((l) => l.id !== listing.id).slice(0, 3)
    : [];

  const displayDescription = listing.long_description || listing.description;
  const hasRating = typeof listing.rating === "number" && listing.rating > 0;
  const hasCoords = Boolean(
    listing.location
    && Number.isFinite(listing.location.lat)
    && Number.isFinite(listing.location.lng)
    && (listing.location.lat !== 0 || listing.location.lng !== 0)
  );
  const mapsHref = hasCoords
    ? `https://www.google.com/maps?q=${listing.location.lat},${listing.location.lng}`
    : listing.location?.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location.address)}`
      : null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="mb-6">
          <Link
            href="/listings"
            className="inline-flex items-center text-blue-500 dark:text-blue-400 hover:underline"
          >
            <ChevronLeft className="mr-1" size={18} />
            Back to Listings
          </Link>
        </nav>

        <article className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div
            className="h-64 sm:h-80 md:h-96 bg-linear-to-br from-blue-200 to-blue-300 bg-cover bg-center"
            style={{
              backgroundImage: listing.featured_image ? `url(${listing.featured_image})` : undefined,
              backgroundPosition: "center 40%",
            }}
          />

          <div className="p-5 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {(listing.categories || []).map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-dark-gray dark:text-white mb-3">
              {listing.title}
            </h1>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              {listing.verified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <ShieldCheck size={14} />
                  Verified
                </span>
              )}
              {hasRating && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  <Star size={14} className="fill-current" />
                  {listing.rating?.toFixed(1)}
                  {listing.review_count ? `(${listing.review_count} reviews)` : ""}
                </span>
              )}
            </div>

            <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-slate-300">
              {listing.location?.address && (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  {listing.location.address}
                </span>
              )}
              {listing.opening_hours && (
                <span className="inline-flex items-center gap-2">
                  <Clock size={16} />
                  {listing.opening_hours}
                </span>
              )}
              {listing.price_range && (
                <span className="inline-flex items-center gap-2">
                  <Tag size={16} />
                  {listing.price_range}
                </span>
              )}
            </div>

            <p className="text-gray-700 dark:text-slate-200 leading-7 mb-8 whitespace-pre-line">
              {displayDescription}
            </p>

            {(listing.location?.address || mapsHref) && (
              <section className="mb-8 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-dark-gray dark:text-white mb-3">Location</h2>
                {listing.location?.address && (
                  <p className="text-sm text-gray-700 dark:text-slate-300 inline-flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{listing.location.address}</span>
                  </p>
                )}
                {mapsHref && (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Navigation size={16} />
                    Get directions
                  </a>
                )}
              </section>
            )}

            {(listing.contact?.phone || listing.contact?.email || listing.contact?.website) && (
              <section className="mb-8 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-dark-gray dark:text-white mb-3">Contact</h2>
                <div className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
                  {listing.contact?.phone && (
                    <p className="inline-flex items-center gap-2">
                      <Phone size={16} />
                      {listing.contact.phone}
                    </p>
                  )}
                  {listing.contact?.email && (
                    <p className="inline-flex items-center gap-2">
                      <Mail size={16} />
                      {listing.contact.email}
                    </p>
                  )}
                  {listing.contact?.website && (
                    <p className="inline-flex items-center gap-2">
                      <Globe size={16} />
                      <a
                        href={listing.contact.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400 break-all"
                      >
                        {listing.contact.website}
                      </a>
                    </p>
                  )}
                </div>
              </section>
            )}

            {listing.features && listing.features.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-dark-gray dark:text-white mb-3">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-md bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>

        {relatedListings.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-dark-gray dark:text-white mb-4">More Like This</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedListings.map((related) => (
                <Link
                  key={related.id}
                  href={`/listings/${related.slug}`}
                  className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-dark-gray dark:text-white mb-2">{related.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
