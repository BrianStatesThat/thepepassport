"use client";

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

interface BlogPost {
  id: string | number;
  slug?: string;
  title: string;
  excerpt: string;
  date?: string;
  readTime?: string;
  published_at?: string;
  reading_time?: number;
  featured_image?: string;
}

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

export function BlogSection({
  title = "Latest Travel Tips",
  subtitle = "Insider guides, itineraries, and local insights to enhance your Gqeberha experience.",
  posts = [],
}: BlogSectionProps) {
  const defaultPosts: BlogPost[] = [
    {
      id: 1,
      title: "Top 10 Beaches in Gqeberha",
      excerpt: "Discover the most stunning beach spots from family-friendly shores to hidden gems.",
      date: "Feb 10, 2025",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "A Foodie's Guide to The Boardwalk",
      excerpt: "Explore the culinary delights and vibrant dining scene of Gqeberha's iconic boardwalk.",
      date: "Feb 8, 2025",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "24 Hours in Gqeberha - Perfect Itinerary",
      excerpt: "Make the most of your visit with this carefully curated day-long adventure.",
      date: "Feb 5, 2025",
      readTime: "7 min read",
    },
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <section className="mb-20 py-12 border-t border-gray-200 dark:border-slate-800">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-dark-gray dark:text-white mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-slate-300">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayPosts.map((post) => {
          const displayDate = post.date
            ?? (post.published_at ? new Date(post.published_at).toLocaleDateString() : "");
          const displayReadTime = post.readTime
            ?? (typeof post.reading_time === "number" ? `${post.reading_time} min read` : "");
          const cardClasses = "bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200 dark:border-slate-800 flex flex-col h-full hover:scale-105 duration-300";
          const cardBody = (
            <>
              {/* Image */}
              <div
                className="h-40 bg-linear-to-br from-orange-300 to-orange-400 bg-cover bg-center"
                style={{
                  backgroundImage: post.featured_image ? `url(${post.featured_image})` : undefined,
                }}
              />

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-3 line-clamp-2 flex-1">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">{post.excerpt}</p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 border-t border-gray-100 dark:border-slate-800 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{displayDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{displayReadTime}</span>
                  </div>
                </div>
              </div>
            </>
          );

          return post.slug ? (
            <Link key={post.id} href={`/blog/${post.slug}`} className={cardClasses}>
              {cardBody}
            </Link>
          ) : (
            <article key={post.id} className={cardClasses}>
              {cardBody}
            </article>
          );
        })}
      </div>
    </section>
  );
}
