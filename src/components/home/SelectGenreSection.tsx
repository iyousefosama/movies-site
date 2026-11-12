"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface GenreCardData {
  name: string;
  query: string;
  bgClass: string;
  glowClass: string;
}

const GENRE_CARDS: GenreCardData[] = [
  {
    name: "ROMANTIC",
    query: "Romance",
    bgClass: "bg-[#FF3B47]",
    glowClass: "hover:shadow-[0_0_30px_rgba(255,59,71,0.5)]",
  },
  {
    name: "THRILLER",
    query: "Thriller",
    bgClass: "bg-[#7B2CBF]",
    glowClass: "hover:shadow-[0_0_30px_rgba(123,44,191,0.5)]",
  },
  {
    name: "COMEDY",
    query: "Comedy",
    bgClass: "bg-[#00B4D8]",
    glowClass: "hover:shadow-[0_0_30px_rgba(0,180,216,0.5)]",
  },
  {
    name: "ADVENTURE",
    query: "Adventure",
    bgClass: "bg-[#FB8500]",
    glowClass: "hover:shadow-[0_0_30px_rgba(251,133,0,0.5)]",
  },
  {
    name: "ACTION",
    query: "Action",
    bgClass: "bg-[#D90429]",
    glowClass: "hover:shadow-[0_0_30px_rgba(217,4,41,0.5)]",
  },
  {
    name: "SCI-FI",
    query: "Science Fiction",
    bgClass: "bg-[#2563EB]",
    glowClass: "hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]",
  },
  {
    name: "HORROR",
    query: "Horror",
    bgClass: "bg-[#831843]",
    glowClass: "hover:shadow-[0_0_30px_rgba(131,24,67,0.5)]",
  },
  {
    name: "ANIMATION",
    query: "Animation",
    bgClass: "bg-[#F59E0B]",
    glowClass: "hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]",
  },
];

export function SelectGenreSection() {
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

  return (
    <section id="genres" className="w-full py-8 sm:py-14 bg-black select-none border-t border-white/5">
      <div className="w-full flex flex-col md:flex-row items-stretch">
        
        {/* Left Column: Stacked Red Title & Drag Prompt */}
        <div className="w-full md:w-60 lg:w-72 flex-shrink-0 flex flex-col justify-between px-4 sm:px-8 lg:px-14 mb-4 md:mb-0">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-red-600 font-headline uppercase tracking-tight leading-[0.88] flex flex-col">
              <span>SELECT</span>
              <span>GENRE</span>
            </h2>

            <div className="flex items-center gap-2 mt-2.5 sm:mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
              <span>DRAG TO NEXT</span>
              <span className="inline-block w-6 sm:w-8 h-[1.5px] bg-zinc-600" />
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 -ml-1 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Right Column: Horizontally Scrollable Vibrant Solid Colored Cards */}
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
            {GENRE_CARDS.map((genre) => (
              <Link
                key={genre.name}
                href={`/search?genre_query=${encodeURIComponent(genre.query)}`}
                draggable={false}
                className={`flex-shrink-0 w-[135px] sm:w-[180px] md:w-[210px] h-[90px] sm:h-[120px] md:h-[150px] rounded-lg ${genre.bgClass} flex items-center justify-center text-center p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] ${genre.glowClass} shadow-lg active:scale-95`}
              >
                <span className="font-headline font-black text-base sm:text-2xl md:text-3xl tracking-wider text-white uppercase drop-shadow-md">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

