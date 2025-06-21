
import { getTrending, getPopular, getGenreMap } from '@/lib/tmdb';
import { TrendingSection } from '@/components/movies/TrendingSection';
import { PopularGrid } from '@/components/movies/PopularGrid';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HeroSection } from '@/components/home/HeroSection';
import { SuggestionsCTA } from '@/components/home/SuggestionsCTA'; // Added import
import { Popcorn, Film } from "lucide-react";

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
      <main>
      <HeroSection/>
          <TrendingSection
              title="Trending"
              items={trendingMoviesData.results.slice(0, 10)}
              mediaType="movie"
              genres={movieGenres}
          />
          <PopularGrid
              title="Popular Movies"
              items={popularMoviesData.results.slice(0, 8)} // 2 rows of 4
              mediaType="movie"
              Icon={Popcorn}
              genres={movieGenres}
              basePath="/popular/movie/"
              showViewAllLink={true}
              showPagination={false}
          />
          <PopularGrid
              title="Popular TV Shows"
              items={popularTVData.results.slice(0, 8)} // 2 rows of 4
              mediaType="tv"
              Icon={Film}
              genres={tvGenres}
              basePath="/popular/tv/"
              showViewAllLink={true}
              showPagination={false}
          />
          <SuggestionsCTA /> {/* Added new CTA section */}
      </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner className="h-96" />}>
      <HomePageContent />
    </Suspense>
  );
}
