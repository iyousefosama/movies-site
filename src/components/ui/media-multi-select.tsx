"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, Loader2, Film, Tv } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { searchMedia, getImageUrl } from "@/lib/tmdb";
import type { TMDBMediaItem } from "@/types/tmdb";

export interface MediaMultiSelectOption {
  value: string; // "Title (Year)"
  label: string; // "Title (Year)"
  id: number;
  type: 'movie' | 'tv';
  posterPath?: string | null;
}

interface MediaMultiSelectProps {
  selected: string[]; // Array of "Title (Year)"
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
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


export function MediaMultiSelect({
  selected,
  onChange,
  placeholder = "Search and select movies/shows...",
  className,
  triggerClassName,
}: MediaMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<MediaMultiSelectOption[]>([]);

  const fetchSuggestions = React.useCallback(
    debounce(async (query: string) => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const results = await searchMedia(query, 1);
        const mappedSuggestions: MediaMultiSelectOption[] = results.results
          .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && (item.title || item.name))
          .map(item => {
            const title = item.title || item.name || "Unknown";
            const year = item.release_date ? new Date(item.release_date).getFullYear() : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : '');
            const label = year ? `${title} (${year})` : title;
            return {
              value: label,
              label: label,
              id: item.id,
              type: item.media_type as 'movie' | 'tv',
              posterPath: item.poster_path,
            };
          })
          .slice(0, 10); // Limit suggestions
        setSuggestions(mappedSuggestions);
      } catch (error) {
        console.error("Failed to fetch media suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500), // 500ms debounce
    []
  );

  React.useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [searchQuery, fetchSuggestions]);


  const handleSelect = (optionValue: string) => {
    if (selected.includes(optionValue)) {
      onChange(selected.filter((item) => item !== optionValue));
    } else {
      onChange([...selected, optionValue]);
    }
    setSearchQuery(""); // Clear search input after selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-10 py-2", triggerClassName)}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1 flex-grow">
            {selected.length > 0 ? (
              selected.map((itemValue) => (
                <Badge
                  key={itemValue}
                  variant="secondary"
                  className="mr-1 mb-1"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleSelect(itemValue);
                  }}
                >
                  {itemValue}
                  <X className="ml-1 h-3 w-3 cursor-pointer" />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[var(--radix-popover-trigger-width)] p-0", className)} align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search movies or TV shows..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-10"
          />
          <CommandList>
            {isLoading && (
              <div className="p-2 text-center text-sm text-muted-foreground flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </div>
            )}
            {!isLoading && suggestions.length === 0 && searchQuery.length >= 2 && (
                 <CommandEmpty>No results found for "{searchQuery}".</CommandEmpty>
            )}
            {!isLoading && searchQuery.length < 2 && !selected.length && (
                 <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
            )}
            <CommandGroup>
              {suggestions.map((option) => (
                <CommandItem
                  key={`${option.id}-${option.type}`}
                  value={option.value} 
                  onSelect={() => {
                    handleSelect(option.value);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="w-10 h-15 flex-shrink-0 relative">
                    <img 
                        src={getImageUrl(option.posterPath ?? null, 'w92')} 
                        alt={option.label} 
                        width={40} 
                        height={60} 
                        className="rounded object-cover w-10 h-15"
                        loading="lazy"
                        data-ai-hint="movie poster tv series poster"
                    />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <span className="truncate block">{option.label}</span>
                    <span className="text-xs text-muted-foreground flex items-center">
                        {option.type === 'movie' ? <Film className="w-3 h-3 mr-1" /> : <Tv className="w-3 h-3 mr-1" />}
                        {option.type === 'movie' ? 'Movie' : 'TV Show'}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Single-select version for 'Last movie I liked'
export function MediaSingleSelect({
  selected,
  onChange,
  placeholder = "Search and select a movie/show...",
  className,
  triggerClassName,
}: {
  selected: string | null;
  onChange: (selected: string | null) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<MediaMultiSelectOption[]>([]);

  const fetchSuggestions = React.useCallback(
    debounce(async (query: string) => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const results = await searchMedia(query, 1);
        const mappedSuggestions: MediaMultiSelectOption[] = results.results
          .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && (item.title || item.name))
          .map(item => {
            const title = item.title || item.name || "Unknown";
            const year = item.release_date ? new Date(item.release_date).getFullYear() : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : '');
            const label = year ? `${title} (${year})` : title;
            return {
              value: label,
              label: label,
              id: item.id,
              type: item.media_type as 'movie' | 'tv',
              posterPath: item.poster_path,
            };
          })
          .slice(0, 10);
        setSuggestions(mappedSuggestions);
      } catch (error) {
        console.error("Failed to fetch media suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  React.useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [searchQuery, fetchSuggestions]);

  const handleSelect = (optionValue: string) => {
    if (selected === optionValue) {
      onChange(null);
    } else {
      onChange(optionValue);
    }
    setSearchQuery("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-10 py-2", triggerClassName)}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1 flex-grow">
            {selected ? (
              <Badge
                variant="secondary"
                className="mr-1 mb-1"
                onClick={e => {
                  e.stopPropagation();
                  handleSelect(selected);
                }}
              >
                {selected}
                <X className="ml-1 h-3 w-3 cursor-pointer" />
              </Badge>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[var(--radix-popover-trigger-width)] p-0", className)} align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search movies or TV shows..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-10"
          />
          <CommandList>
            {isLoading && (
              <div className="p-2 text-center text-sm text-muted-foreground flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </div>
            )}
            {!isLoading && suggestions.length === 0 && searchQuery.length >= 2 && (
              <CommandEmpty>No results found for "{searchQuery}".</CommandEmpty>
            )}
            {!isLoading && searchQuery.length < 2 && !selected && (
              <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
            )}
            <CommandGroup>
              {suggestions.map(option => (
                <CommandItem
                  key={`${option.id}-${option.type}`}
                  value={option.value}
                  onSelect={() => {
                    handleSelect(option.value);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="w-10 h-15 flex-shrink-0 relative">
                    <img
                      src={getImageUrl(option.posterPath ?? null, 'w92')}
                      alt={option.label}
                      width={40}
                      height={60}
                      className="rounded object-cover w-10 h-15"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <span className="truncate block">{option.label}</span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      {option.type === 'movie' ? <Film className="w-3 h-3 mr-1" /> : <Tv className="w-3 h-3 mr-1" />}
                      {option.type === 'movie' ? 'Movie' : 'TV Show'}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Optionally, export as LikedMovieSingleSelect for clarity
export { MediaSingleSelect as LikedMovieSingleSelect };
