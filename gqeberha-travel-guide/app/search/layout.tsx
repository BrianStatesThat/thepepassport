import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Search Gqeberha Listings | The PE Passport",
  description: "Search our comprehensive database of Gqeberha attractions, restaurants, accommodations, and travel experiences. Find exactly what you're looking for in Port Elizabeth.",
  path: "/search",
  keywords: ["Gqeberha search", "Port Elizabeth listings search", "local attractions", "restaurants", "hotels"],
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
