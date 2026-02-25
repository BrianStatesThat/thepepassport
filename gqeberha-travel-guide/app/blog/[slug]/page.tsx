import type { Metadata } from "next";
import { Header } from "@/app/components/Header";
import { BlogSection } from "@/app/components/BlogSection";
import { Footer } from "@/app/components/Footer";
import { JsonLd } from "@/app/components/JsonLd";
import { blogAPI } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import {
  absoluteUrl,
  buildPageMetadata,
  clampText,
  createBreadcrumbJsonLd,
  stripHtml,
  toJsonLd,
} from "@/lib/seo";

interface BlogPostPageProps {
  params: {
    slug: string;
  } | Promise<{
    slug: string;
  }>;
}

type BlogPostRecord = {
  id: string;
  slug: string;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  author?: string | null;
  tags?: string[] | null;
  read_time?: number | null;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const post = (await blogAPI.getPostBySlug(slug)) as BlogPostRecord | null;

  if (!post) {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "This article could not be found.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  const description = clampText(
    stripHtml(post.excerpt || post.content || ""),
    160
  ) || "Read this Gqeberha travel article on The PE Passport.";

  return buildPageMetadata({
    title: post.title || "Travel Article",
    description,
    path: `/blog/${post.slug || slug}`,
    image: post.featured_image || null,
    type: "article",
    publishedTime: post.published_at || post.created_at || null,
    modifiedTime: post.updated_at || post.published_at || post.created_at || null,
    keywords: ["Gqeberha travel tips", "Port Elizabeth travel guide", ...(post.tags || [])],
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await Promise.resolve(params);

  let post: BlogPostRecord | null = null;
  let relatedPosts = [];

  try {
    post = (await blogAPI.getPostBySlug(slug)) as BlogPostRecord | null;
    if (post) {
      relatedPosts = (await blogAPI.getRelatedPosts(post.id, 3)) || [];
    }
  } catch (err) {
    console.error("Error fetching post:", err);
  }

  if (!post) {
    notFound();
  }

  const articleDescription = clampText(stripHtml(post.excerpt || post.content || ""), 500) || post.title || "Travel article";
  const blogPostJsonLd = toJsonLd({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title || "Travel Article",
    description: articleDescription,
    url: absoluteUrl(`/blog/${post.slug || slug}`),
    image: post.featured_image || undefined,
    datePublished: post.published_at || post.created_at || undefined,
    dateModified: post.updated_at || post.published_at || post.created_at || undefined,
    author: {
      "@type": "Person",
      name: post.author || "The PE Passport",
    },
    publisher: {
      "@type": "Organization",
      name: "The PE Passport",
    },
    keywords: Array.isArray(post.tags) ? post.tags.join(", ") : undefined,
    articleSection: "Travel",
    wordCount: typeof post.content === "string" ? stripHtml(post.content).split(/\s+/).filter(Boolean).length : undefined,
  });
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title || "Article", path: `/blog/${post.slug || slug}` },
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <JsonLd id="blog-post-jsonld" data={blogPostJsonLd} />
      <JsonLd id="blog-post-breadcrumb-jsonld" data={breadcrumbJsonLd} />

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
              src={post.featured_image ?? undefined}
              alt={post.title || "Blog post image"}
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
          />
        </section>
      )}

      <Footer />
    </div>
  );
}
