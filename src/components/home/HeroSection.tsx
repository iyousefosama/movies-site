"use client"
import { SearchBar } from "@/components/search/SearchBar"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

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
      stiffness: 120,
      damping: 14,
    },
  },
}

const shimmerEffect = {
  backgroundImage: "linear-gradient(110deg, #1a1a1a 8%, #2a2a2a 18%, #1a1a1a 33%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
}

export function HeroSection() {
  const popularGenres = ["Action", "Comedy", "Sci-Fi", "Drama", "Horror", "Animation"]

  const scrollToTrending = () => {
    const trendingSection = document.getElementById("trending")
    if (trendingSection) {
      trendingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.section
      className="relative text-center py-8 sm:py-12 lg:py-16 overflow-hidden min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-card/5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Content Wrapper - Full width with responsive padding */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        {/* Headline & Description */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 sm:mb-8 leading-[0.85] sm:leading-[0.9] tracking-tight px-2"
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 40px rgba(255,255,255,0.1)",
            }}
          >
            Discover{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Cinema
            </span>
            <br />
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Magic
            </span>
          </motion.h1>
          <motion.p
            className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl font-medium max-w-4xl mx-auto leading-relaxed px-4"
            style={{
              background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Immerse yourself in stories that captivate. Explore{" "}
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              300,000+
            </span>{" "}
            films across every genre and era.
          </motion.p>
        </motion.div>

        {/* Search - Full width with max constraint */}
        <motion.div variants={itemVariants} className="relative w-full max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
          <SearchBar placeholder="Search movies, actors, genres..." />
        </motion.div>

        {/* Popular Genres - Better mobile layout */}
        <motion.div
          className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center px-4 mb-8 sm:mb-12"
          variants={itemVariants}
        >
          <span className="text-xs sm:text-sm font-medium text-muted-foreground mr-2 sm:mr-3 w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
            Trending:
          </span>
          {popularGenres.map((genre) => (
            <motion.div key={genre} variants={itemVariants}>
              <Link href={`/search?genre_query=${encodeURIComponent(genre)}`} passHref>
                <motion.button
                  className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500/10 to-red-500/10 hover:from-amber-500/20 hover:to-red-500/20 rounded-full text-foreground border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl touch-manipulation"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: "0 4px 20px rgba(251, 191, 36, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {genre}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll to Trending Button */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <motion.button
            onClick={scrollToTrending}
            className="group flex flex-col items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: "0 8px 32px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <span className="text-sm sm:text-base font-semibold text-foreground">Explore Trending Movies</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced Decorative Background - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main glow - Responsive sizing */}
        <div className="absolute top-[15%] sm:top-[20%] left-1/2 transform -translate-x-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-r from-amber-500/15 via-red-500/10 to-purple-500/15 rounded-full blur-[100px] sm:blur-[150px] lg:blur-[200px] opacity-60" />
        {/* Secondary accent glows - Hidden on very small screens */}
        <div className="hidden sm:block absolute top-[10%] left-[10%] sm:left-[20%] w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] bg-amber-400/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] opacity-40" />
        <div className="hidden sm:block absolute bottom-[10%] right-[10%] sm:right-[20%] w-[150px] sm:w-[200px] lg:w-[300px] h-[150px] sm:h-[200px] lg:h-[300px] bg-red-500/10 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] opacity-30" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.section>
  )
}
