"use client";

import { Compass, Search, X } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export function Header() {
  const [searchActive, setSearchActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchQuery("");
      setSearchActive(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-dark-gray dark:text-white whitespace-nowrap">The GQ Passport</h1>
          </Link>

          {/* Desktop Navigation + Search */}
          <nav className="hidden md:flex gap-8 items-center flex-1 justify-end">
            <Link href="/listings" className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition">
              All Listings
            </Link>
            <Link href="/blog" className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition">
              Blog
            </Link>
            <Link href="/events" className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition">
              Events
            </Link>
            <Link href="/explore" className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition">
              Explore
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="ml-4">
              <div className="bg-gray-100 dark:bg-slate-800 rounded-full px-4 py-2 flex items-center gap-2 w-64">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find your gem..."
                  className="flex-1 outline-none text-dark-gray dark:text-white dark:bg-slate-800 text-sm bg-transparent"
                />
              </div>
            </form>
          </nav>

          {/* Mobile: Search Icon + Menu Button (search is rendered as absolute overlay to avoid layout/overflow issues) */}
          <div className="flex md:hidden items-center gap-2 relative overflow-visible">
            <button
              onClick={() => setSearchActive((s) => !s)}
              className="text-dark-gray dark:text-white hover:opacity-80 transition p-2 z-10"
              aria-expanded={searchActive}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* absolute overlay so opening search doesn't push layout or cause overflow clipping */}
            {searchActive && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 z-50">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-full px-3 py-2 shadow-md w-40">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery.trim()) {
                        setSearchActive(false);
                      }
                    }}
                    placeholder="Search..."
                    className="outline-none text-dark-gray dark:text-white dark:bg-slate-800 text-sm bg-transparent w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchActive(false);
                      setSearchQuery("");
                    }}
                    className="text-gray-400 hover:text-dark-gray dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMenuActive((m) => !m)}
              className={`text-dark-gray dark:text-white hover:opacity-80 transition p-2 z-10 ${searchActive ? "invisible pointer-events-none" : ""}`}
              aria-expanded={menuActive}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Menu Drawer */}
            {menuActive && (
              <div className="absolute left-0 right-0 top-full mt-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-lg">
                <nav className="flex flex-col p-4 gap-4">
                  <Link
                    href="/listings"
                    onClick={() => setMenuActive(false)}
                    className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition py-2"
                  >
                    All Listings
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setMenuActive(false)}
                    className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition py-2"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/events"
                    onClick={() => setMenuActive(false)}
                    className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition py-2"
                  >
                    Events
                  </Link>
                  <Link 
                    href="/explore" 
                    onClick={() => setMenuActive(false)}
                    className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition py-2"
                  >
                    Explore
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
