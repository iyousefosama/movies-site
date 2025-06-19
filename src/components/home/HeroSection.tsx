"use client"

import Image from "next/image"
import { SearchBar } from "@/components/search/SearchBar"
import { motion } from "framer-motion"

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

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const sparkleVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export function HeroSection() {
  return (
      <motion.section
          className="relative text-center py-12 md:py-16 lg:py-20 overflow-hidden min-h-[50vh] flex flex-col items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
      >

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Hero Image with Modern Frame */}
          <motion.div variants={itemVariants} className="relative mb-8 mx-auto">
            <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-32 md:h-40 lg:h-48 mx-auto">
              <Image
                  src="https://placehold.co/800x400.png"
                  alt="Movie posters collage showcasing popular films"
                  fill
                  className="object-contain"
                  priority
              />
            </div>
          </motion.div>

          {/* Enhanced Typography */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
            >
              Find{" "}
              <span
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
              >
              Movies
            </span>
              <br />
              You&apos;ll Love
            </motion.h1>
            <motion.p
                className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                variants={itemVariants}
            >
              Discover your next favorite film with our intelligent search.{" "}
              <span className="text-blue-400">No more endless scrolling.</span>
            </motion.p>
          </motion.div>

          {/* Enhanced Search Section */}
          <motion.div variants={itemVariants} className="relative max-w-xl mx-auto">
            <SearchBar placeholder="Search for movies, actors, or genres..." />

            {/* Popular Searches */}
            <motion.div className="mt-4 flex flex-wrap gap-2 justify-center items-center" variants={itemVariants}>
              <span className="text-sm text-slate-400 mr-2">Popular:</span>
              {["Action", "Comedy", "Sci-Fi", "Drama"].map((genre, index) => (
                  <motion.button
                      key={genre}
                      className="px-3 py-1 text-sm bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                  >
                    {genre}
                  </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats Section */}
        </div>
      </motion.section>
  )
}
