
"use client"; 

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchMedia, getGenreMap, discoverMoviesByGenreName, discoverTVShowsByGenreName } from '@/lib/tmdb';
import type { TMDBMediaItem } from '@/types/tmdb';
import { MovieCard } from '@/components/movies/MovieCard';
import { PaginationControls } from '@/components/movies/PaginationControls';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SearchX } from 'lucide-react';

interface SearchResultsData {
  results: TMDBMediaItem[];
  totalPages: number;
  currentPage: number;
  totalResults: number;
}

type SortBy = "relevance" | "title" | "release_date" | "vote_average";
type SortOrder = "asc" | "desc";

function SearchResultsDisplay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query') || '';
  const genreQuery = searchParams.get('genre_query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchResults, setSearchResults] = useState<SearchResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movieGenres, setMovieGenres] = useState<Record<number, string>>({});
  const [tvGenres, setTvGenres] = useState<Record<number, string>>({});

  const [sortBy, setSortBy] = useState<SortBy>("relevance");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        let resultsData;
        const [movieGenresMap, tvGenresMap] = await Promise.all([
          getGenreMap('movie'),
          getGenreMap('tv')
        ]);
        setMovieGenres(movieGenresMap);
        setTvGenres(tvGenresMap);

        if (genreQuery) {
          // Fetch by genre
          const [movieGenreResults, tvGenreResults] = await Promise.all([
            discoverMoviesByGenreName(genreQuery, page),
            discoverTVShowsByGenreName(genreQuery, page)
          ]);
          
          const combinedResults = [
            ...movieGenreResults.results.map(item => ({ ...item, media_type: 'movie' as const })),
            ...tvGenreResults.results.map(item => ({ ...item, media_type: 'tv' as const }))
          ];
          
          // Simple merge, TMDB discover is per media type so less risk of actual duplicates by ID.
          // Sort combined results by popularity by default as discover endpoints do.
          combinedResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));


          // For pagination, we might need a more sophisticated way if results are very different
          // For now, use the larger total_pages and total_results, or sum them.
          // Let's assume for simplicity, we can take max total_pages and sum total_results
          // This might not be perfectly accurate for combined pagination display.
          const totalPages = Math.max(movieGenreResults.total_pages, tvGenreResults.total_pages);
          const totalResults = movieGenreResults.total_results + tvGenreResults.total_results;

          resultsData = {
            results: combinedResults,
            total_pages: totalPages,
            page: page,
            total_results: totalResults,
          };

        } else if (query) {
          // Fetch by search query
          resultsData = await searchMedia(query, page);
        } else {
          setSearchResults(null);
          setIsLoading(false);
          return;
        }

        setSearchResults({
          results: resultsData.results,
          totalPages: resultsData.total_pages,
          currentPage: resultsData.page,
          totalResults: resultsData.total_results,
        });

      } catch (err) {
        console.error("Search page error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch search results.");
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [query, genreQuery, page]);

  const sortedAndFilteredResults = useMemo(() => {
    if (!searchResults?.results) return [];

    const filtered = searchResults.results.filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path);

    if (sortBy === "relevance" && !genreQuery) { 
      return filtered;
    }
    if (sortBy === "relevance" && genreQuery) { // "discover" is already sorted by popularity, treat as relevance
        return filtered;
    }


    return [...filtered].sort((a, b) => {
      let valA: string | number | Date = 0;
      let valB: string | number | Date = 0;

      switch (sortBy) {
        case "title":
          valA = (a.title || a.name || "").toLowerCase();
          valB = (b.title || b.name || "").toLowerCase();
          break;
        case "release_date":
          valA = new Date(a.release_date || a.first_air_date || "1900-01-01").getTime();
          valB = new Date(b.release_date || b.first_air_date || "1900-01-01").getTime();
          break;
        case "vote_average":
          valA = a.vote_average || 0;
          valB = b.vote_average || 0;
          break;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [searchResults, sortBy, sortOrder, genreQuery]);

  if (isLoading) {
    return <LoadingSpinner className="h-96" />;
  }

  if (error) {
    return <Alert variant="destructive" className="my-8">
      <SearchX className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>;
  }
  
  if (!query && !genreQuery) {
    return <p className="text-center text-muted-foreground py-8">Please enter a search term or select a genre to find movies or TV shows.</p>;
  }

  if (!searchResults || sortedAndFilteredResults.length === 0 && searchResults.totalResults === 0) {
    return <p className="text-center text-muted-foreground py-8">No results found for &quot;{query || genreQuery}&quot;.</p>;
  }
  
  const getMediaType = (item: TMDBMediaItem): 'movie' | 'tv' => {
    return item.media_type === 'movie' || item.title ? 'movie' : 'tv';
  }

  const pageTitle = genreQuery 
    ? `Results for Genre: "${genreQuery}"` 
    : `Search Results for "${query}"`;

  const basePath = genreQuery 
    ? `/search?genre_query=${encodeURIComponent(genreQuery)}&page=` 
    : `/search?query=${encodeURIComponent(query)}&page=`;


  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-headline font-semibold text-primary">
          {pageTitle}
          {searchResults && searchResults.totalResults > 0 && (
            <span className="text-sm text-muted-foreground ml-2">({searchResults.totalResults} found)</span>
          )}
        </h1>
        {sortedAndFilteredResults.length > 0 && (
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="sort-by" className="text-sm text-muted-foreground">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                <SelectTrigger id="sort-by" className="w-[150px] h-9 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="release_date">Release Date</SelectItem>
                  <SelectItem value="vote_average">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)} disabled={sortBy === "relevance" && !genreQuery}>
                <SelectTrigger id="sort-order" className="w-[120px] h-9 text-sm">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {sortedAndFilteredResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {sortedAndFilteredResults.map((item) => {
              const mediaType = getMediaType(item);
              return (
                <MovieCard
                  key={`${item.id}-${item.media_type || mediaType}`} // Ensure unique key
                  item={item}
                  mediaType={mediaType}
                  genres={mediaType === 'movie' ? movieGenres : tvGenres}
                />
              );
          })}
        </div>
      ) : (
         <p className="text-center text-muted-foreground py-8">No displayable results found for &quot;{query || genreQuery}&quot; after filtering.</p>
      )}

      {searchResults && searchResults.totalPages > 1 && (
        <PaginationControls
          currentPage={searchResults.currentPage}
          totalPages={Math.min(searchResults.totalPages, 500)} 
          basePath={basePath}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="h-96" />}>
      <SearchResultsDisplay />
    </Suspense>
  );
}
