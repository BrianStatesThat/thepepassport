"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  brandName?: string;
  brandTagline?: string;
  quickLinks?: FooterLink[];
  showNewsletter?: boolean;
  copyrightYear?: number;
  companyName?: string;
}

export function Footer({
  brandName = "The GQ Passport",
  brandTagline = "Discover your next adventure",
  quickLinks,
  showNewsletter = true,
  copyrightYear = 2025,
  companyName = "The GQ Passport",
}: FooterProps) {
  const defaultQuickLinks: FooterLink[] = [
    { label: "Explore", href: "#explore" },
    { label: "Eat", href: "#eat" },
    { label: "Stay", href: "#stay" },
    { label: "Adventures", href: "#adventures" },
  ];

  const links = quickLinks || defaultQuickLinks;

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-dark-gray dark:text-white truncate">{brandName}</h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 truncate">{brandTagline}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-dark-gray dark:text-white mb-4 text-sm md:text-base">Quick Links</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-dark-gray dark:text-white mb-4 text-sm md:text-base">Connect</h4>
            <div className="flex gap-3">
              <a href="https://facebook.com" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://twitter.com" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 002.856-3.515 10.009 10.009 0 01-2.8.856 4.995 4.995 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.992 4.992 0 00-8.506 4.547A14.148 14.148 0 011.392 6.859a4.986 4.986 0 001.546 6.35 4.934 4.934 0 01-2.261-.569v.06a4.993 4.993 0 003.995 4.882 4.996 4.996 0 01-2.228.084 4.996 4.996 0 004.662 3.418A10.01 10.01 0 010 19.54a14.11 14.11 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="https://instagram.com" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition shrink-0">
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
          {showNewsletter && (
            <div>
              <h4 className="font-bold text-dark-gray dark:text-white mb-4 text-sm md:text-base">Join the Community</h4>
              <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-3">Stay informed with the latest tips and offers.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 min-w-0 px-3 py-2 rounded text-sm border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition text-sm shrink-0 whitespace-nowrap">
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 dark:border-slate-700 pt-8 text-center text-xs md:text-sm text-gray-600 dark:text-slate-400">
          <div className="mb-3 flex items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Privacy Policy
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Terms &amp; Conditions
            </Link>
          </div>
          <p>(c) {copyrightYear} {companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

