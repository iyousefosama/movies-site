"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Tv, Film, Tag, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TMDBMediaItem, TMDBMovie, TMDBTVShow } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  item: TMDBMediaItem;
  mediaType: 'movie' | 'tv';
  genres?: Record<number, string>;
  rank?: number; // For trending section
  className?: string;
}

export function MovieCard({ item, mediaType, genres, rank, className }: MovieCardProps) {
  const title = mediaType === 'movie' ? (item as TMDBMovie).title : (item as TMDBTVShow).name;
  const releaseDate = mediaType === 'movie' ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const itemGenres = item.genre_ids && genres 
    ? item.genre_ids.slice(0, 2).map(id => genres[id]).filter(Boolean) 
    : [];

  const href = `/${mediaType}/${item.id}`;

  return (
    <motion.div
      className={cn("group relative rounded-lg overflow-hidden shadow-2xl bg-card transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-primary/40", className)}
      whileHover={{ scale: 1.05 }}
      layout // Enables smooth layout animations if items reorder
    >
      <Link href={href} className="block w-full h-full">
        <div className="relative aspect-[2/3] w-full">
          {rank && (
             <div className="absolute top-0 left-0 z-10 bg-primary text-primary-foreground font-bold text-2xl md:text-4xl p-2 md:p-3 flex items-center justify-center rounded-br-lg shadow-md min-w-[40px] md:min-w-[60px]">
              {rank}
            </div>
          )}
          <Image
            src={getImageUrl(item.poster_path, 'w500')}
            alt={title || 'Movie Poster'}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:brightness-75"
            data-ai-hint="movie poster"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="text-lg font-headline font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 mr-1 text-yellow-400" />
            <span>{item.vote_average.toFixed(1)}</span>
            <span className="mx-2">|</span>
            <span>{year}</span>
            <span className="mx-2">|</span>
            {mediaType === 'movie' ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
          </div>

          {/* Hidden by default, shown on hover */}
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-40 overflow-hidden">
            {itemGenres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                <Tag className="w-4 h-4 mr-1 text-accent self-center" />
                {itemGenres.map((genreName) => (
                  <Badge key={genreName} variant="secondary" className="text-xs bg-accent/20 text-accent-foreground border-accent/30">
                    {genreName}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground line-clamp-2">{item.overview}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
