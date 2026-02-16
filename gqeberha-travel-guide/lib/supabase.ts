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
type ServerSupabaseClient = Awaited<ReturnType<typeof getServerSupabase>>;

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

type CategoryRow = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
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

function toNonEmptyStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values.map((value) => toText(value)).filter((value): value is string => !!value);
}

async function resolveCategoryIdByNameOrSlug(
  supabase: ServerSupabaseClient,
  category: string
): Promise<string | null> {
  const normalizedCategory = toText(category);
  if (!normalizedCategory) return null;

  const { data: byName } = await supabase
    .from("categories")
    .select("id")
    .eq("name", normalizedCategory)
    .maybeSingle();

  const byNameId = toText((byName as { id?: string | null } | null)?.id);
  if (byNameId) return byNameId;

  const slug = normalizedCategory.toLowerCase().replace(/\s+/g, "-");
  const { data: bySlug } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  return toText((bySlug as { id?: string | null } | null)?.id);
}

async function hydrateCategoryNames(
  supabase: ServerSupabaseClient,
  rows: unknown[] | null | undefined
): Promise<ListingRow[]> {
  const listingRows = (rows || []).map((row) => (row && typeof row === "object" ? row : {}) as ListingRow);
  if (listingRows.length === 0) return listingRows;

  const categoryIdsToLookup = Array.from(
    new Set(
      listingRows.flatMap((row) => {
        const existing = toNonEmptyStringArray(row.categories);
        if (existing.length > 0) return [];
        return toNonEmptyStringArray(row.category_ids);
      })
    )
  );

  if (categoryIdsToLookup.length === 0) return listingRows;

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug")
    .in("id", categoryIdsToLookup);

  if (error) {
    console.error("Error resolving category names:", formatSupabaseError(error));
    return listingRows;
  }

  const categories = ((data || []) as CategoryRow[]).map((cat) => ({
    id: toText(cat.id),
    name: toText(cat.name) ?? toText(cat.slug),
  }));
  const nameById = new Map(
    categories
      .filter((cat): cat is { id: string; name: string } => !!cat.id && !!cat.name)
      .map((cat) => [cat.id, cat.name])
  );

  return listingRows.map((row) => {
    const existing = toNonEmptyStringArray(row.categories);
    if (existing.length > 0) return { ...row, categories: existing };

    const resolvedNames = toNonEmptyStringArray(row.category_ids)
      .map((id) => nameById.get(id))
      .filter((name): name is string => !!name);

    return resolvedNames.length > 0
      ? { ...row, categories: Array.from(new Set(resolvedNames)) }
      : row;
  });
}

async function mapListingRows(
  supabase: ServerSupabaseClient,
  rows: unknown[] | null | undefined
): Promise<Listing[]> {
  const hydratedRows = await hydrateCategoryNames(supabase, rows);
  return hydratedRows.map(normalizeListingRow);
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
  const categories = toNonEmptyStringArray(source.categories);

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
    const baseQuery = () =>
      supabase
        .from("listings")
        .select(LISTING_SELECT)
        .limit(limit)
        .order("created_at", { ascending: false });

    let query = baseQuery();
    if (category) query = query.contains("categories", [category]);

    const { data, error } = await query;

    const hasPrimaryResults = !error && (data || []).length > 0;
    if (!category || hasPrimaryResults) return mapListingRows(supabase, data);

    const fallbackCategoryId = await resolveCategoryIdByNameOrSlug(supabase, category);
    if (!fallbackCategoryId) {
      if (error) console.error("Error fetching listings:", error);
      return [];
    }

    const { data: fallbackData, error: fallbackError } = await baseQuery().contains("category_ids", [fallbackCategoryId]);
    if (fallbackError) {
      console.error("Error fetching listings:", {
        categoriesError: formatSupabaseError(error),
        categoryIdsError: formatSupabaseError(fallbackError),
      });
      return [];
    }
    return mapListingRows(supabase, fallbackData);
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
    const baseQuery = () =>
      supabase
        .from("listings")
        .select(LISTING_SELECT, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

    let { data, count, error } = category
      ? await baseQuery().contains("categories", [category])
      : await baseQuery();

    const needsFallback = Boolean(category && (!error && (data || []).length === 0));
    if ((error || needsFallback) && category) {
      const fallbackCategoryId = await resolveCategoryIdByNameOrSlug(supabase, category);
      if (fallbackCategoryId) {
        const fallback = await baseQuery().contains("category_ids", [fallbackCategoryId]);
        data = fallback.data;
        count = fallback.count;
        error = fallback.error;
      }
    }

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
      data: await mapListingRows(supabase, data),
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

    if (!error) return mapListingRows(supabase, data);

    // Backward-compatible fallback for schemas that still use `is_featured`.
    const { data: legacyData, error: legacyError } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("is_featured", true)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (!legacyError) return mapListingRows(supabase, legacyData);

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
    if (!data) return null;
    const hydrated = await mapListingRows(supabase, [data]);
    return hydrated[0] ?? null;
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

    if (!error) return mapListingRows(supabase, data);

    const { data: fallbackData, error: fallbackError } = await runSearch("name");
    if (fallbackError) {
      console.error("Error searching listings:", {
        titleSearchError: formatSupabaseError(error),
        nameSearchError: formatSupabaseError(fallbackError),
      });
      return [];
    }

    return mapListingRows(supabase, fallbackData);
  },

  // Get listings by category with count
  async getListingsByCategory(categoryName: string, limit = 20): Promise<Listing[]> {
    const supabase = await getServerSupabase();
    const baseQuery = () =>
      supabase
        .from("listings")
        .select(LISTING_SELECT)
        .limit(limit)
        .order("created_at", { ascending: false });

    const { data, error } = await baseQuery()
      .contains("categories", [categoryName]);

    const hasPrimaryResults = !error && (data || []).length > 0;
    if (hasPrimaryResults) return mapListingRows(supabase, data);

    const fallbackCategoryId = await resolveCategoryIdByNameOrSlug(supabase, categoryName);
    if (!fallbackCategoryId) {
      if (error) console.error("Error fetching listings by category:", error);
      return [];
    }

    const { data: fallbackData, error: fallbackError } = await baseQuery()
      .contains("category_ids", [fallbackCategoryId]);

    if (fallbackError) {
      console.error("Error fetching listings by category:", {
        categoriesError: formatSupabaseError(error),
        categoryIdsError: formatSupabaseError(fallbackError),
      });
      return [];
    }
    return mapListingRows(supabase, fallbackData);
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

        const primaryCount = countError ? 0 : count || 0;
        if (primaryCount > 0 || !cat?.id) {
          return {
            ...cat,
            count: primaryCount,
          };
        }

        const { count: fallbackCount, error: fallbackError } = await supabase2
          .from("listings")
          .select("*", { count: "exact", head: true })
          .contains("category_ids", [cat.id]);

        return {
          ...cat,
          count: fallbackError ? 0 : fallbackCount || 0,
        };
      })
    );

    return categoriesWithCounts;
  },
};
