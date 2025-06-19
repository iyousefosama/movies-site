"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Tv, Film, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TMDBMediaItem, TMDBMovie, TMDBTVShow } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import React from 'react'; // Import React for useState

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
  // const releaseDate = mediaType === 'movie' ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date;
  // const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  
  const itemFirstGenreName = item.genre_ids && genres && item.genre_ids.length > 0 ? genres[item.genre_ids[0]] : null;
  const itemGenres = item.genre_ids && genres 
    ? item.genre_ids.slice(0, 2).map(id => genres[id]).filter(Boolean) 
    : [];

  const href = `/${mediaType}/${item.id}`;
  const [isHovered, setIsHovered] = React.useState(false);

  const cardVariants = {
    rest: { scale: 1, boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 20px 25px -5px hsla(var(--primary)/0.4), 0px 10px 10px -5px hsla(var(--primary)/0.2)"
    }
  };
  
  const trendingCardVariants = {
    rest: { scale: 1, boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    hover: { 
      scale: 1.03, 
      boxShadow: "0px 15px 20px -5px hsla(var(--primary)/0.3), 0px 8px 8px -5px hsla(var(--primary)/0.15)"
    }
  };

  const detailsVariants = {
    hidden: { opacity: 0, height: 0, y: 10 },
    visible: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: "easeInOut" } }
  };
  
  const trendingTitleVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
  };


  if (variant === 'trending') {
    return (
      <motion.div
        className={cn("group relative rounded-lg  bg-card", className)}
        variants={trendingCardVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        layout
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Link href={href} className="block w-full h-full">
          <div className="relative aspect-[2/3] w-full">
            {rank && (
              <div 
                className="absolute -left-8 -bottom-1 z-10 text-[5rem] md:text-[6rem] lg:text-[7rem] font-extrabold text-white/10 group-hover:text-primary/20 transition-colors duration-300 select-none"
                style={{ WebkitTextStroke: `1px hsl(var(--border))`, paintOrder: 'stroke fill' }}
              >
                {rank}
              </div>
            )}
            <Image
              src={getImageUrl(item.poster_path, 'w342')}
              alt={title || 'Media Poster'}
              fill
              sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 15vw"
              className="object-cover transition-transform duration-300 group-hover:brightness-90"
              data-ai-hint="movie poster trending"
            />
             <AnimatePresence>
             {isHovered && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-2"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={trendingTitleVariants}
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {title}
                  </h3>
                </motion.div>
             )}
             </AnimatePresence>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn("group relative rounded-lg overflow-hidden bg-card", className)}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
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
          <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
          </AnimatePresence>
        </div>

        <div className="p-3 bg-card">
          <h3 className="text-base font-headline font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300 mb-1">
            {title}
          </h3>
          
          <div className="flex items-center text-xs text-muted-foreground space-x-1.5 mb-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span>{item.vote_average.toFixed(1)}</span>
            {itemFirstGenreName && (
              <>
                <span aria-hidden="true">&bull;</span>
                <span className="truncate">{itemFirstGenreName}</span>
              </>
            )}
            <span aria-hidden="true">&bull;</span>
            <span>{mediaType === 'movie' ? <Film className="inline w-3 h-3 mr-0.5"/> : <Tv className="inline w-3 h-3 mr-0.5" />} {mediaType === 'movie' ? 'Movie' : 'TV'}</span>
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                variants={detailsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                {itemGenres.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-1.5 items-center">
                    <Tag className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    {itemGenres.map((genreName) => (
                      <Badge key={genreName} variant="secondary" className="text-xs bg-accent/10 text-accent-foreground border-accent/20 px-1.5 py-0.5">
                        {genreName}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground/80 line-clamp-2">{item.overview}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>
    </motion.div>
  );
}
