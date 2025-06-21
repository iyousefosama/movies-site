import { getPopular, getGenreMap } from '@/lib/tmdb';
import { PopularGrid } from '@/components/movies/PopularGrid';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Film, Popcorn, LucideIcon } from 'lucide-react';

interface PopularPageProps {
  params: Promise<{
    mediaType: string;
    page: string;
  }>;
}

export async function generateMetadata({ params }: PopularPageProps) {
  const resolvedParams = await params;
  const mediaType = resolvedParams.mediaType === 'movie' ? 'Movies' : resolvedParams.mediaType === 'tv' ? 'TV Shows' : '';
  const pageNumber = parseInt(resolvedParams.page, 10);
  if (!mediaType || isNaN(pageNumber)) {
    return { title: 'Popular Content - Movista' };
  }
  return {
    title: `Popular ${mediaType} - Page ${pageNumber} | Movista`,
    description: `Discover popular ${mediaType.toLowerCase()} on Movista, page ${pageNumber}.`,
  };
}

async function PopularPageContent({ params }: PopularPageProps) {
  const resolvedParams = await params;
  const { mediaType, page: pageStr } = resolvedParams;
  const page = parseInt(pageStr, 10);

  if ((mediaType !== 'movie' && mediaType !== 'tv') || isNaN(page) || page < 1) {
    notFound();
  }

  const [popularData, genres] = await Promise.all([
    getPopular(mediaType as 'movie' | 'tv', page),
    getGenreMap(mediaType as 'movie' | 'tv')
  ]);

  if (!popularData.results.length && page > 1) {
     // If a page beyond the last page is requested, TMDB might return empty results.
     // Redirect to last valid page or show not found. For simplicity, show not found.
     // A more robust solution would redirect to totalPages if page > totalPages.
     notFound();
  }
  
  const title = mediaType === 'movie' ? "Popular Movies" : "Popular TV Shows";
  const Icon = mediaType === 'movie' ? Popcorn : Film;

  return (
    <PopularGrid
      title={`${title} - Page ${page}`}
      items={popularData.results}
      mediaType={mediaType as 'movie' | 'tv'}
      genres={genres}
      currentPage={page}
      Icon={Icon}
      totalPages={popularData.total_pages}
      basePath={`/popular/${mediaType}/`}
    />
  );
}

export default function PopularPage({ params }: PopularPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner className="h-96" />}>
      <PopularPageContent params={params} />
    </Suspense>
  );
}

// Optional: If you want to statically generate some popular pages
// export async function generateStaticParams() {
//   const mediaTypes = ['movie', 'tv'];
//   const paths = [];
//   for (const type of mediaTypes) {
//     for (let i = 1; i <= 5; i++) { // Generate first 5 pages
//       paths.push({ mediaType: type, page: i.toString() });
//     }
//   }
//   return paths;
// }
