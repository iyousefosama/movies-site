"use client";

import Link from "next/link";
import { Sparkles, Wand2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function SuggestionsCTA() {
  return (
    <section className="w-full py-10 sm:py-20 bg-black border-t border-white/5 relative overflow-hidden select-none">
      {/* Subtle background red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-950/80 to-black p-6 sm:p-12 md:p-16 border border-white/10 shadow-2xl text-center relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/50 border border-red-800/40 text-red-500 text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Discovery Engine</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-headline mb-3 sm:mb-4 leading-tight">
            FIND YOUR NEXT OBSESSION IN SECONDS
          </h2>

          <p className="text-xs sm:text-base text-zinc-400 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-sans">
            Tired of endless scrolling? Tell our intelligent cinema agent your mood, favorite actors, or story tropes, and get instant recommendations tailored just for you.
          </p>

          <Link
            href="/suggestions"
            className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-[0_0_25px_rgba(229,9,20,0.5)] hover:shadow-[0_0_35px_rgba(229,9,20,0.8)] transition-all font-sans w-full sm:w-auto"
          >
            <span>Ask Movista AI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
