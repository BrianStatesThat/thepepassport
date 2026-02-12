import { Header } from "@/app/components/Header";
import { DiscoverSection } from "@/app/components/DiscoverSection";
import { Footer } from "@/app/components/Footer";
import { listingsAPI } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const decodedCategory = decodeURIComponent(category);

  let listings = [];
  let error = null;

  try {
    listings = (await listingsAPI.getListings(decodedCategory)) || [];
  } catch (err) {
    console.error("Error fetching listings:", err);
    error = "Failed to load listings";
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
        <Link
          href="/"
          className="flex items-center text-blue-500 dark:text-blue-400 hover:underline"
        >
          <ChevronLeft className="mr-1" size={18} />
          Back to Home
        </Link>
      </nav>

      {/* Category Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-dark-gray dark:text-white mb-4">
          {decodedCategory}
        </h1>
        <p className="text-gray-600 dark:text-slate-300 text-lg">
          Explore all {decodedCategory.toLowerCase()} experiences in Gqeberha
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : listings.length > 0 ? (
          <DiscoverSection
            listings={listings}
            title={decodedCategory}
            subtitle={`All available ${decodedCategory.toLowerCase()} in Gqeberha`}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-slate-400 text-lg">
              No listings found for {decodedCategory}. Check back soon!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
