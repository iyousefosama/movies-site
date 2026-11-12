"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight, X, Volume2, VolumeX, Sparkles, Star } from "lucide-react";
import type { TMDBMediaItem, TMDBMovie, TMDBTVShow } from "@/types/tmdb";
import { getImageUrl, IMAGE_BASE_URL } from "@/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HeroSectionProps {
  items: TMDBMediaItem[];
  genres?: Record<number, string>;
}

export function HeroSection({ items = [], genres = {} }: HeroSectionProps) {
  // Use top 5 items for featured slides
  const featured = useMemo(() => items.slice(0, 5), [items]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  const currentItem = featured[currentIndex];

  // Auto advance every 8 seconds unless trailer modal is open
  useEffect(() => {
    if (featured.length <= 1 || isTrailerOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
      setIsOverviewExpanded(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [featured.length, isTrailerOpen]);

  if (!currentItem) {
    return null;
  }

  const isMovie = currentItem.media_type !== "tv" && !("name" in currentItem && !("title" in currentItem));
  const title = (currentItem as TMDBMovie).title || (currentItem as TMDBTVShow).name || "Untitled";
  const releaseDate = (currentItem as TMDBMovie).release_date || (currentItem as TMDBTVShow).first_air_date || "";
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 2024;
  const rating = currentItem.vote_average ? currentItem.vote_average.toFixed(1) : "8.2";

  // Resolve genre names
  const itemGenreNames = (currentItem.genre_ids || [])
    .map((id) => genres[id])
    .filter(Boolean);
  const primaryGenre = itemGenreNames[0] || (isMovie ? "CINEMA" : "SERIES");
  const genreString = itemGenreNames.slice(0, 2).join(" / ") || "Sci-Fi / Adventure";

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
    setIsOverviewExpanded(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
    setIsOverviewExpanded(false);
  };

  // Fetch trailer when user clicks the play button
  const handlePlayTrailer = async () => {
    setIsLoadingTrailer(true);
    try {
      const mediaType = isMovie ? "movie" : "tv";
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const res = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${currentItem.id}/videos?api_key=${apiKey}&language=en-US`
      );
      if (res.ok) {
        const data = await res.json();
        const trailer = (data.results || []).find(
          (v: { site: string; type: string; key: string }) =>
            v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        );
        if (trailer) {
          setTrailerKey(trailer.key);
          setIsTrailerOpen(true);
        } else {
          // If no trailer, navigate to movie page
          window.location.href = `/${mediaType}/${currentItem.id}`;
        }
      } else {
        window.location.href = `/${mediaType}/${currentItem.id}`;
      }
    } catch {
      window.location.href = `/${isMovie ? "movie" : "tv"}/${currentItem.id}`;
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  const backdropUrl = currentItem.backdrop_path
    ? `${IMAGE_BASE_URL}original${currentItem.backdrop_path}`
    : currentItem.poster_path
    ? `${IMAGE_BASE_URL}original${currentItem.poster_path}`
    : "/movista.jpg";

  return (
    <div className="relative w-full min-h-[580px] sm:min-h-[660px] lg:h-[88vh] lg:max-h-[920px] bg-black overflow-hidden select-none flex flex-col justify-end">
      {/* Background Backdrop with Cinematic Vignette */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Main Backdrop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
            style={{
              backgroundImage: `url(${backdropUrl})`,
            }}
          />

          {/* Cinematic Vignette Overlays matching reference image */}
          {/* Left heavy gradient for typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 via-45% to-transparent" />
          {/* Bottom fade into pure black */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/60 via-25% to-transparent" />
          {/* Top subtle fade for header overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
          {/* Extra dark vignette on right */}
          <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 flex flex-col justify-end pt-20 pb-8 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-end">
          
          {/* Left Block: Presenter, Category, Title, Meta, Synopsis, Prev/Next buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45 }}
                className="w-full"
              >
                {/* Presenter Sub-tagline */}
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-zinc-400 mb-1.5 sm:mb-2">
                  MOVISTA STUDIOS PRESENTS
                </p>

                {/* Accent Tag / Genre */}
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00E5C9] mb-2 sm:mb-3">
                  {primaryGenre}
                </p>

                {/* Giant Impactful Display Title */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white leading-[0.92] mb-3 sm:mb-4 font-headline drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] max-w-2xl line-clamp-2">
                  {title}
                </h1>

                {/* Metadata Line */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-sm font-medium text-zinc-300 mb-3 sm:mb-4">
                  <span className="text-white font-semibold">{releaseYear}</span>
                  <span className="text-zinc-500">•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                    {rating}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-300">Multi Language</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-300">{genreString}</span>
                </div>

                {/* Synopsis Excerpt */}
                <div className="text-xs sm:text-sm text-zinc-300/90 max-w-xl leading-relaxed mb-4 sm:mb-6">
                  <p className={isOverviewExpanded ? "" : "line-clamp-2"}>
                    {currentItem.overview || "An unforgettable cinematic journey packed with thrills, emotion, and spectacular visuals."}
                  </p>
                  {currentItem.overview && currentItem.overview.length > 120 && (
                    <button
                      onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                      className="text-red-500 hover:text-red-400 font-semibold text-xs mt-1 transition-colors underline underline-offset-4"
                    >
                      {isOverviewExpanded ? "less" : "...more"}
                    </button>
                  )}
                </div>

                {/* Left Navigation Buttons: < > */}
                <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Featured Slide"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition-all active:scale-95 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next Featured Slide"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition-all active:scale-95 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Block: Signature Red Play Button with STREAMING NOW + Bottom Thumbnails Carousel */}
          <div className="lg:col-span-5 flex flex-col justify-end items-start lg:items-end gap-4 sm:gap-6 w-full">
            
            {/* The Central Iconic CTA: Glowing Red Ring Play Button + STREAMING NOW */}
            <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer" onClick={handlePlayTrailer}>
              {/* Pulsing Glowing Red Ring Play Button */}
              <button
                disabled={isLoadingTrailer}
                className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-red-500/90 bg-black/60 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_35px_rgba(239,68,68,0.8)] group-hover:border-red-400 transition-all duration-300 flex-shrink-0"
                aria-label="Play Trailer or Stream"
              >
                {/* Outer Ring Glow Animation */}
                <span className="absolute inset-0 rounded-full border border-red-500/40 animate-ping opacity-60 pointer-events-none" />
                <Play className="w-5 h-5 sm:w-7 sm:h-7 fill-white text-white translate-x-0.5" />
              </button>

              {/* Streaming Now Text / Badge */}
              <div className="flex flex-col items-start">
                <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-red-500 group-hover:text-red-400 transition-colors">
                  STREAMING NOW
                </span>
                <span className="text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-wider">
                  Watch Official Trailer
                </span>
              </div>
            </div>

            {/* Bottom Right: Mini Preview Thumbnails Carousel Strip */}
            <div className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 max-w-full overflow-x-auto no-scrollbar">
              {featured.map((item, idx) => {
                const isActive = idx === currentIndex;
                const thumbPoster = getImageUrl(item.backdrop_path || item.poster_path, "w185");
                const itemTitle = (item as TMDBMovie).title || (item as TMDBTVShow).name || "Movie";

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsOverviewExpanded(false);
                    }}
                    className={`relative w-14 sm:w-18 md:w-20 aspect-video rounded-md overflow-hidden transition-all duration-300 flex-shrink-0 ${
                      isActive
                        ? "ring-2 ring-red-500 scale-105 opacity-100 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                        : "opacity-50 hover:opacity-90 hover:scale-100 ring-1 ring-white/10"
                    }`}
                    aria-label={`Switch to ${itemTitle}`}
                  >
                    <img
                      src={thumbPoster}
                      alt={itemTitle}
                      className="w-full h-full object-cover"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-red-600/10 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      </div>

      {/* Far Right Vertical Indicators */}
      <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-20">
        {featured.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "h-8 bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                : "h-3 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Trailer Dialog Modal */}
      <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
        <DialogContent className="max-w-4xl bg-black/95 border-white/10 p-1 sm:p-2 overflow-hidden">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
            {trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title={`${title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-400">
                Trailer not available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
