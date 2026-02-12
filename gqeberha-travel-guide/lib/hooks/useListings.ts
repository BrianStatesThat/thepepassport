"use client";

import { useState, useEffect } from "react";
import { listingsAPI, blogAPI } from "@/lib/supabase";

interface UseListingsOptions {
  category?: string;
  limit?: number;
}

export function useListings(options?: UseListingsOptions) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await listingsAPI.getListings(options?.category);
        setData(result || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load listings");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options?.category]);

  return { data, loading, error };
}

export function useBlogPosts(limit = 10) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await blogAPI.getPosts(limit);
        setData(result || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load posts");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, loading, error };
}
