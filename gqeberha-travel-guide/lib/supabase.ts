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

const LISTING_SELECT = `
  *,
  listing_images (
    storage_path,
    public_url,
    is_primary,
    created_at
  )
`;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const LISTINGS_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_LISTINGS_BUCKET ?? "listings";

type ListingImageRow = {
  storage_path?: string | null;
  public_url?: string | null;
  is_primary?: boolean | null;
  created_at?: string | null;
};

type ListingRow = Partial<Listing> & {
  name?: string | null;
  title?: string | null;
  categories?: string[] | null;
  category_ids?: string[] | null;
  images?: string[] | null;
  featured_image?: string | null;
  address?: string | null;
  street?: string | null;
  city?: string | null;
  region?: string | null;
  postal_code?: string | null;
  country?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  avg_rating?: number | string | null;
  ratings_count?: number | null;
  is_featured?: boolean | null;
  is_verified?: boolean | null;
  listing_images?: ListingImageRow[] | null;
};

function toText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function buildPublicStorageUrl(storagePath: string | null): string | null {
  if (!storagePath) return null;
  if (!SUPABASE_URL) return null;
  const cleanedPath = storagePath.replace(/^\/+/, "");
  const encodedPath = cleanedPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${SUPABASE_URL}/storage/v1/object/public/${LISTINGS_BUCKET}/${encodedPath}`;
}

function normalizeListingRow(row: unknown): Listing {
  const source = (row && typeof row === "object" ? row : {}) as ListingRow;
  const resolvedTitle = toText(source.title) ?? toText(source.name) ?? "Untitled";
  const relationImages = Array.isArray(source.listing_images)
    ? [...source.listing_images]
        .sort((a, b) => {
          if (!!a?.is_primary !== !!b?.is_primary) return a?.is_primary ? -1 : 1;
          return toNumber(new Date(a?.created_at ?? 0).getTime(), 0) - toNumber(new Date(b?.created_at ?? 0).getTime(), 0);
        })
        .map((img) => toText(img?.public_url) ?? buildPublicStorageUrl(toText(img?.storage_path)))
        .filter((value): value is string => !!value)
    : [];
  const inlineImages = Array.isArray(source.images)
    ? source.images.map((img) => toText(img)).filter((value): value is string => !!value)
    : [];
  const fallbackFeatured = toText(source.featured_image);
  const featuredImage = fallbackFeatured ?? relationImages[0] ?? inlineImages[0] ?? "";
  const images = Array.from(new Set([featuredImage, ...relationImages, ...inlineImages].filter(Boolean)));
  const street = toText(source.street);
  const address = toText(source.address);
  const baseAddress = [street, address].filter(Boolean).join(", ");
  const city = toText(source.city);
  const region = toText(source.region);
  const postalCode = toText(source.postal_code);
  const country = toText(source.country);
  const formattedAddress = [baseAddress, city, region, postalCode, country].filter(Boolean).join(", ");
  const existingLocation = source.location && typeof source.location === "object"
    ? source.location
    : null;
  const existingContact = source.contact && typeof source.contact === "object"
    ? source.contact
    : null;
  const categories = Array.isArray(source.categories) ? source.categories : [];

  return {
    ...(source as Listing),
    id: toText(source.id) ?? "",
    slug: toText(source.slug) ?? "",
    title: resolvedTitle,
    description: toText(source.description) ?? "",
    categories,
    images,
    featured_image: featuredImage,
    location: {
      address: toText(existingLocation?.address) ?? formattedAddress,
      lat: toNumber(existingLocation?.lat ?? source.latitude, 0),
      lng: toNumber(existingLocation?.lng ?? source.longitude, 0),
      area: toText(existingLocation?.area) ?? region ?? undefined,
    },
    contact: {
      phone: toText(existingContact?.phone) ?? toText(source.phone) ?? undefined,
      email: toText(existingContact?.email) ?? toText(source.email) ?? undefined,
      website: toText(existingContact?.website) ?? toText(source.website) ?? undefined,
    },
    rating: toNumber(source.rating ?? source.avg_rating, 0),
    review_count: toNumber(source.review_count ?? source.ratings_count, 0),
    featured: Boolean(source.featured ?? source.is_featured),
    verified: Boolean(source.verified ?? source.is_verified),
    status: (toText(source.status) as Listing["status"]) ?? "draft",
    created_at: toText(source.created_at) ?? new Date(0).toISOString(),
    updated_at: toText(source.updated_at) ?? new Date(0).toISOString(),
  };
}

// Listings API
export const listingsAPI = {
  // Get all listings, optionally filtered by category
  async getListings(category?: string, limit = 20): Promise<Listing[]> {
    const supabase = await getServerSupabase();
    let query = supabase.from("listings").select(LISTING_SELECT);

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
      .select(LISTING_SELECT, { count: "exact" });

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
      .select(LISTING_SELECT)
      .eq("featured", true)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (!error) return (data || []).map(normalizeListingRow);

    // Backward-compatible fallback for schemas that still use `is_featured`.
    const { data: legacyData, error: legacyError } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
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
    const { data, error } = await supabase.from("listings").select(LISTING_SELECT).eq("slug", slug).single();

    if (error) {
      console.error("Error fetching listing:", error);
      return null;
    }
    return data ? normalizeListingRow(data) : null;
  },

  // Search listings
  async searchListings(searchQuery: string, limit = 20): Promise<Listing[]> {
    const supabase = await getServerSupabase();
    const runSearch = (nameField: "title" | "name") =>
      supabase
        .from("listings")
        .select(LISTING_SELECT)
        .or(`${nameField}.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(limit)
        .order("created_at", { ascending: false });

    const { data, error } = await runSearch("title");

    if (!error) return (data || []).map(normalizeListingRow);

    const { data: fallbackData, error: fallbackError } = await runSearch("name");
    if (fallbackError) {
      console.error("Error searching listings:", {
        titleSearchError: formatSupabaseError(error),
        nameSearchError: formatSupabaseError(fallbackError),
      });
      return [];
    }

    return (fallbackData || []).map(normalizeListingRow);
  },

  // Get listings by category with count
  async getListingsByCategory(categoryName: string, limit = 20): Promise<Listing[]> {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
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
    return (data || []).map((row) => {
      const p = (row && typeof row === "object" ? row : {}) as {
        id?: string;
        slug?: string;
        title?: string;
        name?: string;
        excerpt?: string;
        summary?: string;
        content?: string;
        featured_image?: string;
        image?: string;
        published_at?: string;
        published?: boolean;
        author?: string;
        read_time?: number | string;
        reading_time?: number | string;
        readTime?: number | string;
        tags?: string[];
        tag_list?: string[];
        related_listings?: string[];
        created_at?: string;
        updated_at?: string;
      };
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
