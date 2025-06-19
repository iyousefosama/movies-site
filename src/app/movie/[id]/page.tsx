
import { getDetails, getImageUrl } from '@/lib/tmdb';
import type { TMDBMovieDetails } from '@/types/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, CalendarDays, Globe, Languages, DollarSign, Landmark, Users, Tag as TagIcon, ExternalLink } from 'lucide-react';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ClientMediaArea } from '@/components/movies/ClientMediaArea';

interface MovieDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: MovieDetailPageProps) {
  try {
    const movie = await getDetails('movie', params.id, 'en-US', 'videos,release_dates') as TMDBMovieDetails;
    return {
      title: `${movie.title} | Movista`,
      description: movie.overview,
    };
  } catch (error) {
    return {
      title: 'Movie Not Found | Movista',
      description: 'The movie you are looking for could not be found.',
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

async function MovieDetailsContent({ movieId }: { movieId: string }) {
  let movie: TMDBMovieDetails;
  try {
    movie = await getDetails('movie', movieId, 'en-US', 'videos,release_dates') as TMDBMovieDetails;
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    notFound();
  }

  const trailer = movie.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === 0 || amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  const formatRuntime = (runtime: number | null) => {
    if (!runtime) return "N/A";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  
  let certification = "N/A";
  const usRelease = movie.release_dates?.results.find(r => r.iso_3166_1 === "US");
  if (usRelease && usRelease.release_dates.length > 0) {
    const rdWithCert = usRelease.release_dates.find(rd => rd.certification && rd.type === 3) || usRelease.release_dates.find(rd => rd.certification);
    if (rdWithCert) {
      certification = rdWithCert.certification;
    }
  }

  return (
    <div className="py-8">
      <Card className="bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 md:p-8 space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">{movie.title}</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-lg">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}/10</span>
                <span className="text-xs">({movie.vote_count.toLocaleString()} votes)</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{releaseYear}</span>
              {certification !== "N/A" && <><span>&bull;</span><span>{certification}</span></>}
              {movie.runtime && <><span>&bull;</span><span>{formatRuntime(movie.runtime)}</span></>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 p-4 md:p-8 pt-0">
            <div className="md:col-span-1 mb-6 md:mb-0">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-xl mx-auto md:mx-0 max-w-xs md:max-w-none">
                <Image
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={`${movie.title} poster`}
                  fill
                  className="object-cover"
                  data-ai-hint="movie poster"
                  priority
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <ClientMediaArea trailerKey={trailer?.key} backdropPath={movie.backdrop_path} title={movie.title || "Media"} />
            </div>
          </div>
          
          <div className="p-6 md:p-8 pt-0 md:pt-4">
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><TagIcon className="w-5 h-5 mr-2"/>Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <Badge key={genre.id} variant="secondary" className="text-sm bg-accent/20 text-accent-foreground border-accent/30 px-3 py-1">{genre.name}</Badge>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-lg font-semibold mb-2 text-primary">Overview</h3>
            <p className="text-base text-foreground/90 leading-relaxed mb-6">{movie.overview}</p>

            {movie.homepage && (
              <div className="mb-8">
                <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={movie.homepage} target="_blank" rel="noopener noreferrer">
                    Visit Homepage <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}

            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 divide-y divide-border/50 sm:divide-y-0">
              <DetailItem label="Release Date" value={movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} icon={CalendarDays} />
              <DetailItem label="Production Countries" value={movie.production_countries.map(c => c.name).join(', ')} icon={Landmark}/>
              <DetailItem label="Status" value={movie.status} icon={Users}/>
              <DetailItem label="Original Language" value={movie.original_language.toUpperCase()} icon={Languages}/>
              <DetailItem label="Spoken Languages" value={movie.spoken_languages.map(lang => lang.english_name).join(', ')} icon={Globe}/>
              <DetailItem label="Budget" value={formatCurrency(movie.budget)} icon={DollarSign}/>
              <DetailItem label="Revenue" value={formatCurrency(movie.revenue)} icon={DollarSign}/>
              {movie.tagline && <DetailItem label="Tagline" value={movie.tagline} icon={TagIcon}/>}
            </dl>

            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-primary">Production Companies</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  {movie.production_companies.filter(pc => pc.logo_path).map(company => (
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

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size={64} /></div>}>
      <MovieDetailsContent movieId={params.id} />
    </Suspense>
  );
}
