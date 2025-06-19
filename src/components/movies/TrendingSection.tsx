import type { TMDBMediaItem } from '@/types/tmdb';
import { MovieCard } from './MovieCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight } from 'lucide-react';

interface TrendingSectionProps {
  title: string;
  items: TMDBMediaItem[];
  mediaType: 'movie' | 'tv';
  genres: Record<number, string>;
  viewAllLink?: string;
}

export function TrendingSection({ title, items, mediaType, genres, viewAllLink }: TrendingSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-headline font-semibold text-primary">{title}</h2>
        {viewAllLink && (
           <a href={viewAllLink} className="text-accent hover:text-accent/80 transition-colors flex items-center">
            View All <ChevronRight className="w-5 h-5 ml-1" />
          </a>
        )}
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-4 pb-4">
          {items.slice(0,10).map((item, index) => ( // Show top 10, with rank
            <MovieCard 
              key={item.id} 
              item={item} 
              mediaType={mediaType}
              genres={genres}
              rank={index + 1} 
              className="w-60 md:w-72 flex-shrink-0" // Fixed width for horizontal scroll items
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
