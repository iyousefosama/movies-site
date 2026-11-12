"use client";

import Link from "next/link";
import { Search, X, Sparkles, Heart, Film, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import type { TMDBMediaItem } from "@/types/tmdb";
import { searchMedia, getImageUrl } from "@/lib/tmdb";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TMDBMediaItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live suggestions
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const data = await searchMedia(trimmed, 1);
        const filtered = (data.results || [])
          .filter((item) => (item.media_type === "movie" || item.media_type === "tv") && item.poster_path)
          .slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch (err) {
        console.error("Suggestions search error:", err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsSearchOpen(false);
    }
  };

  const handleSuggestionClick = (item: TMDBMediaItem) => {
    const mediaType = item.media_type === "tv" ? "tv" : "movie";
    router.push(`/${mediaType}/${item.id}`);
    setShowSuggestions(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/favorites", label: "Favorites" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 lg:px-12 py-2.5 sm:py-3.5 flex items-center justify-between",
        isHomePage
          ? isScrolled
            ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl"
            : "bg-gradient-to-b from-black/95 via-black/60 to-transparent"
          : "bg-black/95 backdrop-blur-md border-b border-white/10"
      )}
    >
      {/* Mobile Full-Width Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-2 top-2 bottom-2 z-50 flex items-center bg-zinc-950 border border-red-600/80 rounded-full px-3 shadow-2xl sm:hidden">
          <Search className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search movies, series..."
              className="bg-transparent text-xs text-white focus:outline-none w-full placeholder:text-zinc-500"
            />
          </form>
          {isLoadingSuggestions && (
            <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin mr-1 flex-shrink-0" />
          )}
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false);
              setShowSuggestions(false);
              setSearchQuery("");
            }}
            className="text-zinc-400 hover:text-white p-1 rounded-full"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Left: Brand Logo + Nav Links */}
      <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 min-w-0">
        <Link
          href="/"
          className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white hover:opacity-90 transition-opacity font-sans flex items-center flex-shrink-0"
        >
          movista<span className="text-red-600">.</span>
        </Link>

        {/* Navbar Links: Home and Favorites */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-white/10 text-white font-bold"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: Search Bar + SUGGEST Button */}
      <div className="flex items-center gap-1.5 sm:gap-3 relative" ref={searchContainerRef}>
        
        {/* Desktop Expandable Search Input Container */}
        {isSearchOpen ? (
          <div className="relative hidden sm:block">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-black/95 border border-red-600/70 rounded-full px-3 py-1.5 shadow-xl shadow-red-950/30 animate-in fade-in zoom-in-95 duration-200"
            >
              <Search className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search movies, series..."
                className="bg-transparent text-xs sm:text-sm text-white focus:outline-none w-44 md:w-64 lg:w-72 placeholder:text-zinc-500"
              />
              {isLoadingSuggestions && (
                <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin mr-1 flex-shrink-0" />
              )}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setShowSuggestions(false);
                  setSearchQuery("");
                }}
                className="text-zinc-400 hover:text-white ml-1 p-0.5 rounded-full"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 sm:p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Open search"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Live Search Suggestions Dropdown (Shared for Mobile and Desktop) */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="fixed sm:absolute inset-x-2 sm:inset-x-auto sm:right-0 top-14 sm:top-full mt-2 max-w-sm sm:w-80 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 mx-auto">
            <div className="p-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-white/5 px-3">
              Quick Results
            </div>
            <div className="max-h-64 sm:max-h-72 overflow-y-auto no-scrollbar py-1">
              {suggestions.map((item) => {
                const title = item.title || item.name || "Untitled";
                const poster = getImageUrl(item.poster_path, "w92");
                const year = item.release_date
                  ? new Date(item.release_date).getFullYear()
                  : item.first_air_date
                  ? new Date(item.first_air_date).getFullYear()
                  : null;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-white/10 transition-colors group"
                  >
                    <img
                      src={poster}
                      alt={title}
                      className="w-8 h-12 sm:w-9 sm:h-13 object-cover rounded bg-zinc-800 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white group-hover:text-red-400 transition-colors truncate">
                        {title}
                      </p>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
                        {item.media_type === "tv" ? "TV Show" : "Movie"}{year ? ` • ${year}` : ""}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="w-full py-2 px-3 text-center text-xs font-bold text-red-500 hover:text-red-400 hover:bg-white/5 border-t border-white/5 transition-colors"
            >
              View all results for &quot;{searchQuery}&quot; &rarr;
            </button>
          </div>
        )}

        {/* The Standout Red Pill SUGGEST Button */}
        <Link
          href="/suggestions"
          className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-[11px] sm:text-xs tracking-wider uppercase px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:shadow-[0_0_24px_rgba(229,9,20,0.6)] transition-all flex items-center gap-1 sm:gap-1.5 font-sans whitespace-nowrap flex-shrink-0"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
          <span>SUGGEST</span>
        </Link>
      </div>
    </header>
  );
}
