// Listing type
export interface Listing {
  id: number;
  slug: string;
  title: string;
  description: string;
  long_description?: string;
  categories: string[];
  images: string[];
  featured_image: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    area?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  price_range?: "$" | "$$" | "$$$" | "$$$$";
  opening_hours?: string;
  features?: string[];
  verified: boolean;
  featured: boolean;
  status: "published" | "draft" | "archived";
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

// Blog Post type
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  published_at: string;
  published: boolean;
  author: string;
  reading_time: number;
  tags: string[];
  related_listings?: string[];
  created_at: string;
  updated_at: string;
  // compatibility aliases used by UI/mappers - always provided by API
  date: string;
  readTime: string;
}

// Category type
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  listing_count?: number;
}

// Enquiry type
export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  listing_id?: number;
  status: "new" | "read" | "responded";
  created_at: string;
}

// Listing Suggestion type
export interface ListingSuggestion {
  id: number;
  name: string;
  email: string;
  place_name: string;
  place_description: string;
  category: string;
  address?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

// Search result type
export interface SearchResult extends Listing {
  type: "listing" | "blog";
}

// Featured listing is a Listing with a category field used in the UI
export interface FeaturedListing extends Listing {
  category: string;
}
