import { Suspense } from "react";
import { getTrending, getPopular, getGenreMap, getNowPlaying } from "@/lib/tmdb";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestReleaseSection } from "@/components/home/LatestReleaseSection";
import { TopTrendingSection } from "@/components/home/TopTrendingSection";
import { SelectGenreSection } from "@/components/home/SelectGenreSection";
import { SuggestionsCTA } from "@/components/home/SuggestionsCTA";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const revalidate = 3600; // Revalidate data every hour

async function HomePageContent() {
  // Fetch data in parallel
  const [
    trendingMoviesData,
    nowPlayingData,
    popularMoviesData,
    movieGenres,
  ] = await Promise.all([
    getTrending("movie", "day"),
    getNowPlaying(1).catch(() => getPopular("movie", 1)),
    getPopular("movie", 1),
    getGenreMap("movie"),
  ]);

  // Combine top trending movies for the Hero carousel
  const heroItems = trendingMoviesData.results || [];
  // Latest theatrical and digital releases
  const latestItems = (nowPlayingData.results && nowPlayingData.results.length > 0)
    ? nowPlayingData.results
    : popularMoviesData.results || [];
  // Top trending items for the numbered ranking row
  const trendingItems = trendingMoviesData.results || [];

  return (
    <div className="w-full bg-[#070707] min-h-screen text-white overflow-x-hidden">
      {/* 1. Cinematic Hero Banner */}
      <HeroSection items={heroItems} genres={movieGenres} />

      {/* 2. LATEST RELEASE Row */}
      <LatestReleaseSection items={latestItems} genres={movieGenres} />

      {/* 3. TOP TRENDING Row with Giant Overlay Numbers (1, 2, 3, 4...) */}
      <TopTrendingSection items={trendingItems} genres={movieGenres} />

      {/* 4. SELECT GENRE Row with Vibrant Solid Blocks */}
      <SelectGenreSection />

      {/* 5. AI Recommendations CTA */}
      <SuggestionsCTA />
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
