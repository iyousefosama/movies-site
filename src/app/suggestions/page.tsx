"use client"

import { useState, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { suggestMovies, type MovieSuggestionsInput, type MovieSuggestionsOutput } from "@/ai/flows/movie-suggestions"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Film, ThumbsUp, CheckCircle, Sparkles, Star } from "lucide-react"
import { getGenreMap } from "@/lib/tmdb"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"
import { MediaMultiSelect } from "@/components/ui/media-multi-select"
import { motion } from "framer-motion"

const suggestionFormSchema = z.object({
  viewingHistory: z
    .array(z.string().min(1, "Movie title cannot be empty."))
    .min(1, "Please add at least one movie you've watched.")
    .max(10, "Please add no more than 10 watched movies."),
  likedMovies: z
    .array(z.string().min(1, "Movie title cannot be empty."))
    .min(1, "Please add at least one movie you liked.")
    .max(10, "Please add no more than 10 liked movies."),
  genrePreferences: z
    .array(z.string())
    .min(1, "Please select at least one genre.")
    .max(10, "Please select no more than 10 genres."),
  count: z.coerce
    .number()
    .min(1, "Suggest at least 1 movie.")
    .max(10, "Cannot suggest more than 10 movies.")
    .default(3),
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
  const [suggestions, setSuggestions] = useState<string[] | null>(null)
  const [genreOptions, setGenreOptions] = useState<MultiSelectOption[]>([])
  const { toast } = useToast()

  useEffect(() => {
    async function fetchGenres() {
      try {
        const movieGenresMap = await getGenreMap("movie")
        const tvGenresMap = await getGenreMap("tv")

        const combinedGenres: Record<string, string> = {}
        Object.entries(movieGenresMap).forEach(([id, name]) => (combinedGenres[name] = name))
        Object.entries(tvGenresMap).forEach(([id, name]) => (combinedGenres[name] = name))

        const options = Object.keys(combinedGenres)
          .map((name) => ({ value: name, label: name }))
          .sort((a, b) => a.label.localeCompare(b.label))

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
      likedMovies: [],
      genrePreferences: [],
      count: 3,
    },
  })

  const onSubmit: SubmitHandler<SuggestionFormValues> = async (data) => {
    setIsLoading(true)
    setSuggestions(null)
    try {
      const input: MovieSuggestionsInput = {
        viewingHistory: data.viewingHistory,
        likedMovies: data.likedMovies,
        genrePreferences: data.genrePreferences,
        count: data.count,
      }
      const result: MovieSuggestionsOutput = await suggestMovies(input)
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
        description:
          error instanceof Error && error.message ? error.message : "Could not fetch suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-card/5 py-8 sm:py-12 lg:py-16">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight"
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI Movie{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Suggestions
            </span>
          </h1>
          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            style={{
              background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Tell us about your taste, and our AI will suggest movies you'll love!
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-2xl border-amber-500/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center">
                <ThumbsUp className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-amber-400" />
                Your Movie Preferences
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Help us understand your taste by sharing your movie history and preferences.
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6 sm:space-y-8">
                  {/* Viewing History */}
                  <FormField
                    control={form.control}
                    name="viewingHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base sm:text-lg font-semibold text-foreground flex items-center">
                          <Film className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-400" />
                          Movies You've Watched
                        </FormLabel>
                        <FormControl>
                          <MediaMultiSelect
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Add movies you've watched..."
                            triggerClassName="bg-input/50 border-border hover:border-amber-500/50 focus:border-amber-500 transition-colors min-h-[44px] w-full text-sm sm:text-base truncate placeholder:text-ellipsis placeholder:whitespace-nowrap placeholder:overflow-hidden"
                          />
                        </FormControl>
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
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-400" />
                          Movies You Liked
                        </FormLabel>
                        <FormControl>
                          <MediaMultiSelect
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Add movies you liked..."
                            triggerClassName="bg-input/50 border-border hover:border-red-500/50 focus:border-red-500 transition-colors min-h-[44px] w-full text-sm sm:text-base truncate placeholder:text-ellipsis placeholder:whitespace-nowrap placeholder:overflow-hidden"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Genre Preferences */}
                  <FormField
                    control={form.control}
                    name="genrePreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base sm:text-lg font-semibold text-foreground">
                          Preferred Genres
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={genreOptions}
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Select your favorite genres..."
                            triggerClassName="bg-input/50 border-border hover:border-primary/50 focus:border-primary transition-colors min-h-[44px] w-full text-sm sm:text-base truncate placeholder:text-ellipsis placeholder:whitespace-nowrap placeholder:overflow-hidden"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Number of Suggestions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                              className="bg-input/50 border-border hover:border-primary/50 focus:border-primary transition-colors h-11 w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading || genreOptions.length === 0}
                    className="w-full text-base sm:text-lg py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      boxShadow: "0 8px 32px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
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
            <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-amber-500/20">
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
                      className="flex items-center p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-green-500/30 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm sm:text-base mr-3 sm:mr-4">
                        {index + 1}
                      </div>
                      <p className="text-foreground font-medium text-sm sm:text-base leading-relaxed">{movie}</p>
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
