"use client";

import Link from "next/link";
import { Compass, Facebook, Instagram, Twitter } from "lucide-react";

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
  copyrightYear = 2026,
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
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition shrink-0">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 transition shrink-0">
                <Instagram className="w-5 h-5" />
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

