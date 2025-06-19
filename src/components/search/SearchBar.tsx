
"use client"

import React, { useState, useEffect, useRef } from "react"
import { Search, Loader2, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import type { TMDBMediaItem } from "@/types/tmdb"
import { searchMedia } from "@/lib/tmdb"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getImageUrl } from "@/lib/tmdb"

interface SearchBarProps {
  placeholder?: string
  className?: string;
}

const debounce = <F extends (...args: any[]) => void>(func: F, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export function SearchBar({ placeholder = "Search movies, TV shows...", className }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<TMDBMediaItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const debouncedFetchSuggestions = debounce(async (query: string) => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false); // Hide if query becomes too short after debounce
        setIsLoadingSuggestions(false);
        return;
      }
      setIsLoadingSuggestions(true);
      // setShowSuggestions(true); // Already set when typing starts

      try {
        const data = await searchMedia(query, 1);
        setSuggestions(
          data.results
            .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path) // Ensure poster_path exists
            .slice(0, 7) // Limit to 7 suggestions
        );
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      }
      setIsLoadingSuggestions(false);
    }, 300);

    if (searchValue.trim().length > 0) {
        if (searchValue.trim().length >=2) setShowSuggestions(true);
        debouncedFetchSuggestions(searchValue.trim());
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
    }
  }, [searchValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchValue.trim())}`);
      setShowSuggestions(false);
      if(inputRef.current) inputRef.current.blur();
    }
  };

  const handleSuggestionClick = (item: TMDBMediaItem) => {
    const query = item.title || item.name || '';
    setSearchValue(query);
    setShowSuggestions(false);
    router.push(`/search?query=${encodeURIComponent(query)}`);
     if(inputRef.current) inputRef.current.blur();
  };

  const clearSearch = () => {
    setSearchValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
      <motion.div
          ref={searchContainerRef}
          className={cn("relative w-full", className)}
          whileHover={{ scale: 1.0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <form onSubmit={handleFormSubmit} className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Search
                className={`w-5 h-5 transition-colors duration-200 ${isFocused ? "text-primary" : "text-muted-foreground/70"}`}
            />
          </div>

          <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                if (searchValue.trim().length >= 2) setShowSuggestions(true);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/70 hover:text-primary"
              aria-label="Clear search"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </form>

        {showSuggestions && (searchValue.trim().length >=2) && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 w-full mt-2 bg-card border border-border rounded-lg shadow-xl z-[100] max-h-96 overflow-y-auto"
            >
              {isLoadingSuggestions && (
                <div className="p-4 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
                </div>
              )}
              {!isLoadingSuggestions && suggestions.length === 0 && searchValue.trim().length >= 2 && (
                <div className="p-4 text-center text-muted-foreground">No results found for &quot;{searchValue}&quot;.</div>
              )}
              {!isLoadingSuggestions && suggestions.length > 0 && (
                <ul className="py-1">
                  {suggestions.map(item => {
                    const itemTitle = item.title || item.name || 'Untitled';
                    const itemYear = item.release_date ? new Date(item.release_date).getFullYear() : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : '');
                    return (
                      <li key={`${item.id}-${item.media_type}`}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionClick(item);
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-accent hover:text-accent-foreground transition-colors duration-150 flex items-center gap-3 text-sm"
                        >
                          <Image
                            src={getImageUrl(item.poster_path, 'w92')}
                            alt={itemTitle}
                            width={32}
                            height={48}
                            className="rounded object-cover aspect-[2/3]"
                            data-ai-hint="movie poster tv series poster"
                          />
                          <div className="flex-grow overflow-hidden">
                            <p className="truncate font-medium text-foreground">{itemTitle}</p>
                            {itemYear && <p className="text-xs text-muted-foreground">{itemYear}</p>}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
        )}
      </motion.div>
  )
}
