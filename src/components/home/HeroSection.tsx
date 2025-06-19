
"use client"
import { SearchBar } from "@/components/search/SearchBar"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

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

export function HeroSection() {
  const popularGenres = ["Action", "Comedy", "Sci-Fi", "Drama", "Horror", "Animation"]

  return (
    <motion.section
      className="relative text-center py-8 sm:py-12 lg:py-16 min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-card/5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants} className="relative mb-8 mx-auto">
          <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl h-24 md:h-28 lg:h-32 mx-auto">
            <Image
                src="/logo.png" 
                alt="Movista stylized logo or movie reel"
                fill
                className="object-contain"
                priority
                data-ai-hint="logo app logo"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 sm:mb-8 leading-[0.85] sm:leading-[0.9] tracking-tight px-2"
            style={{
              background: "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)/0.8) 30%, hsl(var(--foreground)/0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 40px hsla(var(--foreground-hsl)/0.1)",
            }}
          >
            Discover{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 50%, hsl(var(--primary)/0.7) 100%)",
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
                background: "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent)/0.8) 50%, hsl(var(--accent)/0.7) 100%)",
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
              background: "linear-gradient(135deg, hsl(var(--muted-foreground)) 0%, hsl(var(--muted-foreground)/0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Immerse yourself in stories that captivate. Explore{" "}
            <span
              className="font-bold"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.9) 100%)",
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

        <motion.div variants={itemVariants} className="relative w-full max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
          <SearchBar placeholder="Search movies, actors, genres..." />
        </motion.div>

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
                  className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary/10 via-transparent to-accent/10 hover:from-primary/20 hover:via-transparent hover:to-accent/20 rounded-full text-foreground border border-border hover:border-primary/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl touch-manipulation"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: "0 4px 20px hsla(var(--primary-hsl)/0.1), inset 0 1px 0 hsla(var(--foreground-hsl)/0.05)",
                  }}
                >
                  {genre}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] sm:top-[20%] left-1/2 transform -translate-x-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-r from-primary/10 via-accent/5 to-purple-500/10 rounded-full blur-[100px] sm:blur-[150px] lg:blur-[200px] opacity-50" />
        <div className="hidden sm:block absolute top-[10%] left-[10%] sm:left-[20%] w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] bg-primary/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] opacity-40" />
        <div className="hidden sm:block absolute bottom-[10%] right-[10%] sm:right-[20%] w-[150px] sm:w-[200px] lg:w-[300px] h-[150px] sm:h-[200px] lg:h-[300px] bg-accent/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] opacity-30" />
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
