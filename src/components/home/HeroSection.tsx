"use client";

import Image from 'next/image';
import { SearchBar } from '@/components/search/SearchBar';
import { Clapperboard } from 'lucide-react'; // Using Clapperboard as a placeholder for the top logo

export function HeroSection() {
  return (
    <section className="relative text-center py-16 md:py-24 lg:py-32 overflow-hidden min-h-[70vh] flex flex-col items-center justify-center">
      {/* Background Gradient */}
      <div
        className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-transparent"
        aria-hidden="true"
      />
      
      {/* Top Logo Placeholder */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <Clapperboard className="h-12 w-12 md:h-16 md:w-16 text-primary/70" />
      </div>

      {/* Movie Posters Fan Image Placeholder */}
      <div className="relative mb-8 w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-40 md:h-56 lg:h-64">
        <Image
          src="https://placehold.co/800x400.png" // Placeholder for the fan of movie posters
          alt="Movie posters collage"
          fill
          className="object-contain"
          data-ai-hint="movie posters collage"
          priority
        />
      </div>

      {/* Title Text */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 px-4">
        Find <span className="text-primary">Movies</span> You&apos;ll Love
        <br />
        Without the Hassle
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-xl md:max-w-2xl px-4 z-10">
        <SearchBar placeholder="Search through 300+ movies online" />
      </div>
    </section>
  );
}
