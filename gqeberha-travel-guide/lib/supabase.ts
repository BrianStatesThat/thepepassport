import { getServerSupabase } from "@/utils/supabase/server";
import type { Listing } from "@/lib/types";

function formatSupabaseError(error: unknown) {
  if (!error) return null;
  if (typeof error === "string") return { message: error };
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }
  if (typeof error === "object") {
    const e = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };
    return {
      message: e.message ?? "Unknown Supabase error",
      details: e.details ?? null,
      hint: e.hint ?? null,
      code: e.code ?? null,
    };
  }
  return { message: String(error) };
}

type ListingRow = Partial<Listing> & {
  name?: string | null;
  title?: string | null;
};

function normalizeListingRow(row: unknown): Listing {
  const source = (row && typeof row === "object" ? row : {}) as ListingRow;
  const resolvedTitle = (typeof source.title === "string" && source.title.trim())
    ? source.title
    : (typeof source.name === "string" && source.name.trim())
      ? source.name
      : "Untitled";
  return {
    ...(source as Listing),
    title: resolvedTitle,
  };
}

// Listings API
export const listingsAPI = {
  // Get all listings, optionally filtered by category
  async getListings(category?: string, limit = 20): Promise<Listing[]> {
    const supabase = await getServerSupabase();
    let query = supabase.from("listings").select("*");

    if (category) {
      query = query.contains("categories", [category]);
    }

    const { data, error } = await query.limit(limit).order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
    return (data || []).map(normalizeListingRow);
  },

  // Get paginated listings with total count (no featured filter)
  async getListingsPage(page = 1, pageSize = 20, category?: string): Promise<{
    data: Listing[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }> {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 20;
    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize - 1;

    const supabase = await getServerSupabase();
    let query = supabase
      .from("listings")
      .select("*", { count: "exact" });

    if (category) {
      query = query.contains("categories", [category]);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching paginated listings:", formatSupabaseError(error));
      return {
        data: [],
        total: 0,
        totalPages: 1,
        page: safePage,
        pageSize: safePageSize,
      };
    }

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));

    return {
      data: (data || []).map(normalizeListingRow),
      total,
      totalPages,
      page: safePage,
      pageSize: safePageSize,
    };
  },

  // Get featured listings
  async getFeaturedListings(limit = 6): Promise<Listing[]> {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("featured", true)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (!error) return (data || []).map(normalizeListingRow);

    // Backward-compatible fallback for schemas that still use `is_featured`.
    const { data: legacyData, error: legacyError } = await supabase
      .from("listings")
      .select("*")
      .eq("is_featured", true)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (!legacyError) return (legacyData || []).map(normalizeListingRow);

    console.error("Error fetching featured listings:", {
      featuredError: formatSupabaseError(error),
      isFeaturedError: formatSupabaseError(legacyError),
    });
    return [];
  },

  // Get single listing by slug
  async getListingBySlug(slug: string): Promise<Listing | null> {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase.from("listings").select("*").eq("slug", slug).single();

    if (error) {
      console.error("Error fetching listing:", error);
      return null;
    }
    return data ? normalizeListingRow(data) : null;
  },

  // Search listings
  async searchListings(searchQuery: string, limit = 20): Promise<Listing[]> {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching listings:", error);
      return [];
    }
    return (data || []).map(normalizeListingRow);
  },

  // Get listings by category with count
  async getListingsByCategory(categoryName: string, limit = 20): Promise<Listing[]> {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .contains("categories", [categoryName])
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings by category:", error);
      return [];
    }
    return (data || []).map(normalizeListingRow);
  },
};

// Blog API
export const blogAPI = {
  // Get all published blog posts
  async getPosts(limit = 10) {
    const supabase = await getServerSupabase();
    const { data = [], error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }

    // Normalize DB rows to the app's BlogPost shape
    return (data || []).map((p: any) => {
      const ts = p.published_at ?? p.updated_at ?? p.created_at ?? null;
      const published_at = ts ? new Date(ts).toISOString() : null;
      const reading_time = p.read_time ?? p.reading_time ?? p.readTime ?? null;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title ?? p.name ?? "Untitled",
        excerpt: p.excerpt ?? p.summary ?? "",
        content: p.content ?? "",
        featured_image: p.featured_image ?? p.image ?? null,
        published_at,
        published: p.published ?? !!p.published_at,
        author: p.author ?? null,
        reading_time: reading_time ? Number(reading_time) : null,
        tags: p.tags ?? p.tag_list ?? [],
        related_listings: p.related_listings ?? [],
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
    });
  },

  // Get single post by slug
  async getPostBySlug(slug: string) {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }
    return data || null;
  },

  // Get related posts
  async getRelatedPosts(currentPostId: string, limit = 3) {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .neq("id", currentPostId)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }
    return data || [];
  },
};

// Contact/Enquiry API
export const contactAPI = {
  // Submit an enquiry
  async submitEnquiry(enquiry: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    listing_id?: string;
  }) {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase.from("enquiries").insert([enquiry]).select();

    if (error) {
      console.error("Error submitting enquiry:", error);
      return null;
    }
    return data;
  },
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  async getCategories() {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase.from("categories").select("*").order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    return data || [];
  },

  // Get categories with listing count
  async getCategoriesWithCounts() {
    const supabase = await getServerSupabase();
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    // Get count for each category
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (cat) => {
        const supabase2 = await getServerSupabase();
        const { count, error: countError } = await supabase2
          .from("listings")
          .select("*", { count: "exact", head: true })
          .contains("categories", [cat.name]);

        return {
          ...cat,
          count: countError ? 0 : count || 0,
        };
      })
    );

    return categoriesWithCounts;
  },
};
