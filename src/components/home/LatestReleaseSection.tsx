"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
import type { TMDBMediaItem, TMDBMovie } from "@/types/tmdb";
import { getImageUrl } from "@/lib/tmdb";
import { FavoriteButton } from "@/components/movies/FavoriteButton";

interface LatestReleaseSectionProps {
  items: TMDBMediaItem[];
  genres?: Record<number, string>;
}

export function LatestReleaseSection({ items = [], genres = {} }: LatestReleaseSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  if (!items || items.length === 0) return null;

  return (
    <section id="latest" className="w-full py-8 sm:py-14 bg-black select-none border-t border-white/5">
      <div className="w-full flex flex-col md:flex-row items-stretch">
        
        {/* Left Column: Signature Stacked Red Title & Drag Prompt */}
        <div className="w-full md:w-60 lg:w-72 flex-shrink-0 flex flex-col justify-between px-4 sm:px-8 lg:px-14 mb-4 md:mb-0">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-red-600 font-headline uppercase tracking-tight leading-[0.88] flex flex-col">
              <span>LATEST</span>
              <span>RELEASE</span>
            </h2>

            <div className="flex items-center gap-2 mt-2.5 sm:mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
              <span>DRAG TO NEXT</span>
              <span className="inline-block w-6 sm:w-8 h-[1.5px] bg-zinc-600" />
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 -ml-1 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Right Column: Horizontally Scrollable Cards */}
        <div className="flex-1 min-w-0 overflow-hidden pr-4 sm:pr-8 lg:pr-14 pl-4 md:pl-0">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 touch-pan-x ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {items.map((item) => {
              const movie = item as TMDBMovie;
              const title = movie.title || item.name || "Untitled";
              const poster = getImageUrl(item.poster_path, "w500");
              const rating = item.vote_average ? item.vote_average.toFixed(1) : "7.5";
              const firstGenre = item.genre_ids && genres[item.genre_ids[0]] ? genres[item.genre_ids[0]] : null;
              const href = `/${item.media_type === "tv" ? "tv" : "movie"}/${item.id}`;

              return (
                <div
                  key={item.id}
                  className="group relative flex-shrink-0 w-[145px] sm:w-[190px] md:w-[220px] lg:w-[240px] aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/10 transition-transform duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-red-950/20"
                >
                  <Link href={href} className="block w-full h-full relative" draggable={false}>
                    {/* Poster Image */}
                    <img
                      src={poster}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />

                    {/* Dark gradient for title legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 via-40% to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                    {/* Movie title stylized at bottom matching screenshot */}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 flex flex-col justify-end">
                      {firstGenre && (
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-red-500 mb-0.5 sm:mb-1">
                          {firstGenre}
                        </span>
                      )}
                      <h3 className="text-xs sm:text-base font-black uppercase tracking-tight text-white line-clamp-2 leading-tight drop-shadow font-headline group-hover:text-red-400 transition-colors">
                        {title}
                      </h3>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-[10px] sm:text-[11px] text-zinc-300">
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {rating}
                        </span>
                        <span>•</span>
                        <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "2024"}</span>
                      </div>
                    </div>

                    {/* Play Button Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-600/50 transform scale-75 group-hover:scale-100 transition-transform">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  </Link>

                  {/* Top-Right Favorite Button */}
                  <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10">
                    <FavoriteButton
                      item={item}
                      size="sm"
                      className="bg-black/60 hover:bg-red-600 text-white border border-white/20 p-1 sm:p-1.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

