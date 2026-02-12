import { Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
}

export function BlogCard({ post, onClick }: BlogCardProps) {
  return (
    <article
      onClick={onClick}
      className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200 dark:border-slate-800 flex flex-col h-full"
    >
      {/* Image */}
      <div
        className="h-40 bg-linear-to-br from-orange-300 to-orange-400 bg-cover bg-center"
        style={{
          backgroundImage: `url(${post.featured_image})`,
        }}
      />

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-3 line-clamp-2 flex-1">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex gap-2 flex-wrap">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-pe-blue px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 border-t border-gray-100 dark:border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
              <span>
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.reading_time ? `${post.reading_time} min` : ""}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
