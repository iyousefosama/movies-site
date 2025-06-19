"use client";

import Image from 'next/image';
import { SearchBar } from '@/components/search/SearchBar';
import { Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};


export function HeroSection() {
  return (
    <motion.section 
      className="relative text-center py-16 md:py-24 lg:py-32 overflow-hidden min-h-[70vh] flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Gradient */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-transparent"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      <motion.div variants={itemVariants} className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <Clapperboard className="h-12 w-12 md:h-16 md:w-16 text-primary/70" />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="relative mb-8 w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-40 md:h-56 lg:h-64"
      >
        <Image
          src="https://placehold.co/800x400.png"
          alt="Movie posters collage"
          fill
          className="object-contain"
          data-ai-hint="movie posters collage"
          priority
        />
      </motion.div>

      <motion.h1 
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 px-4"
      >
        Find <span className="text-primary">Movies</span> You&apos;ll Love
        <br />
        Without the Hassle
      </motion.h1>

      <motion.div 
        variants={itemVariants}
        className="w-full max-w-xl md:max-w-2xl px-4 z-10"
      >
        <SearchBar placeholder="Search through 300+ movies online" />
      </motion.div>
    </motion.section>
  );
}
