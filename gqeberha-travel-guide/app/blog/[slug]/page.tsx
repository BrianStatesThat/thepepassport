import { Header } from "@/app/components/Header";
import { BlogSection } from "@/app/components/BlogSection";
import { Footer } from "@/app/components/Footer";
import { blogAPI } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;

  let post = null;
  let relatedPosts = [];
  let error = null;

  try {
    post = await blogAPI.getPostBySlug(slug);
    if (post) {
      relatedPosts = (await blogAPI.getRelatedPosts(post.id, 3)) || [];
    }
  } catch (err) {
    console.error("Error fetching post:", err);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />

      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/blog"
          className="flex items-center text-blue-500 dark:text-blue-400 hover:underline"
        >
          <ChevronLeft className="mr-1" size={18} />
          Back to Blog
        </Link>
      </nav>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Article Title & Meta */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-gray dark:text-white mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-gray-600 dark:text-slate-400">
            {post.published_at && (
              <span className="flex items-center">
                <Calendar size={18} className="mr-2" />
                {new Date(post.published_at).toLocaleDateString()}
              </span>
            )}
            {post.read_time && (
              <span className="flex items-center">
                <Clock size={18} className="mr-2" />
                {post.read_time} min read
              </span>
            )}
          </div>
        </div>

        {/* Article Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-700 dark:text-slate-300 mb-8 italic border-l-4 border-blue-500 pl-6">
            {post.excerpt}
          </p>
        )}

        {/* Article Content */}
        <div className="prose dark:prose-invert max-w-none mb-12">
          {post.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-gray-700 dark:text-slate-300 leading-relaxed"
            />
          ) : (
            <p className="text-gray-600 dark:text-slate-400">
              Full content coming soon...
            </p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-gray-200 dark:border-slate-800 my-12" />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200 dark:border-slate-800">
          <BlogSection
            posts={relatedPosts}
            title="More Travel Tips"
            subtitle="Check out these related articles"
            onPostClick={(postId) => {
              const post = relatedPosts.find((p: typeof relatedPosts[0]) => p.id === postId);
              if (post?.slug) {
                window.location.href = `/blog/${post.slug}`;
              }
            }}
          />
        </section>
      )}

      <Footer />
    </div>
  );
}
