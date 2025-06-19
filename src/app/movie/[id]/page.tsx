import { getDetails, getImageUrl, getGenreMap } from '@/lib/tmdb';
import type { TMDBMovieDetails } from '@/types/tmdb';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Star, CalendarDays, Clock, Globe, Languages, DollarSign, Landmark, Users, Tag as TagIcon } from 'lucide-react';
import { VideoPlayer } from '@/components/movies/VideoPlayer';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface MovieDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: MovieDetailPageProps) {
  try {
    const movie = await getDetails('movie', params.id) as TMDBMovieDetails;
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

async function MovieDetailsContent({ movieId }: { movieId: string }) {
  let movie: TMDBMovieDetails;
  try {
    movie = await getDetails('movie', movieId, 'en-US', 'videos') as TMDBMovieDetails;
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    notFound();
  }

  const trailer = movie.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatRuntime = (runtime: number | null) => {
    if (!runtime) return "N/A";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden mb-8 shadow-2xl">
          <Image
            src={getImageUrl(movie.backdrop_path, 'w1280')}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover"
            priority
            data-ai-hint="movie backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Poster & Trailer */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 space-y-6">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
            <Image
              src={getImageUrl(movie.poster_path, 'w780')}
              alt={movie.title || 'Movie Poster'}
              fill
              className="object-cover"
              data-ai-hint="film poster"
            />
          </div>
          {trailer && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Trailer</h3>
              <VideoPlayer videoKey={trailer.key} title={`${movie.title} Trailer`} />
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2">{movie.title}</h1>
          {movie.tagline && <p className="text-xl text-muted-foreground italic mb-6">&quot;{movie.tagline}&quot;</p>}

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center text-lg">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)} ({movie.vote_count} votes)</span>
            </div>
            {movie.release_date && (
              <div className="flex items-center text-lg">
                <CalendarDays className="w-5 h-5 mr-2 text-accent" />
                <span>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            {movie.runtime && (
              <div className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-accent" />
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-primary flex items-center"><TagIcon className="w-5 h-5 mr-2"/>Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map(genre => (
                <Badge key={genre.id} variant="secondary" className="text-sm bg-accent/20 text-accent-foreground border-accent/30 px-3 py-1">{genre.name}</Badge>
              ))}
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2 text-primary">Overview</h3>
          <p className="text-base text-foreground/90 leading-relaxed mb-8">{movie.overview}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InfoItem icon={Languages} label="Original Language" value={movie.original_language.toUpperCase()} />
            <InfoItem icon={Globe} label="Spoken Languages" value={movie.spoken_languages.map(lang => lang.english_name).join(', ')} />
            <InfoItem icon={Users} label="Status" value={movie.status} />
            <InfoItem icon={DollarSign} label="Budget" value={formatCurrency(movie.budget)} />
            <InfoItem icon={DollarSign} label="Revenue" value={formatCurrency(movie.revenue)} />
            <InfoItem icon={Landmark} label="Production Countries" value={movie.production_countries.map(pc => pc.name).join(', ')} />
          </div>
          
          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Production Companies</h3>
              <div className="flex flex-wrap gap-4 items-center">
                {movie.production_companies.filter(pc => pc.logo_path).map(company => (
                  <div key={company.id} className="bg-card p-3 rounded-lg shadow flex flex-col items-center text-center w-32" title={company.name}>
                    <div className="relative w-24 h-12 mb-2">
                      <Image 
                        src={getImageUrl(company.logo_path, 'w200')} 
                        alt={`${company.name} logo`} 
                        fill
                        className="object-contain"
                        data-ai-hint="company logo"
                       />
                    </div>
                    <p className="text-xs text-muted-foreground truncate w-full">{company.name}</p>
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

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
      <MovieDetailsContent movieId={params.id} />
    </Suspense>
  );
}
