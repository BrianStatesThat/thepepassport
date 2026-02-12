import { MapPin, Star } from "lucide-react";
import type { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const priceIndicator = listing.price_range ? {
    "$": "Budget",
    "$$": "Moderate",
    "$$$": "Upscale",
    "$$$$": "Luxury",
  }[listing.price_range] : null;

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-line-to-br from-blue-200 to-blue-300 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${listing.featured_image})`,
            backgroundColor: "#cbd5e1",
          }}
        />
        {listing.featured && (
          <div className="absolute top-3 right-3 bg-sunset-orange text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-800 rounded-full p-2">
          <MapPin className="w-5 h-5 text-pe-blue" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-2 line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">
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
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-slate-400">
                {listing.review_count && `(${listing.review_count})`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2">
            {listing.categories.map((cat, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold text-pe-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
          {priceIndicator && (
            <span className="text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">
              {priceIndicator}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
