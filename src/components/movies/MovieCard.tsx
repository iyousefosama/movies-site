"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Tv, Film, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TMDBMediaItem, TMDBMovie, TMDBTVShow } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  item: TMDBMediaItem;
  mediaType: 'movie' | 'tv';
  genres?: Record<number, string>;
  rank?: number;
  className?: string;
  variant?: 'default' | 'trending';
}

export function MovieCard({ item, mediaType, genres, rank, className, variant = 'default' }: MovieCardProps) {
  const title = mediaType === 'movie' ? (item as TMDBMovie).title : (item as TMDBTVShow).name;
  const releaseDate = mediaType === 'movie' ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  
  const itemFirstGenreName = item.genre_ids && genres && item.genre_ids.length > 0 ? genres[item.genre_ids[0]] : null;
  const itemGenres = item.genre_ids && genres 
    ? item.genre_ids.slice(0, 2).map(id => genres[id]).filter(Boolean) 
    : [];

  const href = `/${mediaType}/${item.id}`;

  if (variant === 'trending') {
    return (
      <motion.div
        className={cn("group relative rounded-lg overflow-hidden shadow-xl bg-card transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-primary/40", className)}
        whileHover={{ scale: 1.03 }}
        layout
      >
        <Link href={href} className="block w-full h-full">
          <div className="relative aspect-[2/3] w-full">
            {rank && (
              <div 
                className="absolute -left-4 -bottom-2 z-10 text-[6rem] md:text-[8rem] lg:text-[10rem] font-extrabold text-white/20 group-hover:text-primary/30 transition-colors duration-300"
                style={{ WebkitTextStroke: `2px hsl(var(--border))`, paintOrder: 'stroke fill' }}
              >
                {rank}
              </div>
            )}
            <Image
              src={getImageUrl(item.poster_path, 'w342')} // Smaller size for trending cards if they are compact
              alt={title || 'Media Poster'}
              fill
              sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 15vw"
              className="object-cover transition-transform duration-300 group-hover:brightness-90"
              data-ai-hint="movie poster trending"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
              <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Default card variant (for Popular sections, search results etc.)
  return (
    <motion.div
      className={cn("group relative rounded-lg overflow-hidden shadow-2xl bg-card transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-primary/40", className)}
      whileHover={{ scale: 1.05 }}
      layout
    >
      <Link href={href} className="block w-full h-full">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={getImageUrl(item.poster_path, 'w500')}
            alt={title || 'Media Poster'}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:brightness-75"
            data-ai-hint="movie poster popular"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-3 bg-card"> {/* Changed from absolute positioning to be part of the card flow */}
          <h3 className="text-base font-headline font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300 mb-1">
            {title}
          </h3>
          
          <div className="flex items-center text-xs text-muted-foreground space-x-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span>{item.vote_average.toFixed(1)}</span>
            {itemFirstGenreName && (
              <>
                <span aria-hidden="true">&bull;</span>
                <span className="truncate">{itemFirstGenreName}</span>
              </>
            )}
            <span aria-hidden="true">&bull;</span>
            <span>{mediaType === 'movie' ? 'Movie' : 'TV'}</span>
          </div>

          {/* Hidden by default, shown on hover for more details */}
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-40 overflow-hidden">
            {itemGenres.length > 1 && ( // Show more genres on hover if available
              <div className="flex flex-wrap gap-1 mb-1">
                <Tag className="w-3.5 h-3.5 mr-0.5 text-accent self-center" />
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
