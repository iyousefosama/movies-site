"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/movies/VideoPlayer';
import { getImageUrl } from '@/lib/tmdb';
import { PlayCircle } from 'lucide-react';

interface ClientMediaAreaProps {
  trailerKey?: string;
  backdropPath: string | null;
  title: string;
}

export function ClientMediaArea({ trailerKey, backdropPath, title }: ClientMediaAreaProps) {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!trailerKey && !backdropPath) {
    return <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">No media available</div>;
  }
  
  if (showTrailer && trailerKey) {
    return <VideoPlayer videoKey={trailerKey} title={`${title} Trailer`} />;
  }

  if (backdropPath) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl group">
        <img
          src={getImageUrl(backdropPath, 'w1280')}
          alt={`${title} backdrop`}
          className="object-cover w-full h-full absolute inset-0"
          loading="lazy"
          data-ai-hint="movie scene tv series scene"
          style={{ borderRadius: 'inherit' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        {trailerKey && (
          <Button
            variant="ghost"
            size="lg"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary hover:text-primary-foreground text-foreground text-lg px-6 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 opacity-80 group-hover:opacity-100"
            onClick={() => setShowTrailer(true)}
          >
            <PlayCircle className="w-6 h-6 mr-2" />
            Play Trailer
          </Button>
        )}
      </div>
    );
  }

  if (trailerKey) {
     return <VideoPlayer videoKey={trailerKey} title={`${title} Trailer`} />;
  }

  return null;
}
