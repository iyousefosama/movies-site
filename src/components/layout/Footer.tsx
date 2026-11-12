import Link from "next/link";
import { Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] text-zinc-400 border-t border-zinc-900 pt-16 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-14">
          
          {/* Col 1 & 2: Logo and Contact Details */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="text-2xl sm:text-3xl font-black tracking-tight text-white hover:opacity-90 transition-opacity font-sans inline-flex items-center mb-4"
              >
                movista<span className="text-red-600">.</span>
              </Link>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-6">
                Your premier destination for cinema discovery, curated recommendations, and AI-powered movie exploration.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="mailto:support@movista.com">support@movista.com</a>
              </div>
              <div className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>+1 (800) 555-0199</span>
              </div>
            </div>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-sans">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Premium Movies */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-sans">
              Premium Movies
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#latest" className="hover:text-red-500 transition-colors">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link href="/#trending" className="hover:text-red-500 transition-colors">
                  Top Trending
                </Link>
              </li>
              <li>
                <Link href="/popular/movie/1" className="hover:text-red-500 transition-colors">
                  Box Office Hits
                </Link>
              </li>
              <li>
                <Link href="/suggestions" className="hover:text-red-500 transition-colors">
                  AI Suggestions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-sans">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/favorites" className="hover:text-red-500 transition-colors">
                  My Favorites
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-red-500 transition-colors">
                  Search Catalog
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/suggestions" className="hover:text-red-500 transition-colors">
                  Share Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 6: Follow Us with Social Icons */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-sans">
              Follow Us
            </h4>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 hover:border-red-600 hover:text-red-500 flex items-center justify-center transition-all"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 hover:border-red-600 hover:text-red-500 flex items-center justify-center transition-all"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 hover:border-red-600 hover:text-red-500 flex items-center justify-center transition-all"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 hover:border-red-600 hover:text-red-500 flex items-center justify-center transition-all"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p>
            Best viewed on Google Chrome 80+, Microsoft Edge 80+, Mozilla Firefox 75+, Safari 13+.
          </p>
          <p>
            Copyright © {new Date().getFullYear()} Movista. All rights reserved. Film data provided by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="text-red-500 hover:underline"
            >
              TMDB
            </a>.
          </p>
        </div>

      </div>
    </footer>
  );
}
