import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/lib/tmdb';
import Image from 'next/image';

interface VideoPlayerProps {
  videoKey: string;
  title: string;
}

export function VideoPlayer({ videoKey, title }: VideoPlayerProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg shadow-xl border border-primary/30">
      <iframe
        width="100%"
        height="100%"
        src={getYouTubeEmbedUrl(videoKey)}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="bg-black"
        // You can use a poster image if needed, but autoplay usually makes it less necessary
        // poster={getYouTubeThumbnailUrl(videoKey)}
        data-ai-hint="movie trailer"
      ></iframe>
    </div>
  );
}
