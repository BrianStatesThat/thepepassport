import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import type { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const isFeatured = listing.featured || listing.is_featured;
  const displayTitle = listing.title || (listing as { name?: string }).name || "Untitled";
  const priceIndicator = listing.price_range ? {
    "$": "Budget",
    "$$": "Moderate",
    "$$$": "Upscale",
    "$$$$": "Luxury",
  }[listing.price_range] : null;

  return (
    <div
      onClick={onClick}
      className="group relative min-h-96 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition duration-300 hover:shadow-xl dark:bg-slate-900"
    >
      {/* Image Layer */}
      {listing.featured_image ? (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={listing.featured_image}
            alt={`${displayTitle} - Gqeberha attraction`}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-blue-200 dark:bg-slate-800 flex items-center justify-center">
          <MapPin className="w-12 h-12 text-blue-400" />
        </div>
      )}

      {isFeatured && (
        <div className="absolute top-3 right-3 bg-sunset-orange text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
          Featured
        </div>
      )}
      <div className="absolute top-3 left-3 bg-white/20 dark:bg-slate-800/50 rounded-full p-2 z-10 backdrop-blur-sm">
        <MapPin className="w-5 h-5 text-white" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        {/* Gradient Overlay - Full Height */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 via-50% to-transparent dark:from-slate-950/70 dark:via-slate-950/40 dark:to-transparent pointer-events-none" />
        
        {/* Text Content */}
        <div className="relative z-20 p-4">
            <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white">
              {displayTitle}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-white/90">
              {listing.description}
            </p>

            <div className="mb-4 flex items-center gap-2">
              {listing.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(listing.rating || 0)
                            ? "text-sunset-orange fill-sunset-orange"
                            : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/70">
                    {listing.review_count && `(${listing.review_count})`}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                {listing.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-white/20 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              {priceIndicator && (
                <span className="rounded bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {priceIndicator}
                </span>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
