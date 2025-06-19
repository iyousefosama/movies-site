
"use client";

import type { FavoriteItem, TMDBMediaItem } from '@/types/tmdb';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number, mediaType: 'movie' | 'tv') => void;
  isFavorite: (id: number, mediaType: 'movie' | 'tv') => boolean;
  getLocalStoreMediaItem: (id: number, mediaType: 'movie' | 'tv') => FavoriteItem | undefined;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'movista-favorites';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites from local storage:", error);
        setFavorites([]); // Fallback to empty array on error
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites to local storage:", error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.find(fav => fav.id === item.id && fav.mediaType === item.mediaType)) {
        return [...prevFavorites, item];
      }
      return prevFavorites;
    });
  };

  const removeFavorite = (id: number, mediaType: 'movie' | 'tv') => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => !(fav.id === id && fav.mediaType === mediaType))
    );
  };

  const isFavorite = (id: number, mediaType: 'movie' | 'tv') => {
    return favorites.some((fav) => fav.id === id && fav.mediaType === mediaType);
  };
  
  const getLocalStoreMediaItem = (id: number, mediaType: 'movie' | 'tv'): FavoriteItem | undefined => {
    return favorites.find((fav) => fav.id === id && fav.mediaType === mediaType);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, getLocalStoreMediaItem }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
