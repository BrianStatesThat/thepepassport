"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSubmit?: (query: string) => void;
}

export function SearchBar({
  placeholder = "Find your hidden gem in Gqeberha...",
  onSearch,
  onSubmit,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 outline-none text-dark-gray dark:text-white dark:bg-slate-800 text-sm"
        />
        <button
          type="submit"
          className="bg-pe-blue text-white px-4 py-1 rounded-full font-medium hover:bg-ocean-blue transition"
        >
          Search
        </button>
      </div>
    </form>
  );
}
