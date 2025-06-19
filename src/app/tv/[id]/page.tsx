import { getDetails, getImageUrl, getGenreMap } from '@/lib/tmdb';
import type { TMDBTVShowDetails } from '@/types/tmdb';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Star, CalendarDays, TvIcon, Languages, Users, Landmark, Tag as TagIcon } from 'lucide-react';
import { VideoPlayer } from '@/components/movies/VideoPlayer';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface TVShowDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: TVShowDetailPageProps) {
  try {
    const tvShow = await getDetails('tv', params.id) as TMDBTVShowDetails;
    return {
      title: `${tvShow.name} | Movista`,
      description: tvShow.overview,
    };
  } catch (error) {
    return {
      title: 'TV Show Not Found | Movista',
      description: 'The TV show you are looking for could not be found.',
    };
  }
}

async function TVShowDetailsContent({ tvShowId }: { tvShowId: string }) {
  let tvShow: TMDBTVShowDetails;
  try {
    tvShow = await getDetails('tv', tvShowId, 'en-US', 'videos') as TMDBTVShowDetails;
  } catch (error) {
    console.error("Failed to fetch TV show details:", error);
    notFound();
  }

  const trailer = tvShow.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  
  return (
    <div className="container mx-auto py-8 px-4">
      {tvShow.backdrop_path && (
        <div className="relative h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden mb-8 shadow-2xl">
          <Image
            src={getImageUrl(tvShow.backdrop_path, 'w1280')}
            alt={`${tvShow.name} backdrop`}
            fill
            className="object-cover"
            priority
            data-ai-hint="tv series backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 space-y-6">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={getImageUrl(tvShow.poster_path, 'w780')}
              alt={tvShow.name || 'TV Show Poster'}
              fill
              className="object-cover"
              data-ai-hint="tv series poster"
            />
          </div>
          {trailer && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Trailer</h3>
              <VideoPlayer videoKey={trailer.key} title={`${tvShow.name} Trailer`} />
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2">{tvShow.name}</h1>
          {tvShow.tagline && <p className="text-xl text-muted-foreground italic mb-6">&quot;{tvShow.tagline}&quot;</p>}
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center text-lg">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              <span>{tvShow.vote_average.toFixed(1)} ({tvShow.vote_count} votes)</span>
            </div>
            {tvShow.first_air_date && (
              <div className="flex items-center text-lg">
                <CalendarDays className="w-5 h-5 mr-2 text-accent" />
                <span>First Aired: {new Date(tvShow.first_air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
             {tvShow.last_air_date && (
              <div className="flex items-center text-lg">
                <CalendarDays className="w-5 h-5 mr-2 text-accent" />
                <span>Last Aired: {new Date(tvShow.last_air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-primary flex items-center"><TagIcon className="w-5 h-5 mr-2"/>Genres</h3>
            <div className="flex flex-wrap gap-2">
              {tvShow.genres.map(genre => (
                <Badge key={genre.id} variant="secondary" className="text-sm bg-accent/20 text-accent-foreground border-accent/30 px-3 py-1">{genre.name}</Badge>
              ))}
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-primary">Overview</h3>
          <p className="text-base text-foreground/90 leading-relaxed mb-8">{tvShow.overview}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InfoItem icon={Languages} label="Original Language" value={tvShow.original_language?.toUpperCase()} />
            <InfoItem icon={TvIcon} label="Seasons" value={tvShow.number_of_seasons} />
            <InfoItem icon={TvIcon} label="Episodes" value={tvShow.number_of_episodes} />
            <InfoItem icon={Users} label="Status" value={tvShow.status} />
            <InfoItem icon={Landmark} label="Production Countries" value={tvShow.production_countries.map(pc => pc.name).join(', ')} />
             <InfoItem icon={TvIcon} label="Type" value={tvShow.type} />
          </div>

          {tvShow.networks && tvShow.networks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Networks</h3>
              <div className="flex flex-wrap gap-4 items-center">
                {tvShow.networks.filter(n => n.logo_path).map(network => (
                  <div key={network.id} className="bg-card p-3 rounded-lg shadow flex flex-col items-center text-center w-32" title={network.name}>
                    <div className="relative w-24 h-12 mb-2">
                      <Image 
                        src={getImageUrl(network.logo_path, 'w200')} 
                        alt={`${network.name} logo`} 
                        fill
                        className="object-contain filter dark:invert" // Invert for dark mode if logos are dark
                        data-ai-hint="network logo"
                       />
                    </div>
                     <p className="text-xs text-muted-foreground truncate w-full">{network.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | undefined }) {
  if (!value || value === "N/A") return null;
  return (
    <div className="flex items-start">
      <Icon className="w-5 h-5 mr-3 mt-1 text-accent flex-shrink-0" />
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
        <p className="text-base text-foreground/90">{value}</p>
      </div>
    </div>
  );
}

export default function TVShowDetailPage({ params }: TVShowDetailPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
      <TVShowDetailsContent tvShowId={params.id} />
    </Suspense>
  );
}
