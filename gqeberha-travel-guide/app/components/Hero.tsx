"use client";

import { Search } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface HeroProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function Hero({
  title = "Your Guide to Gqeberha's Hidden Gems",
  subtitle = "Explore the untouched beauty and vibrant culture of the Friendly City.",
  showSearch = true,
}: HeroProps) {
  return (
    <section className="relative h-96 md:h-125 bg-linear-to-b from-blue-400 to-blue-500 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl">{title}</h2>
        <p className="text-lg text-blue-50 mb-8 max-w-2xl">{subtitle}</p>

        {showSearch && <SearchBar />}
      </div>
    </section>
  );
}
