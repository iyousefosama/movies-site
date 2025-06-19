
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

  const response = await fetch(url, { next: { revalidate: 3600 } }); 

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
  appendToResponse?: string 
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
  return fetchTMDB<TMDBPaginatedResponse<TMDBMediaItem>>('search/multi', { query, page, language, include_adult: includeAdult });
};

export const getGenres = async (mediaType: 'movie' | 'tv', language: string = 'en-US'): Promise<{ genres: TMDBGenre[] }> => {
  return fetchTMDB<{ genres: TMDBGenre[] }>(`genre/${mediaType}/list`, { language });
};

let movieGenreMapInstance: Record<number, string> | null = null;
let tvGenreMapInstance: Record<number, string> | null = null;

export const getGenreMap = async (mediaType: 'movie' | 'tv', language: string = 'en-US'): Promise<Record<number, string>> => {
  if (mediaType === 'movie' && movieGenreMapInstance) return movieGenreMapInstance;
  if (mediaType === 'tv' && tvGenreMapInstance) return tvGenreMapInstance;

  try {
    const { genres } = await getGenres(mediaType, language);
    const map = genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {} as Record<number, string>);

    if (mediaType === 'movie') movieGenreMapInstance = map;
    else tvGenreMapInstance = map;
    
    return map;
  } catch (error) {
    console.error(`Failed to get genre map for ${mediaType}:`, error);
    return {}; 
  }
};

export const discoverMoviesByGenreName = async (
  genreName: string,
  page: number = 1,
  language: string = 'en-US'
): Promise<TMDBPaginatedResponse<TMDBMovie>> => {
  const genreMap = await getGenreMap('movie', language);
  const genreId = Object.keys(genreMap).find(id => genreMap[Number(id)].toLowerCase() === genreName.toLowerCase());
  
  if (!genreId) {
    // Return empty results if genre name not found, or handle error as preferred
    return { page, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDB<TMDBPaginatedResponse<TMDBMovie>>('discover/movie', { 
    with_genres: genreId, 
    page, 
    language,
    sort_by: 'popularity.desc' 
  });
};

export const discoverTVShowsByGenreName = async (
  genreName: string,
  page: number = 1,
  language: string = 'en-US'
): Promise<TMDBPaginatedResponse<TMDBTVShow>> => {
  const genreMap = await getGenreMap('tv', language);
  const genreId = Object.keys(genreMap).find(id => genreMap[Number(id)].toLowerCase() === genreName.toLowerCase());

  if (!genreId) {
    return { page, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDB<TMDBPaginatedResponse<TMDBTVShow>>('discover/tv', { 
    with_genres: genreId, 
    page, 
    language,
    sort_by: 'popularity.desc'
  });
};

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return `https://placehold.co/500x750.png`; 
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getYouTubeThumbnailUrl = (videoKey: string): string => {
  return `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`;
};

export const getYouTubeEmbedUrl = (videoKey: string): string => {
  return `https://www.youtube.com/embed/${videoKey}`;
};
