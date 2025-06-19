"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Search movies & TV shows...", className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  // To handle router object, particularly on initial render or if router is not ready.
  const currentPathname = typeof window !== 'undefined' ? window.location.pathname : '';


  useEffect(() => {
    // Update query state if URL changes (e.g. browser back/forward)
    // and we are not on the search page itself, to avoid clearing input when navigating search pages
    if (!currentPathname.startsWith('/search')) {
        setQuery(searchParams.get('query') || '');
    }
  }, [searchParams, currentPathname]);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    } else {
      if (currentPathname.startsWith('/search')) {
         router.push('/search'); // Clear search results if on search page and query is empty
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative w-full", className)}>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        className="h-12 pl-12 pr-4 rounded-lg border-2 border-input bg-card focus:border-primary focus:ring-primary text-card-foreground placeholder:text-muted-foreground text-base"
        aria-label="Search"
      />
      <button 
        type="submit" 
        aria-label="Submit search" 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
