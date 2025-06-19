"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    // Update query state if URL changes (e.g. browser back/forward)
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    } else {
      // If query is empty, maybe navigate to home or clear search results.
      // For now, if on search page and query becomes empty, it will show empty results.
      // If not on search page, it won't do anything.
      if (pathname.startsWith('/search')) {
         router.push('/search');
      }
    }
  };

  // To handle router object, particularly on initial render or if router is not ready.
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';


  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        type="search"
        placeholder="Search movies & TV shows..."
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        className="h-10 pl-10 pr-4 rounded-full border-2 border-primary/50 focus:border-primary focus:ring-primary bg-card text-card-foreground placeholder:text-muted-foreground"
        aria-label="Search movies and TV shows"
      />
      <button type="submit" aria-label="Submit search" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/80 hover:text-primary">
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
