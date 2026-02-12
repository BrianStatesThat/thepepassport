import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// Listings API
export const listingsAPI = {
  // Get all listings, optionally filtered by category
  async getListings(category?: string, limit = 20) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    let query = supabase.from("listings").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.limit(limit).order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
    return data || [];
  },

  // Get featured listings
  async getFeaturedListings(limit = 6) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("is_featured", true)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured listings:", error);
      return [];
    }
    return data || [];
  },

  // Get single listing by slug
  async getListingBySlug(slug: string) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { data, error } = await supabase.from("listings").select("*").eq("slug", slug).single();

    if (error) {
      console.error("Error fetching listing:", error);
      return null;
    }
    return data;
  },

  // Search listings
  async searchListings(searchQuery: string, limit = 20) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
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
    return data || [];
  },

  // Get listings by category with count
  async getListingsByCategory(categoryName: string, limit = 20) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("category", categoryName)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings by category:", error);
      return [];
    }
    return data || [];
  },
};

// Blog API
export const blogAPI = {
  // Get all published blog posts
  async getPosts(limit = 10) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
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
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }
    return data;
  },

  // Get related posts
  async getRelatedPosts(currentPostId: string, limit = 3) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
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
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
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
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { data, error } = await supabase.from("categories").select("*").order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    return data || [];
  },

  // Get categories with listing count
  async getCategoriesWithCounts() {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
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
        const cookieStore2 = cookies();
        const supabase2 = await createClient(cookieStore2);
        const { count, error: countError } = await supabase2
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("category", cat.name);

        return {
          ...cat,
          count: countError ? 0 : count || 0,
        };
      })
    );

    return categoriesWithCounts;
  },
};
