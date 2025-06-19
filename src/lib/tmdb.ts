
import type { 
  TMDBPaginatedResponse, 
  TMDBMovie, 
  TMDBTVShow, 
  TMDBMovieDetails, 
  TMDBTVShowDetails, 
  TMDBMediaItem,
  TMDBError,
  TMDBGenre
} from '@/types/tmdb';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/';

if (!API_KEY) {
  console.warn("TMDB API Key is missing. Please set NEXT_PUBLIC_TMDB_API_KEY environment variable.");
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  if (!API_KEY) {
    throw new Error("TMDB API Key is missing.");
  }
  const urlParams = new URLSearchParams({
    api_key: API_KEY,
    ...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)])),
  });
  const url = `${BASE_URL}/${endpoint}?${urlParams.toString()}`;

  const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

  if (!response.ok) {
    const errorData: TMDBError = await response.json();
    console.error(`TMDB API Error (${response.status}) for ${url}: ${errorData.status_message}`);
    throw new Error(errorData.status_message || `Failed to fetch data from TMDB: ${response.status}`);
  }
  return response.json();
}

export const getTrending = async (
  mediaType: 'movie' | 'tv',
  timeWindow: 'day' | 'week' = 'day',
  page: number = 1,
  language: string = 'en-US'
): Promise<TMDBPaginatedResponse<TMDBMediaItem>> => {
  return fetchTMDB<TMDBPaginatedResponse<TMDBMediaItem>>(`trending/${mediaType}/${timeWindow}`, { page, language });
};

export const getPopular = async (
  mediaType: 'movie' | 'tv',
  page: number = 1,
  language: string = 'en-US'
): Promise<TMDBPaginatedResponse<TMDBMediaItem>> => {
  return fetchTMDB<TMDBPaginatedResponse<TMDBMediaItem>>(`${mediaType}/popular`, { page, language });
};

export const getDetails = async (
  mediaType: 'movie' | 'tv',
  id: string | number,
  language: string = 'en-US',
  appendToResponse?: string // e.g., 'videos,images,credits,release_dates,content_ratings'
): Promise<TMDBMovieDetails | TMDBTVShowDetails> => {
  const params: Record<string, string | number> = { language };
  if (appendToResponse) {
    params.append_to_response = appendToResponse;
  }
  if (mediaType === 'movie') {
    return fetchTMDB<TMDBMovieDetails>(`movie/${id}`, params);
  }
  return fetchTMDB<TMDBTVShowDetails>(`tv/${id}`, params);
};

export const searchMedia = async (
  query: string,
  page: number = 1,
  language: string = 'en-US',
  includeAdult: boolean = false,
): Promise<TMDBPaginatedResponse<TMDBMediaItem>> => {
  // Using 'multi' search to find both movies and TV shows
  return fetchTMDB<TMDBPaginatedResponse<TMDBMediaItem>>('search/multi', { query, page, language, include_adult: includeAdult });
};

export const getGenres = async (mediaType: 'movie' | 'tv', language: string = 'en-US'): Promise<{ genres: TMDBGenre[] }> => {
  return fetchTMDB<{ genres: TMDBGenre[] }>(`genre/${mediaType}/list`, { language });
};

// Helper to create a genre map
let movieGenreMap: Record<number, string> | null = null;
let tvGenreMap: Record<number, string> | null = null;

export const getGenreMap = async (mediaType: 'movie' | 'tv', language: string = 'en-US'): Promise<Record<number, string>> => {
  if (mediaType === 'movie' && movieGenreMap) return movieGenreMap;
  if (mediaType === 'tv' && tvGenreMap) return tvGenreMap;

  try {
    const { genres } = await getGenres(mediaType, language);
    const map = genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {} as Record<number, string>);

    if (mediaType === 'movie') movieGenreMap = map;
    else tvGenreMap = map;
    
    return map;
  } catch (error) {
    console.error(`Failed to get genre map for ${mediaType}:`, error);
    return {}; // Return empty map on error
  }
};

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return `https://placehold.co/500x750.png?text=No+Image`; // Placeholder for missing images
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getYouTubeThumbnailUrl = (videoKey: string): string => {
  return `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`;
};

export const getYouTubeEmbedUrl = (videoKey: string): string => {
  return `https://www.youtube.com/embed/${videoKey}`;
};
