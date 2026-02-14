import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/app/components/Header";
import { DiscoverSection } from "@/app/components/DiscoverSection";
import { Footer } from "@/app/components/Footer";
import { listingsAPI } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type ListingsSearchParams = {
  page?: string | string[];
  category?: string | string[];
};

interface ListingsPageProps {
  searchParams?: ListingsSearchParams | Promise<ListingsSearchParams>;
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T>)?.then === "function";
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const resolvedSearchParams = searchParams
    ? (isPromise(searchParams) ? await searchParams : searchParams)
    : {};

  const rawPage = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page;
  const rawCategory = Array.isArray(resolvedSearchParams.category)
    ? resolvedSearchParams.category[0]
    : resolvedSearchParams.category;

  const requestedPage = Number.parseInt(rawPage ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const activeCategory = rawCategory && rawCategory.trim() ? rawCategory.trim() : "";
  const filters = ["Eat", "Stay", "Adventures"] as const;

  const {
    data: listings,
    total,
    totalPages,
  } = await listingsAPI.getListingsPage(page, PAGE_SIZE, activeCategory || undefined);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = total === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + listings.length, total);
  const subtitle = activeCategory
    ? `Showing ${start}-${end} of ${total} listings in ${activeCategory}`
    : `Showing ${start}-${end} of ${total} listings`;

  const listingsHref = (nextPage: number, category?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `/listings?${query}` : "/listings";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="flex items-center text-blue-500 dark:text-blue-400 hover:underline w-fit">
          <ChevronLeft className="mr-1" size={18} />
          Back to Home
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link
            href={listingsHref(1)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !activeCategory
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All
          </Link>
          {filters.map((filter) => (
            <Link
              key={filter}
              href={listingsHref(1, filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {filter}
            </Link>
          ))}
        </div>

        <DiscoverSection
          listings={listings}
          title="All Listings"
          subtitle={subtitle}
          emptyMessage="No listings found."
        />

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-slate-400">
            Page {page} of {totalPages}
          </div>

          <div className="flex items-center gap-3">
            {hasPrev ? (
              <Link
                href={listingsHref(page - 1, activeCategory || undefined)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-900"
              >
                <ChevronLeft size={16} />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 dark:border-slate-800 px-3 py-2 text-sm text-gray-400 dark:text-slate-600">
                <ChevronLeft size={16} />
                Previous
              </span>
            )}

            {hasNext ? (
              <Link
                href={listingsHref(page + 1, activeCategory || undefined)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-slate-700 px-3 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-900"
              >
                Next
                <ChevronRight size={16} />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 dark:border-slate-800 px-3 py-2 text-sm text-gray-400 dark:text-slate-600">
                Next
                <ChevronRight size={16} />
              </span>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
