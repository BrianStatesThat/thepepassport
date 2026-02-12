"use server";

import { listingsAPI } from "@/lib/supabase";

export async function searchListingsAction(query: string) {
  try {
    const results = await listingsAPI.searchListings(query);
    return { data: results || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || "Search failed. Please try again." };
  }
}
