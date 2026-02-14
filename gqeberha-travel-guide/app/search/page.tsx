"use client";

import { useState, useEffect, Suspense } from "react";
import { Header } from "@/app/components/Header";
import { DiscoverSection } from "@/app/components/DiscoverSection";
import { Footer } from "@/app/components/Footer";
import { searchListingsAction } from "@/app/actions/search";
import type { Listing } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (!query) {
      setListings([]);
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await searchListingsAction(query);
        if (result.error) {
          setError(result.error);
          setListings([]);
        } else {
          setListings(result.data || []);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Search failed. Please try again.";
        setError(message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      window.location.href = `/search?${params.toString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      {/* Search Bar Section */}
      <section className="bg-linear-to-r from-blue-500 to-blue-600 py-10 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Search Gqeberha Attractions
          </h1>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-w-0 flex-1 px-4 sm:px-6 py-3 rounded-lg bg-white text-dark-gray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="text-center py-10 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 dark:text-slate-400 mt-4">Searching...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : query ? (
          listings.length > 0 ? (
            <DiscoverSection
              listings={listings}
              title={`Search Results for "${query}"`}
              subtitle={`Found ${listings.length} matching listing${listings.length !== 1 ? "s" : ""}`}
            />
          ) : (
            <div className="text-center py-10 sm:py-12">
              <p className="text-gray-600 dark:text-slate-400 text-base sm:text-lg wrap-break-word">
                No results found for &quot;{query}&quot;. Try a different search term.
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-10 sm:py-12">
            <p className="text-gray-600 dark:text-slate-400 text-base sm:text-lg">
              Enter a search term to find attractions in Gqeberha
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
      <SearchPageContent />
    </Suspense>
  );
}
