import { getTrending, getPopular, getGenreMap } from '@/lib/tmdb';
import { TrendingSection } from '@/components/movies/TrendingSection';
import { PopularGrid } from '@/components/movies/PopularGrid';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const revalidate = 3600; // Revalidate data every hour

async function HomePageContent() {
  // Fetch data in parallel
  const [
    trendingMoviesData,
    trendingTVData,
    popularMoviesData,
    popularTVData,
    movieGenres,
    tvGenres
  ] = await Promise.all([
    getTrending('movie', 'day'),
    getTrending('tv', 'day'),
    getPopular('movie', 1),
    getPopular('tv', 1),
    getGenreMap('movie'),
    getGenreMap('tv')
  ]);

  return (
    <div className="space-y-12">
      <TrendingSection 
        title="🔥 Trending Movies" 
        items={trendingMoviesData.results} 
        mediaType="movie"
        genres={movieGenres}
        viewAllLink="/popular/movie/1" 
      />
      <TrendingSection 
        title="📺 Trending TV Shows" 
        items={trendingTVData.results} 
        mediaType="tv"
        genres={tvGenres}
        viewAllLink="/popular/tv/1"
      />
      
      <PopularGrid 
        title="🌟 Popular Movies"
        items={popularMoviesData.results}
        mediaType="movie"
        genres={movieGenres}
        currentPage={1}
        totalPages={popularMoviesData.total_pages}
        basePath="/popular/movie/"
      />

      <PopularGrid 
        title="🌟 Popular TV Shows"
        items={popularTVData.results}
        mediaType="tv"
        genres={tvGenres}
        currentPage={1}
        totalPages={popularTVData.total_pages}
        basePath="/popular/tv/"
      />
    </div>
  );
}


export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner className="h-96" />}>
      <HomePageContent />
    </Suspense>
  );
}
