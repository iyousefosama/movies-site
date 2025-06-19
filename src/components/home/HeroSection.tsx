
"use client"

import Image from "next/image"
import { SearchBar } from "@/components/search/SearchBar"
import { motion } from "framer-motion"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

export function HeroSection() {
  const popularGenres = ["Action", "Comedy", "Sci-Fi", "Drama", "Horror", "Animation"]; // Added more examples
  return (
      <motion.section
          className="relative text-center py-12 md:py-16 lg:py-20 overflow-hidden min-h-[60vh] md:min-h-[50vh] flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-card/10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
      >

        {/* Main Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          {/* Hero Image with Modern Frame */}
          <motion.div variants={itemVariants} className="relative mb-8 mx-auto">
            <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl h-24 md:h-28 lg:h-32 mx-auto">
              <Image
                  src="https://placehold.co/600x150.png"
                  alt="Movista stylized logo or movie reel"
                  fill
                  className="object-contain"
                  priority
                  data-ai-hint="logo movie"
              />
            </div>
          </motion.div>

          {/* Enhanced Typography */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight text-balance bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            >
              Find Movies You&apos;ll Love
            </motion.h1>
            <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed text-balance"
                variants={itemVariants}
            >
              Discover your next favorite film without the hassle. Explore over 300,000 titles.
            </motion.p>
          </motion.div>

          {/* Enhanced Search Section */}
          <motion.div variants={itemVariants} className="relative max-w-lg mx-auto">
            <SearchBar placeholder="Search titles, actors, genres..." />

            {/* Popular Genres */}
            <motion.div 
              className="mt-6 flex flex-wrap gap-2 justify-center items-center" 
              variants={itemVariants}
              initial="hidden" 
              animate="visible"
              transition={{ staggerChildren: 0.1, delayChildren: 0.5 }}
            >
              <span className="text-sm text-muted-foreground mr-2">Popular Genres:</span>
              {popularGenres.map((genre) => (
                  <motion.div
                    key={genre}
                    variants={itemVariants}
                  >
                    {/* Updated Link to use genre_query */}
                    <Link href={`/search?genre_query=${encodeURIComponent(genre)}`} passHref>
                      <motion.button
                          className="px-3 py-1.5 text-xs bg-card hover:bg-accent/80 rounded-full text-foreground hover:text-accent-foreground transition-all duration-200 border border-border hover:border-accent"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                      >
                        {genre}
                      </motion.button>
                    </Link>
                  </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
  )
}
