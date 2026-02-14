import { Header } from "@/app/components/Header";
import { BlogSection } from "@/app/components/BlogSection";
import { Footer } from "@/app/components/Footer";
import { blogAPI } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  // Raw rows returned by Supabase may have snake_case fields (published_at, read_time)
  // Map them to the shape expected by BlogSection (id:number, title, excerpt, date, readTime, featured_image)
  type RawPost = Record<string, any>;
  type DisplayPost = {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    featured_image?: string;
    slug?: string;
  };

  let rawPosts: RawPost[] = [];
  let posts: DisplayPost[] = [];
  let error: string | null = null;

  try {
    rawPosts = (await blogAPI.getPosts(20)) || [];

    posts = rawPosts.map((p: RawPost, idx: number) => {
      const published = p.published_at || p.created_at || null;
      const read = p.read_time ?? p.readTime ?? p.reading_time ?? null;

      return {
        id: typeof p.id === "number" ? p.id : idx + 1,
        title: p.title || p.headline || "Untitled",
        excerpt: p.excerpt || p.summary || "",
        date: published ? new Date(published).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "",
        readTime: read ? (typeof read === "number" ? `${read} min read` : String(read)) : "",
        featured_image: p.featured_image || p.featuredImage || p.image || undefined,
        slug: p.slug,
      } as DisplayPost;
    });
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    error = "Failed to load blog posts";
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      {/* Page Header */}
      <section className="bg-linear-to-r from-blue-500 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Travel Tips & Local Insights
          </h1>
          <p className="text-blue-100 text-lg">
            Discover stories, guides, and recommendations from Gqeberha
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <BlogSection
            posts={posts}
            title="All Posts"
            subtitle="Browse our complete collection of travel guides and local insights"
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-slate-400 text-lg">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
