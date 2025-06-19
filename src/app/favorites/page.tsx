
"use client";

import { useFavorites } from '@/context/FavoritesContext';
import { MovieCard } from '@/components/movies/MovieCard';
import { getGenreMap } from '@/lib/tmdb'; // Assuming you need genres for MovieCard
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HeartCrack } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [movieGenres, setMovieGenres] = useState<Record<number, string>>({});
  const [tvGenres, setTvGenres] = useState<Record<number, string>>({});
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);

  useEffect(() => {
    async function fetchGenreMaps() {
      try {
        const [movieMap, tvMap] = await Promise.all([
          getGenreMap('movie'),
          getGenreMap('tv'),
        ]);
        setMovieGenres(movieMap);
        setTvGenres(tvMap);
      } catch (error) {
        console.error("Failed to load genre maps for favorites page:", error);
      } finally {
        setIsLoadingGenres(false);
      }
    }
    fetchGenreMaps();
  }, []);

  if (isLoadingGenres) {
    return <LoadingSpinner className="h-96" />;
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <HeartCrack className="w-24 h-24 text-muted-foreground mx-auto mb-8" />
        <h1 className="text-3xl font-bold text-foreground mb-4">No Favorites Yet</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Start exploring and add some movies or TV shows to your favorites!
        </p>
      </div>
    );
  }
  
  // Filter out items that might be null or undefined from local storage if any corruption occurred
  const validFavorites = favorites.filter(item => item && item.id && item.mediaType && item.title);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-headline font-semibold text-primary mb-8">Your Favorites</h1>
      {validFavorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {validFavorites.map((item) => {
            // Reconstruct a partial TMDBMediaItem for MovieCard from FavoriteItem
            const mediaItemForCard = {
              id: item.id,
              title: item.mediaType === 'movie' ? item.title : undefined,
              name: item.mediaType === 'tv' ? item.title : undefined,
              poster_path: item.posterPath,
              backdrop_path: null, // Not stored, not essential for card
              overview: item.overview,
              vote_average: item.voteAverage,
              vote_count: 0, // Not stored
              release_date: item.mediaType === 'movie' ? item.releaseDate : undefined,
              first_air_date: item.mediaType === 'tv' ? item.firstAirDate : undefined,
              genre_ids: item.genreIds,
              popularity: 0, // Not stored
              media_type: item.mediaType,
            };
            return (
              <MovieCard
                key={`${item.id}-${item.mediaType}`}
                item={mediaItemForCard as any} // Cast as any because we are reconstructing
                mediaType={item.mediaType}
                genres={item.mediaType === 'movie' ? movieGenres : tvGenres}
              />
            );
          })}
        </div>
      ) : (
         <div className="container mx-auto px-4 py-16 text-center">
            <HeartCrack className="w-24 h-24 text-muted-foreground mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-foreground mb-4">No Valid Favorites Found</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              It seems there was an issue loading your favorites or you haven't added any yet.
            </p>
        </div>
      )}
    </div>
  );
}
