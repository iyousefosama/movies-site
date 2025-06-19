"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Search movies & TV shows...", className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  const currentPathname = typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
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
         router.push('/search'); 
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSearch} 
      className={cn("relative w-full", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }} // Add a slight delay if part of a larger animation sequence
    >
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        className="h-12 pl-12 pr-4 rounded-lg border-2 border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground text-base shadow-md focus:shadow-primary/30 transition-all duration-300"
        aria-label="Search"
      />
      <motion.button 
        type="submit" 
        aria-label="Submit search" 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Search className="h-5 w-5" />
      </motion.button>
    </motion.form>
  );
}
