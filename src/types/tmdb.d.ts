
export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMedia {
  id: number;
  title?: string; // For movies
  name?: string; // For TV shows
  original_title?: string;
  original_name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date?: string; // For movies
  first_air_date?: string; // For TV shows
  genre_ids: number[];
  popularity: number;
  media_type?: 'movie' | 'tv' | 'person';
}

export interface TMDBMovie extends TMDBMedia {
  media_type: 'movie';
  title: string;
  original_title: string;
  release_date: string;
  adult?: boolean;
  video?: boolean;
}

export interface TMDBTVShow extends TMDBMedia {
  media_type: 'tv';
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country?: string[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string; // e.g., "YouTube"
  size: number;
  type: string; // e.g., "Trailer", "Teaser"
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  belongs_to_collection: null | object;
  budget: number;
  genres: TMDBGenre[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  revenue: number;
  runtime: number | null;
  spoken_languages: TMDBSpokenLanguage[];
  status: string; // "Rumored", "Planned", "In Production", "Post Production", "Released", "Canceled"
  tagline: string | null;
  videos?: { results: TMDBVideo[] };
}

export interface TMDBTVShowDetails extends TMDBTVShow {
  created_by?: Array<{ id: number; credit_id: string; name: string; gender: number; profile_path: string | null }>;
  episode_run_time?: number[];
  genres: TMDBGenre[];
  homepage: string | null;
  in_production?: boolean;
  languages?: string[];
  last_air_date?: string;
  last_episode_to_air?: object; // Define further if needed
  next_episode_to_air?: object | null; // Define further if needed
  networks?: TMDBProductionCompany[]; // Similar structure
  number_of_episodes?: number;
  number_of_seasons?: number;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  seasons?: Array<any>; // Define season structure if needed
  spoken_languages: TMDBSpokenLanguage[];
  status: string;
  tagline: string | null;
  type?: string; // e.g. "Scripted"
  videos?: { results: TMDBVideo[] };
}

export interface TMDBError {
  success?: boolean;
  status_code: number;
  status_message: string;
}

export type TMDBMediaItem = TMDBMovie | TMDBTVShow;
export type TMDBMediaDetails = TMDBMovieDetails | TMDBTVShowDetails;

export interface GenreMap {
  [id: number]: string;
}
