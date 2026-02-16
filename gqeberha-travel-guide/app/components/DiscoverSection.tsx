"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

interface FeaturedListing {
  id: string | number;
  slug?: string;
  title?: string;
  name?: string;
  category?: string;
  categories?: string[];
  image?: string;
  featured_image?: string;
  description: string;
  localTip?: boolean;
  featured?: boolean;
  is_featured?: boolean;
}

interface DiscoverSectionProps {
  listings?: FeaturedListing[];
  title?: string;
  subtitle?: string;
  useDefaultListings?: boolean;
  emptyMessage?: string;
}

export function DiscoverSection({
  listings = [],
  title = "Discover Gqeberha's Best",
  subtitle = "From pristine beaches to vibrant cultural sites, Gqeberha offers experiences to captivate every traveler.",
  useDefaultListings = false,
  emptyMessage = "No listings available right now.",
}: DiscoverSectionProps) {
  // Default listings if none provided
  const defaultListings: FeaturedListing[] = [
    {
      id: 1,
      title: "Sardinia Bay Sunset Retreat",
      category: "Beaches",
      description: "Experience the breathtaking beauty of a sunset over pristine waters.",
      localTip: true,
    },
    {
      id: 2,
      title: "Algoa Bay Diving Adventure",
      category: "Things to Do",
      description: "Discover vibrant marine life in one of South Africa's premier diving spots.",
      localTip: false,
    },
    {
      id: 3,
      title: "Waterfront Dining & Cuisine",
      category: "Restaurants",
      description: "Savor fresh seafood while overlooking the sparkling bay.",
      localTip: true,
    },
    {
      id: 4,
      title: "Luxury Stays at The Strand",
      category: "Accommodation",
      description: "Experience world-class hospitality with stunning ocean views.",
      localTip: false,
    },
    {
      id: 5,
      title: "Coastal Hiking Trails & Views",
      category: "Adventures",
      description: "Trek along scenic coastal paths and discover hidden coves.",
      localTip: true,
    },
  ];

  const displayListings = listings.length > 0 ? listings : (useDefaultListings ? defaultListings : []);

  return (
    <section className="mb-20">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-dark-gray dark:text-white mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-slate-300 text-lg">{subtitle}</p>
      </div>

      {/* Featured Listings Grid */}
      {displayListings.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/40 px-6 py-10 text-center">
          <p className="text-gray-600 dark:text-slate-300">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayListings.map((listing, idx) => {
            const image = listing.featured_image || listing.image;
            const category = listing.category || listing.categories?.[0] || "General";
            const showFeatured = listing.localTip || listing.featured || listing.is_featured;
            const displayTitle = listing.title || listing.name || "Untitled";
            const cardHref = listing.slug ? `/listings/${listing.slug}` : null;
            const cardClasses = "group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer block";
            const cardBody = (
              <>
                {/* Image Container */}
                <div className="relative h-48 bg-linear-to-br from-blue-200 to-blue-300 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center ease-in-out"
                    style={{
                      backgroundColor: "#cbd5e1",
                      backgroundImage: image ? `url(${image})` : undefined,
                      backgroundPosition: "center 40%",
                    }}
                  />
                  {showFeatured && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {listing.localTip ? "Local Tip" : "Featured"}
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-800 rounded-full p-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-2">{displayTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{listing.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      {category}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            );

            return (
              cardHref ? (
                <Link
                  key={listing.id || `${displayTitle}-${idx}`}
                  href={cardHref}
                  className={cardClasses}
                >
                  {cardBody}
                </Link>
              ) : (
                <div
                  key={listing.id || `${displayTitle}-${idx}`}
                  className={cardClasses}
                >
                  {cardBody}
                </div>
              )
            );
          })}
        </div>
      )}
    </section>
  );
}
