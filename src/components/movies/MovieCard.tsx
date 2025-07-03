"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Tv, Film, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { TMDBMediaItem, TMDBMovie, TMDBTVShow } from "@/types/tmdb"
import { getImageUrl } from "@/lib/tmdb"
import { cn } from "@/lib/utils"
import React from "react"
import { FavoriteButton } from "./FavoriteButton"

interface MovieCardProps {
  item: TMDBMediaItem
  mediaType: "movie" | "tv"
  genres?: Record<number, string>
  rank?: number
  className?: string
  variant?: "default" | "trending"
}

export function MovieCard({ item, mediaType, genres, rank, className, variant = "default" }: MovieCardProps) {
  const title = mediaType === "movie" ? (item as TMDBMovie).title : (item as TMDBTVShow).name

  const itemFirstGenreName = item.genre_ids && genres && item.genre_ids.length > 0 ? genres[item.genre_ids[0]] : null
  const itemGenres =
    item.genre_ids && genres
      ? item.genre_ids
          .slice(0, 2)
          .map((id) => genres[id])
          .filter(Boolean)
      : []
  const href = `/${mediaType}/${item.id}`
  const [isHovered, setIsHovered] = React.useState(false)

  // Ensure the item passed to FavoriteButton has the correct media_type if missing
  const itemForFavoriteButton: TMDBMediaItem = item.media_type
    ? item
    : mediaType === "movie"
      ? { ...(item as TMDBMovie), media_type: "movie" as const }
      : { ...(item as TMDBTVShow), media_type: "tv" as const }

  const cardVariants = {
    rest: { scale: 1, boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    hover: {
      scale: 1.05,
      boxShadow: "0px 20px 25px -5px hsla(var(--primary)/0.4), 0px 10px 10px -5px hsla(var(--primary)/0.2)",
    },
  }

  const trendingCardVariants = {
    rest: { scale: 1, boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    hover: {
      scale: 1.03,
      boxShadow: "0px 15px 20px -5px hsla(var(--primary)/0.3), 0px 8px 8px -5px hsla(var(--primary)/0.15)",
    },
  }

  const overlayVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  const trendingTitleVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  }

  if (variant === "trending") {
    return (
      <motion.div
        className={cn("group relative rounded-lg bg-card", className)}
        variants={trendingCardVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        layout
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Link href={href} className="block w-full h-full">
          <div className="relative aspect-[2/3] w-full">
            {rank && (
              <div
                className="absolute -left-8 -bottom-1 z-5 group-hover:z-10 text-[5rem] md:text-[6rem] lg:text-[7rem] font-extrabold text-white/10 group-hover:text-primary/20 transition-colors duration-300 select-none"
                style={{ WebkitTextStroke: `1px hsl(var(--border))`, paintOrder: "stroke fill" }}
              >
                {rank}
              </div>
            )}
            <img
              src={getImageUrl(item.poster_path, "w342") || "/placeholder.svg"}
              alt={title || "Media Poster"}
              className="object-cover transition-transform duration-300 group-hover:brightness-90 rounded-t-lg w-full h-full"
              loading="lazy"
              data-ai-hint="movie poster trending"
              style={{ aspectRatio: "2/3", width: "100%", height: "100%" }}
            />
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end p-2"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={trendingTitleVariants}
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {title}
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>
        <div className="absolute top-1.5 right-1.5 z-5">
          <FavoriteButton item={itemForFavoriteButton} size="sm" className="bg-black/30 hover:bg-primary/50" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn("group relative rounded-lg overflow-hidden bg-card", className)}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <Link href={href} className="block w-full h-full">
        <div className="relative aspect-[2/3] w-full">
          <img
            src={getImageUrl(item.poster_path, "w500") || "/placeholder.svg"}
            alt={title || "Media Poster"}
            className="object-cover transition-transform duration-300 group-hover:brightness-75 w-full h-full"
            loading="lazy"
            data-ai-hint="movie poster popular"
            style={{ aspectRatio: "2/3", width: "100%", height: "100%" }}
          />

          {/* Overlay content on hover - positioned absolutely to not affect card height */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
              >
                <div className="text-white space-y-3">
                  <h3 className="text-base font-bold line-clamp-2 text-white drop-shadow-lg">{title}</h3>

                  <div className="flex items-center text-sm space-x-2 text-white/90">
                    <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-yellow-100">{item.vote_average.toFixed(1)}</span>
                    </div>

                    {itemFirstGenreName && (
                      <div className="flex items-center space-x-1 bg-primary/10 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-primary font-medium">{itemFirstGenreName}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
                      {mediaType === "movie" ? (
                        <Film className="w-3.5 h-3.5 text-white/80" />
                      ) : (
                        <Tv className="w-3.5 h-3.5 text-white/80" />
                      )}
                      <span className="text-white/90 font-medium text-xs uppercase tracking-wide">
                        {mediaType === "movie" ? "Movie" : "TV Show"}
                      </span>
                    </div>
                  </div>

                  {itemGenres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <Tag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      {itemGenres.map((genreName) => (
                        <Badge
                          key={genreName}
                          variant="secondary"
                          className="text-xs bg-emerald-500/20 text-emerald-100 border-emerald-400/30 px-2 py-1 font-medium backdrop-blur-sm hover:bg-emerald-500/30 transition-colors"
                        >
                          {genreName}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {item.overview && (
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <p className="text-sm text-white/95 line-clamp-3 leading-relaxed font-light">{item.overview}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed height content area - only shows basic info */}
        <div className="p-3 bg-card h-16 flex flex-col justify-center">
          <h3 className="text-base font-headline font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          <div className="flex items-center text-xs text-muted-foreground space-x-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            <span>{item.vote_average.toFixed(1)}</span>
            {itemFirstGenreName && (
              <>
                <span aria-hidden="true">&bull;</span>
                <span className="truncate">{itemFirstGenreName}</span>
              </>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton item={itemForFavoriteButton} size="sm" className="bg-black/30 hover:bg-primary/50" />
      </div>
    </motion.div>
  )
}
