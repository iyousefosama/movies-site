

import { getDetails, getImageUrl } from '@/lib/tmdb';
import type { TMDBTVShowDetails } from '@/types/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, CalendarDays, TvIcon, Languages, Users, Landmark, Tag as TagIcon, ExternalLink, Clapperboard } from 'lucide-react';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ClientMediaArea } from '@/components/movies/ClientMediaArea';
import { FavoriteButton } from '@/components/movies/FavoriteButton'; // Added


interface TVShowDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: TVShowDetailPageProps) {
  try {
    const tvShow = await getDetails('tv', params.id, 'en-US', 'videos,content_ratings') as TMDBTVShowDetails;
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

const DetailItem = ({ label, value, icon: Icon }: { label: string; value?: string | number | null; icon?: React.ElementType }) => {
  if (!value && typeof value !== 'number') return null;
  return (
    <div className="py-2">
      <dt className="text-sm font-medium text-muted-foreground flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2 text-accent" />}
        {label}
      </dt>
      <dd className="mt-1 text-base text-foreground/90">{String(value)}</dd>
    </div>
  );
};


async function TVShowDetailsContent({ tvShowId }: { tvShowId: string }) {
  let tvShow: TMDBTVShowDetails;
  try {
    tvShow = await getDetails('tv', tvShowId, 'en-US', 'videos,content_ratings') as TMDBTVShowDetails;
  } catch (error) {
    console.error("Failed to fetch TV show details:", error);
    notFound();
  }

  const trailer = tvShow.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  
  const releaseYear = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A';
  
  let certification = "N/A";
  const usRating = tvShow.content_ratings?.results.find(r => r.iso_3166_1 === "US");
  if (usRating && usRating.rating) {
    certification = usRating.rating;
  }
  
  return (
    <div className="py-8">
      <Card className="bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 md:p-8 space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-grow">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary flex items-center gap-3">
                  {tvShow.name}
                  <FavoriteButton item={tvShow} size="lg" className="text-primary/70 hover:text-primary" />
                </h1>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-lg">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>{tvShow.vote_average.toFixed(1)}/10</span>
                <span className="text-xs">({tvShow.vote_count.toLocaleString()} votes)</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{releaseYear}</span>
              {certification !== "N/A" && <><span>&bull;</span><span>{certification}</span></>}
              {tvShow.number_of_seasons && <><span>&bull;</span><span>{tvShow.number_of_seasons} Season{tvShow.number_of_seasons > 1 ? 's' : ''}</span></>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 p-4 md:p-8 pt-0">
            <div className="md:col-span-1 mb-6 md:mb-0">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-xl mx-auto md:mx-0 max-w-xs md:max-w-none">
                <Image
                  src={getImageUrl(tvShow.poster_path, 'w500')}
                  alt={`${tvShow.name} poster`}
                  fill
                  className="object-cover"
                  data-ai-hint="tv series poster"
                  priority
                />
              </div>
            </div>
            <div className="md:col-span-2">
                <ClientMediaArea trailerKey={trailer?.key} backdropPath={tvShow.backdrop_path} title={tvShow.name || "Media"} />
            </div>
          </div>
          
          <div className="p-6 md:p-8 pt-0 md:pt-4">
            {tvShow.genres && tvShow.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><TagIcon className="w-5 h-5 mr-2"/>Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map(genre => (
                    <Badge key={genre.id} variant="secondary" className="text-sm bg-accent/20 text-accent-foreground border-accent/30 px-3 py-1">{genre.name}</Badge>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-lg font-semibold mb-2 text-primary">Overview</h3>
            <p className="text-base text-foreground/90 leading-relaxed mb-6">{tvShow.overview}</p>
            
            {tvShow.homepage && (
              <div className="mb-8">
                <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={tvShow.homepage} target="_blank" rel="noopener noreferrer">
                    Visit Homepage <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}

            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 divide-y divide-border/50 sm:divide-y-0">
              <DetailItem label="First Aired" value={tvShow.first_air_date ? new Date(tvShow.first_air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} icon={CalendarDays} />
              <DetailItem label="Last Aired" value={tvShow.last_air_date ? new Date(tvShow.last_air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} icon={CalendarDays} />
              <DetailItem label="Seasons" value={tvShow.number_of_seasons} icon={TvIcon}/>
              <DetailItem label="Episodes" value={tvShow.number_of_episodes} icon={Clapperboard}/>
              <DetailItem label="Status" value={tvShow.status} icon={Users}/>
              <DetailItem label="Type" value={tvShow.type} icon={TvIcon}/>
              <DetailItem label="Original Language" value={tvShow.original_language?.toUpperCase()} icon={Languages}/>
              <DetailItem label="Production Countries" value={tvShow.production_countries.map(pc => pc.name).join(', ')} icon={Landmark} />
              {tvShow.tagline && <DetailItem label="Tagline" value={tvShow.tagline} icon={TagIcon}/>}
            </dl>

            {tvShow.networks && tvShow.networks.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-primary">Networks</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  {tvShow.networks.filter(n => n.logo_path).map(network => (
                    <div key={network.id} className="bg-background/50 p-3 rounded-lg shadow flex flex-col items-center text-center w-32 h-28 justify-between" title={network.name}>
                      <div className="relative w-24 h-12">
                        <Image 
                          src={getImageUrl(network.logo_path, 'w200')} 
                          alt={`${network.name} logo`} 
                          fill
                          className="object-contain filter dark:invert"
                          data-ai-hint="network logo"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground truncate w-full mt-2">{network.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
             {tvShow.production_companies && tvShow.production_companies.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-primary">Production Companies</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  {tvShow.production_companies.filter(pc => pc.logo_path).map(company => (
                    <div key={company.id} className="bg-background/50 p-3 rounded-lg shadow flex flex-col items-center text-center w-32 h-28 justify-between" title={company.name}>
                      <div className="relative w-24 h-12">
                        <Image 
                          src={getImageUrl(company.logo_path, 'w200')} 
                          alt={`${company.name} logo`} 
                          fill
                          className="object-contain"
                          data-ai-hint="company logo"
                         />
                      </div>
                      <p className="text-xs text-muted-foreground truncate w-full mt-2">{company.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TVShowDetailPage({ params }: TVShowDetailPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size={64} /></div>}>
      <TVShowDetailsContent tvShowId={params.id} />
    </Suspense>
  );
}
