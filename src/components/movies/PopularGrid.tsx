import type { TMDBMediaItem } from '@/types/tmdb';
import { MovieCard } from './MovieCard';
import { PaginationControls } from './PaginationControls';

interface PopularGridProps {
  title?: string;
  items: TMDBMediaItem[];
  mediaType: 'movie' | 'tv';
  genres: Record<number, string>;
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., "/popular/movie"
}

export function PopularGrid({ title, items, mediaType, genres, currentPage, totalPages, basePath }: PopularGridProps) {
  if (!items || items.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No {mediaType === 'movie' ? 'movies' : 'TV shows'} found.</p>;
  }

  return (
    <section className="mb-12">
      {title && <h2 className="text-3xl font-headline font-semibold text-primary mb-6">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {items.map((item) => (
          <MovieCard key={item.id} item={item} mediaType={mediaType} genres={genres} />
        ))}
      </div>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.min(totalPages, 500)} // TMDB API limit for pages
          basePath={basePath}
        />
      )}
    </section>
  );
}
