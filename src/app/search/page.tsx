import { searchMedia, getGenreMap } from '@/lib/tmdb';
import { MovieCard } from '@/components/movies/MovieCard';
import { PaginationControls } from '@/components/movies/PaginationControls';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Metadata } from 'next';

interface SearchPageProps {
  searchParams: {
    query?: string;
    page?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.query || "";
  if (query) {
    return {
      title: `Search results for "${query}" | Movista`,
      description: `Find movies and TV shows matching "${query}" on Movista.`,
    };
  }
  return {
    title: "Search | Movista",
    description: "Search for movies and TV shows on Movista.",
  };
}

async function SearchResults({ query, page }: { query: string, page: number }) {
  if (!query) {
    return <p className="text-center text-muted-foreground py-8">Please enter a search term to find movies or TV shows.</p>;
  }

  const [searchResults, movieGenres, tvGenres] = await Promise.all([
    searchMedia(query, page),
    getGenreMap('movie'),
    getGenreMap('tv')
  ]);

  if (searchResults.results.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No results found for &quot;{query}&quot;.</p>;
  }

  const getMediaType = (item: any): 'movie' | 'tv' => {
    return item.media_type === 'movie' || item.title ? 'movie' : 'tv';
  }

  return (
    <div>
      <h1 className="text-3xl font-headline font-semibold text-primary mb-6">
        Search Results for &quot;{query}&quot;
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {searchResults.results
          .filter(item => item.media_type === 'movie' || item.media_type === 'tv') // Filter out persons etc.
          .map((item) => {
            const mediaType = getMediaType(item);
            return (
              <MovieCard
                key={item.id}
                item={item}
                mediaType={mediaType}
                genres={mediaType === 'movie' ? movieGenres : tvGenres}
              />
            );
        })}
      </div>
      {searchResults.total_pages > 1 && (
        <PaginationControls
          currentPage={searchResults.page}
          totalPages={Math.min(searchResults.total_pages, 500)} // TMDB API limit
          basePath={`/search?query=${encodeURIComponent(query)}&page=`}
        />
      )}
    </div>
  );
}


export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query || '';
  const page = parseInt(searchParams.page || '1', 10);

  return (
    <Suspense fallback={<LoadingSpinner className="h-96" />}>
      <SearchResults query={query} page={page} />
    </Suspense>
  );
}
