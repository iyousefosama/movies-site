import type { TMDBMediaItem } from '@/types/tmdb';
import { MovieCard } from './MovieCard';
import { PaginationControls } from './PaginationControls';
import Link from 'next/link';
import { ChevronRight, type LucideIcon } from 'lucide-react';

interface PopularGridProps {
  title: string;
  items: TMDBMediaItem[];
  mediaType: 'movie' | 'tv';
  Icon: LucideIcon; // Add Icon prop for the icon to be used
  genres: Record<number, string>;
  currentPage?: number; // Make optional for homepage use
  totalPages?: number; // Make optional for homepage use
  basePath: string; // e.g., "/popular/movie"
  showPagination?: boolean;
  showViewAllLink?: boolean;
}

export function PopularGrid({
  title,
  items,
  mediaType,
  Icon,
  genres,
  currentPage,
  totalPages,
  basePath,
  showPagination = true,
  showViewAllLink = false,
}: PopularGridProps) {
  if (!items || items.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No {mediaType === 'movie' ? 'movies' : 'TV shows'} found.</p>;
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-headline font-semibold text-foreground">{title}</h2>
        </div>
        {showViewAllLink && basePath && (
          <Link href={`${basePath}1`} className="text-accent hover:text-accent/80 transition-colors flex items-center text-sm">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6"> {/* Changed to 4 columns */}
        {items.map((item) => (
          <MovieCard
            key={item.id}
            item={item}
            mediaType={mediaType}
            genres={genres}
            variant="default" // Ensure default variant for popular grid
          />
        ))}
      </div>
      {showPagination && currentPage && totalPages && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.min(totalPages, 500)} // TMDB API limit for pages
          basePath={basePath}
        />
      )}
    </section>
  );
}
