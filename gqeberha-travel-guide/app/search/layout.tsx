import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Search Listings",
  description: "Search results for Gqeberha travel listings on The PE Passport.",
  path: "/search",
  noIndex: true,
  keywords: ["Gqeberha listing search"],
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
