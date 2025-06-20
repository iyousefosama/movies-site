"use client"

import { useState, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { suggestMovies } from "@/ai/flows/movie-suggestions"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Film, ThumbsUp, CheckCircle, Sparkles, Star, Heart, Settings } from "lucide-react"
import { getGenreMap } from "@/lib/tmdb"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"
import { MediaMultiSelect } from "@/components/ui/media-multi-select"
import { useFavorites } from "@/context/FavoritesContext"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Define types locally since we're not importing them directly
type MovieSuggestionsInput = {
  viewingHistory: string[]
  moods: string[]
  likedMovies: string[]
  genrePreferences: string[]
  count: number
  moodText?: string
  decade?: string
  language?: string
}

type MovieSuggestion = {
  title: string
  year: number
  genres: string[]
  reason: string
}

type MovieSuggestionsOutput = {
  suggestions: MovieSuggestion[]
}

const moodOptions = [
  { value: "Uplifting", label: "Uplifting" },
  { value: "Dark", label: "Dark" },
  { value: "Funny", label: "Funny" },
  { value: "Romantic", label: "Romantic" },
  { value: "Suspenseful", label: "Suspenseful" },
  { value: "Adventurous", label: "Adventurous" },
  { value: "Thought-Provoking", label: "Thought-Provoking" },
  { value: "Feel-Good", label: "Feel-Good" },
  { value: "Epic", label: "Epic" },
  { value: "Chill", label: "Chill" },
]

const decadeOptions = [
  { value: "2020s", label: "2020s" },
  { value: "2010s", label: "2010s" },
  { value: "2000s", label: "2000s" },
  { value: "1990s", label: "1990s" },
  { value: "1980s", label: "1980s" },
  { value: "1970s", label: "1970s" },
  { value: "1960s", label: "1960s" },
]

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Japanese", label: "Japanese" },
  { value: "French", label: "French" },
  { value: "Spanish", label: "Spanish" },
  { value: "Korean", label: "Korean" },
  { value: "German", label: "German" },
  { value: "Hindi", label: "Hindi" },
  { value: "Italian", label: "Italian" },
  { value: "Chinese", label: "Chinese" },
]

const suggestionFormSchema = z.object({
  viewingHistory: z.array(z.string()).default([]),
  moods: z.array(z.string()).default([]),
  likedMovies: z
    .array(z.string().min(1, "Movie title cannot be empty."))
    .max(10, "Please add no more than 10 liked movies.")
    .default([]), // Validation handled in onSubmit
  genrePreferences: z.array(z.string()).default([]),
  count: z.coerce
    .number()
    .min(1, "Suggest at least 1 movie.")
    .max(10, "Cannot suggest more than 10 movies.")
    .default(3),
  moodText: z.string().optional(),
  decade: z.string().optional(),
  language: z.string().optional(),
})

type SuggestionFormValues = z.infer<typeof suggestionFormSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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

export default function SuggestionsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<MovieSuggestion[] | null>(null)
  const [genreOptions, setGenreOptions] = useState<MultiSelectOption[]>([])
  const { toast } = useToast()
  const { favorites } = useFavorites()
  const [includeFavoritesInAI, setIncludeFavoritesInAI] = useState(true)

  useEffect(() => {
    async function fetchGenres() {
      try {
        const movieGenresMap = await getGenreMap("movie")
        const tvGenresMap = await getGenreMap("tv")

        const combinedGenres: Record<string, string> = {}
        Object.entries(movieGenresMap).forEach(([id, name]) => (combinedGenres[name] = name))
        Object.entries(tvGenresMap).forEach(([id, name]) => (combinedGenres[name] = name))

        const options = [
          ...Object.keys(combinedGenres)
            .map((name) => ({ value: name, label: name }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        ]

        setGenreOptions(options)
      } catch (error) {
        console.error("Failed to fetch genres:", error)
        toast({
          title: "Error",
          description: "Could not load genre options.",
          variant: "destructive",
        })
      }
    }
    fetchGenres()
  }, [toast])

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues: {
      viewingHistory: [],
      moods: [],
      likedMovies: [],
      genrePreferences: [],
      count: 3,
      moodText: "",
      decade: "",
      language: "",
    },
  })

  const onSubmit: SubmitHandler<SuggestionFormValues> = async (data) => {
    setIsLoading(true)
    setSuggestions(null)
    form.clearErrors("likedMovies")

    const finalLikedMovies =
      includeFavoritesInAI && favorites.length > 0
        ? [...new Set([...data.likedMovies, ...favorites.map((fav) => fav.title)])]
        : [...data.likedMovies]

    if (finalLikedMovies.length === 0 && data.moods.length === 0 && !data.moodText) {
      form.setError("likedMovies", {
        type: "manual",
        message: "Please add a liked movie, select a mood, or describe what you're in the mood for.",
      })
      setIsLoading(false)
      return
    }

    try {
      const input: MovieSuggestionsInput = {
        viewingHistory: data.viewingHistory || [],
        moods: data.moods,
        likedMovies: finalLikedMovies,
        genrePreferences: data.genrePreferences,
        count: data.count,
        moodText: data.moodText,
        decade: data.decade,
        language: data.language,
      }

      const result = await suggestMovies(input)
      setSuggestions(result.suggestions)
      toast({
        title: "Suggestions Ready!",
        description: "Here are some movies you might like.",
        variant: "default",
        action: <CheckCircle className="text-green-500" />,
      })
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      toast({
        title: "Error Fetching Suggestions",
        description: error instanceof Error ? error.message : "Could not fetch suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/5 py-8 sm:py-12 lg:py-16">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            AI Movie Suggestions
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about your taste, and our AI will suggest movies you'll love!
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center">
                <ThumbsUp className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-primary" />
                Your Movie Preferences
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                The more details you provide, the better the recommendations.
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6 sm:space-y-8">
                  {/* Free-text Mood Box */}
                  <FormField
                    control={form.control}
                    name="moodText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base sm:text-lg font-semibold text-foreground flex items-center">
                          <Film className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                          What are you in the mood for?
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="e.g., 'A mind-bending sci-fi like Inception but with more action'"
                            className="bg-input/50 border-border hover:border-primary/50 focus:border-primary transition-colors h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs mt-1 text-muted-foreground">
                          Describe your mood, a movie vibe, or a specific request.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Liked Movies */}
                  <FormField
                    control={form.control}
                    name="likedMovies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base sm:text-lg font-semibold text-foreground flex items-center">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent" />
                          Movies You Liked
                        </FormLabel>
                        <FormControl>
                          <MediaMultiSelect
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Add movies you liked..."
                            triggerClassName="bg-input/50 border-border hover:border-accent/50 focus:border-accent transition-colors min-h-[44px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Include Favorites Switch */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-primary/20 p-4 sm:p-6 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm"
                  >
                    <div className="space-y-1 mb-4 sm:mb-0">
                      <div className="flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-accent" />
                        <FormLabel className="text-base sm:text-lg font-semibold text-foreground">
                          Include Your Favorites?
                        </FormLabel>
                      </div>
                      <FormDescription className="text-sm text-muted-foreground">
                        Allow AI to consider movies & TV shows you've favorited.
                        {favorites.length > 0 && (
                          <span className="block mt-1 text-primary font-medium">
                            You have {favorites.length} favorite{favorites.length !== 1 ? "s" : ""} saved
                          </span>
                        )}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={includeFavoritesInAI}
                        onCheckedChange={setIncludeFavoritesInAI}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-accent"
                      />
                    </FormControl>
                  </motion.div>

                  {/* Additional Settings Accordion */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="additional-settings">
                      <AccordionTrigger className="text-base sm:text-lg font-semibold text-foreground hover:no-underline">
                        <div className="flex items-center">
                          <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                          Fine-Tune Your Suggestions (Optional)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-6">
                        {/* Genre Preferences */}
                        <FormField
                          control={form.control}
                          name="genrePreferences"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold text-foreground">Preferred Genres</FormLabel>
                              <FormControl>
                                <MultiSelect
                                  options={genreOptions}
                                  selected={field.value.filter((genre) => genre !== "")}
                                  onChange={(vals) => field.onChange(vals.filter((val) => val !== ""))}
                                  placeholder="Select your favorite genres..."
                                  triggerClassName="bg-input/50 border-border hover:border-purple-500/50 focus:border-purple-500 transition-colors min-h-[44px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="decade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground">Decade</FormLabel>
                                <FormControl>
                                  <MultiSelect
                                    options={decadeOptions}
                                    selected={field.value ? [field.value] : []}
                                    onChange={(vals) => field.onChange(vals.length > 0 ? vals[vals.length - 1] : "")}
                                    placeholder="Any decade"
                                    triggerClassName="bg-input/50 border-border min-h-[44px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="moods"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground">Mood</FormLabel>
                                <FormControl>
                                  <MultiSelect
                                    options={moodOptions}
                                    selected={field.value.filter((mood) => mood !== "")}
                                    onChange={(vals) => field.onChange(vals.filter((val) => val !== ""))}
                                    placeholder="Any mood"
                                    triggerClassName="bg-input/50 border-border min-h-[44px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground">Language</FormLabel>
                                <FormControl>
                                  <MultiSelect
                                    options={languageOptions}
                                    selected={field.value ? [field.value] : []}
                                    onChange={(vals) => field.onChange(vals.length > 0 ? vals[vals.length - 1] : "")}
                                    placeholder="Any language"
                                    triggerClassName="bg-input/50 border-border min-h-[44px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Number of Suggestions */}
                  <FormField
                    control={form.control}
                    name="count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base sm:text-lg font-semibold text-foreground">
                          Number of Suggestions
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            className="bg-input/50 border-border hover:border-primary/50 focus:border-primary transition-colors h-11 w-full sm:w-1/2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading || genreOptions.length === 0}
                    className="w-full text-base sm:text-lg py-3 sm:py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size={20} className="mr-2" />
                        AI is thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Get My Suggestions
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div variants={itemVariants} className="mt-8 sm:mt-12 text-center">
            <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20">
              <LoadingSpinner size={48} className="mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Our AI is analyzing your preferences...</p>
              <p className="text-muted-foreground/70 text-sm mt-2">This may take a few moments</p>
            </div>
          </motion.div>
        )}

        {/* Suggestions Results */}
        {suggestions && suggestions.length > 0 && (
          <motion.div variants={itemVariants} className="mt-8 sm:mt-12">
            <Card className="shadow-2xl border-green-500/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center">
                  <Film className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-green-400" />
                  Your Personalized Suggestions
                </CardTitle>
                <CardDescription>Based on your preferences, here are movies we think you'll love:</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-4">
                  {suggestions.map((movie, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-green-500/30 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm sm:text-base mr-3 sm:mr-4">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-base sm:text-lg">
                          {movie.title} <span className="text-muted-foreground font-normal">({movie.year})</span>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                          {movie.genres && movie.genres.length > 0 && <span>Genres: {movie.genres.join(", ")}</span>}
                        </div>
                        <div className="text-sm sm:text-base text-foreground/90">{movie.reason}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* No Suggestions Found */}
        {suggestions && suggestions.length === 0 && !isLoading && (
          <motion.div variants={itemVariants} className="mt-8 sm:mt-12">
            <Card className="shadow-lg border-red-500/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-red-400 flex items-center">
                  <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 mr-3" />
                  No Suggestions Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  We couldn't find any suggestions based on your input. Try being more specific or broader with your
                  preferences, or check your internet connection and try again.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
