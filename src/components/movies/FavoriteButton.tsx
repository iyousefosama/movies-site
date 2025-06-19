
"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/context/FavoritesContext';
import type { TMDBMediaItem, FavoriteItem } from '@/types/tmdb';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  item: TMDBMediaItem; // Use TMDBMediaItem for broader compatibility
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
}

export function FavoriteButton({ item, className, size = "icon" }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  if (!item || item.id === undefined || item.media_type === undefined) {
    // console.warn("FavoriteButton: Item or critical item properties are undefined", item);
    return null; 
  }
  
  const mediaType = item.media_type === 'movie' ? 'movie' : 'tv';
  const title = item.title || item.name || "Untitled";
  const releaseDate = item.release_date || (item as any).first_air_date;


  const favoriteItem: FavoriteItem = {
    id: item.id,
    mediaType: mediaType,
    title: title,
    posterPath: item.poster_path,
    overview: item.overview,
    voteAverage: item.vote_average,
    genreIds: item.genre_ids || [],
    releaseDate: mediaType === 'movie' ? releaseDate : undefined,
    firstAirDate: mediaType === 'tv' ? releaseDate : undefined,
  };

  const isCurrentlyFavorite = isFavorite(item.id, mediaType);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if on a card link
    e.stopPropagation();
    if (isCurrentlyFavorite) {
      removeFavorite(item.id, mediaType);
    } else {
      addFavorite(favoriteItem);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        "p-1.5 rounded-full hover:bg-primary/20 transition-colors duration-200",
        isCurrentlyFavorite ? "text-primary" : "text-muted-foreground hover:text-primary",
        className
      )}
      onClick={handleToggleFavorite}
      aria-label={isCurrentlyFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("w-5 h-5", isCurrentlyFavorite && "fill-current")} />
    </Button>
  );
}
