import Image from "next/image";
import { MapPin, Search, Utensils, Home as HomeIcon, Compass, Camera } from "lucide-react";

export default function HomePage() {
  // Mock data - will be replaced with Supabase queries
  const featuredListings = [
    {
      id: 1,
      title: "Sardinia Bay Sunset Retreat",
      category: "Beaches",
      image: "/images/sardinia-bay.jpg",
      description: "Experience the breathtaking beauty of a sunset over pristine waters.",
      localTip: true,
    },
    {
      id: 2,
      title: "Algoa Bay Diving Adventure",
      category: "Things to Do",
      image: "/images/algoa-bay.jpg",
      description: "Discover vibrant marine life in one of South Africa's premier diving spots.",
      localTip: false,
    },
    {
      id: 3,
      title: "Waterfront Dining & Cuisine",
      category: "Restaurants",
      image: "/images/waterfront-dining.jpg",
      description: "Savor fresh seafood while overlooking the sparkling bay.",
      localTip: true,
    },
    {
      id: 4,
      title: "Luxury Stays at The Strand",
      category: "Accommodation",
      image: "/images/luxury-stays.jpg",
      description: "Experience world-class hospitality with stunning ocean views.",
      localTip: false,
    },
    {
      id: 5,
      title: "Coastal Hiking Trails & Views",
      category: "Adventures",
      image: "/images/coastal-hiking.jpg",
      description: "Trek along scenic coastal paths and discover hidden coves.",
      localTip: true,
    },
  ];

  const categories = [
    { name: "Explore", icon: <Compass className="w-6 h-6" />, color: "bg-blue-500" },
    { name: "Eat", icon: <Utensils className="w-6 h-6" />, color: "bg-orange-500" },
    { name: "Stay", icon: <HomeIcon className="w-6 h-6" />, color: "bg-teal-500" },
    { name: "Adventures", icon: <Camera className="w-6 h-6" />, color: "bg-emerald-500" },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Beaches in Gqeberha",
      excerpt: "Discover the most stunning beach spots from family-friendly shores to hidden gems.",
      date: "Feb 10, 2025",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "A Foodie's Guide to The Boardwalk",
      excerpt: "Explore the culinary delights and vibrant dining scene of Gqeberha's iconic boardwalk.",
      date: "Feb 8, 2025",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "24 Hours in Gqeberha - Perfect Itinerary",
      excerpt: "Make the most of your visit with this carefully curated day-long adventure.",
      date: "Feb 5, 2025",
      readTime: "7 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-dark-gray dark:text-white">The PE Passport</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition">
                Explore
              </a>
              <a href="#" className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition">
                Eat
              </a>
              <a href="#" className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition">
                Stay
              </a>
              <a href="#" className="text-dark-gray dark:text-slate-200 hover:text-blue-600 font-medium transition">
                Adventures
              </a>
            </nav>

            {/* Mobile Menu */}
            <button className="md:hidden text-dark-gray dark:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-96 md:h-125 bg-linear-to-b from-blue-400 to-blue-500 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        />

        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl">
            Your Guide to Gqeberha's Hidden Gems
          </h2>
          <p className="text-lg text-blue-50 mb-8 max-w-2xl">
            Explore the untouched beauty and vibrant culture of the Friendly City.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-slate-800 rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Find your hidden gem in Gqeberha..."
                className="flex-1 outline-none text-dark-gray dark:text-white dark:bg-slate-800 text-sm"
              />
              <button className="bg-blue-600 text-white px-4 py-1 rounded-full font-medium hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* DISCOVER SECTION */}
        <section className="mb-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-dark-gray dark:text-white mb-4">Discover Gqeberha's Best</h2>
            <p className="text-gray-600 dark:text-slate-300 text-lg">
              From pristine beaches to vibrant cultural sites, Gqeberha offers experiences to captivate every traveler.
            </p>
          </div>

          {/* Featured Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <div
                key={listing.id}
                className="group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-linear-to-br from-blue-200 to-blue-300 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center ease-in-out" style={{ backgroundColor: "#cbd5e1" }} />
                  {listing.localTip && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Local Tip
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-800 rounded-full p-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-2">{listing.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{listing.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      {listing.category}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORY QUICK NAV */}
        <section className="mb-20 py-12 border-t border-gray-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-dark-gray dark:text-white mb-8">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="group bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6 cursor-pointer hover:shadow-lg transition duration-300"
              >
                <div className={`${cat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition`}>
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-dark-gray dark:text-white">{cat.name}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">Explore {cat.name.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BLOG SECTION */}
        <section className="mb-20 py-12 border-t border-gray-200 dark:border-slate-800">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-dark-gray dark:text-white mb-2">Latest Travel Tips</h2>
            <p className="text-gray-600 dark:text-slate-300">
              Insider guides, itineraries, and local insights to enhance your Gqeberha experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200 dark:border-slate-800"
              >
                <div className="h-40 bg-linear-to-br from-orange-300 to-orange-400" />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-dark-gray dark:text-white mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                    <span>{post.date}</span>
                    <span className="font-medium">{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-gray dark:text-white">The PE Passport</h3>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Discover your next adventure</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-dark-gray dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition text-sm">
                    Explore
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition text-sm">
                    Eat
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition text-sm">
                    Stay
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition text-sm">
                    Adventures
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-bold text-dark-gray dark:text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 002.856-3.515 10.009 10.009 0 01-2.8.856 4.995 4.995 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.992 4.992 0 00-8.506 4.547A14.148 14.148 0 011.392 6.859a4.986 4.986 0 001.546 6.35 4.934 4.934 0 01-2.261-.569v.06a4.993 4.993 0 003.995 4.882 4.996 4.996 0 01-2.228.084 4.996 4.996 0 004.662 3.418A10.01 10.01 0 010 19.54a14.11 14.11 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="none" />
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                    <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-dark-gray dark:text-white mb-4">Join the Community</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                Stay informed with the latest tips and offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded text-sm border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition text-sm">
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-300 dark:border-slate-700 pt-8 text-center text-sm text-gray-600 dark:text-slate-400">
            <p>© 2025 The PE Passport. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
