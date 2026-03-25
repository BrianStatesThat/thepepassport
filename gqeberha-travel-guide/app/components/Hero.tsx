"use client";

import Image from "next/image";
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
    <section className="relative min-h-[65vh] md:min-h-screen overflow-hidden">
      <img
        src="/IMG_20260103_160311.jpg"
        alt="Gqeberha hero"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 30%" }}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/20 to-black/50" />

      <div className="relative min-h-[65vh] md:min-h-screen flex flex-col items-center justify-center px-4 text-center z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl drop-shadow-lg">{title}</h2>
        <p className="text-lg text-white mb-8 max-w-2xl drop-shadow-md">{subtitle}</p>

        {showSearch && <SearchBar />}
      </div>
    </section>
  );
}
