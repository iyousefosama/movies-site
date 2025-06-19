import type { TMDBMediaItem } from '@/types/tmdb';
import { MovieCard } from './MovieCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight } from 'lucide-react';
import Link from 'next/link'; // Import Link

interface TrendingSectionProps {
  title: string;
  items: TMDBMediaItem[];
  mediaType: 'movie' | 'tv'; // Keep for consistency, though image implies mixed or just movies
  genres: Record<number, string>;
  viewAllLink?: string;
}

export function TrendingSection({ title, items, mediaType, genres, viewAllLink }: TrendingSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mb-12" id='trending'>
      <div className="flex justify-center items-center mb-8 mt-16">
        <h2 className="text-3xl font-headline font-semibold text-foreground">{title}</h2>
        {viewAllLink && (
           <Link href={viewAllLink} className="text-accent hover:text-accent/80 transition-colors flex items-center text-sm">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex px-12 space-x-12 pb-4 mb-6">
          {items.map((item, index) => (
            <MovieCard 
              key={item.id} 
              item={item} 
              // Determine mediaType for each item if it's mixed, otherwise use passed prop
              mediaType={item.media_type === 'tv' ? 'tv' : 'movie'} 
              genres={genres}
              rank={index + 1} 
              variant="trending" // Use trending variant
              className="w-[150px] md:w-[180px] flex-shrink-0" // Adjusted width for trending cards
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
