
"use client";

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { suggestMovies, MovieSuggestionsInput, MovieSuggestionsOutput } from '@/ai/flows/movie-suggestions';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Film, ThumbsUp, CheckCircle, Heart, Info } from 'lucide-react';
import { getGenreMap } from '@/lib/tmdb';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { MediaMultiSelect } from '@/components/ui/media-multi-select';
import { useFavorites } from '@/context/FavoritesContext';
import { Switch } from "@/components/ui/switch"; // Added Switch import
import { Label } from "@/components/ui/label"; // Added Label import

const suggestionFormSchema = z.object({
  viewingHistory: z.array(z.string().min(1, "Movie title cannot be empty."))
                   .min(1, "Please add at least one movie you've watched.")
                   .max(10, "Please add no more than 10 watched movies."),
  likedMovies: z.array(z.string().min(1, "Movie title cannot be empty."))
                // .min(1, "Please add at least one movie you liked.") // Making this optional if includeFavorites is true
                .max(10, "Please add no more than 10 liked movies.")
                .default([]),
  genrePreferences: z.array(z.string())
                     .min(1, "Please select at least one genre.")
                     .max(10, "Please select no more than 10 genres."),
  count: z.coerce.number().min(1, "Suggest at least 1 movie.").max(10, "Cannot suggest more than 10 movies.").default(3),
  includeFavorites: z.boolean().default(true), // Added for the switch
});

type SuggestionFormValues = z.infer<typeof suggestionFormSchema>;

export default function SuggestionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [genreOptions, setGenreOptions] = useState<MultiSelectOption[]>([]);
  const { toast } = useToast();
  const { favorites } = useFavorites();

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues: {
      viewingHistory: [],
      likedMovies: [],
      genrePreferences: [],
      count: 3,
      includeFavorites: true, // Default to true
    },
  });

  useEffect(() => {
    async function fetchGenres() {
      try {
        const movieGenresMap = await getGenreMap('movie');
        const tvGenresMap = await getGenreMap('tv');
        
        const combinedGenres: Record<string, string> = {};
        Object.entries(movieGenresMap).forEach(([id, name]) => combinedGenres[name] = name); 
        Object.entries(tvGenresMap).forEach(([id, name]) => combinedGenres[name] = name);

        const options = Object.keys(combinedGenres)
          .map(name => ({ value: name, label: name }))
          .sort((a, b) => a.label.localeCompare(b.label));
        
        setGenreOptions(options);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        toast({
          title: "Error",
          description: "Could not load genre options.",
          variant: "destructive",
        });
      }
    }
    fetchGenres();
  }, [toast]);


  const onSubmit: SubmitHandler<SuggestionFormValues> = async (data) => {
    setIsLoading(true);
    setSuggestions(null);

    if (data.likedMovies.length === 0 && !data.includeFavorites && favorites.length === 0) {
        toast({
            title: "Input Required",
            description: "Please add at least one liked movie or enable 'Include Favorites' if you have favorites.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }


    try {
      let finalLikedMovies = [...data.likedMovies];
      if (data.includeFavorites && favorites.length > 0) {
        const favoriteTitles = favorites.map(fav => fav.title);
        finalLikedMovies = Array.from(new Set([...finalLikedMovies, ...favoriteTitles]));
      }
      
      if (finalLikedMovies.length === 0 && data.viewingHistory.length > 0 && data.genrePreferences.length > 0) {
         // If no liked movies are provided (either via form or favorites), but other fields are, it's still a valid scenario.
         // However, the prompt works best with liked movies.
         // No specific error, but AI might perform suboptimally.
      }


      const input: MovieSuggestionsInput = {
        viewingHistory: data.viewingHistory,
        likedMovies: finalLikedMovies,
        genrePreferences: data.genrePreferences,
        count: data.count,
      };
      const result: MovieSuggestionsOutput = await suggestMovies(input);
      setSuggestions(result.suggestions);
      toast({
        title: "Suggestions Ready!",
        description: "Here are some movies you might like.",
        variant: "default",
        action: <CheckCircle className="text-green-500" />,
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast({
        title: "Error Fetching Suggestions",
        description: (error instanceof Error && error.message) ? error.message : "Could not fetch suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const includeFavoritesValue = form.watch("includeFavorites");

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card className="shadow-2xl border-primary/30 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <ThumbsUp className="w-8 h-8 mr-3" /> AI Movie Suggestions
          </CardTitle>
          <CardDescription className="text-muted-foreground flex items-start gap-2">
            <Info className="w-5 h-5 mt-0.5 text-accent flex-shrink-0"/>
            <span>
              Tell us about your taste, and our AI will suggest movies you might love! 
              {favorites.length > 0 
                ? " You can choose to include your existing favorites below." 
                : " Add some movies to your favorites for even better suggestions!"}
            </span>
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="viewingHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="viewingHistory" className="text-lg text-foreground/90">Movies You&apos;ve Watched</FormLabel>
                    <FormControl>
                      <MediaMultiSelect
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Search and add movies you've watched..."
                        triggerClassName="bg-input border-border focus:border-primary data-[state=open]:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="likedMovies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="likedMovies" className="text-lg text-foreground/90">Other Movies You Liked</FormLabel>
                    <FormControl>
                       <MediaMultiSelect
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Search and add more movies you liked..."
                        triggerClassName="bg-input border-border focus:border-primary data-[state=open]:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {favorites.length > 0 && (
                <FormField
                  control={form.control}
                  name="includeFavorites"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-input/50">
                      <div className="space-y-0.5">
                        <FormLabel htmlFor="includeFavoritesSwitch" className="text-base text-foreground/90 flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-primary/80"/>
                          Include Your Favorites?
                        </FormLabel>
                        <CardDescription className="text-xs">
                          Consider your {favorites.length} favorited item(s) for these suggestions.
                        </CardDescription>
                      </div>
                      <FormControl>
                        <Switch
                          id="includeFavoritesSwitch"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="genrePreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="genrePreferences" className="text-lg text-foreground/90">Preferred Genres</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={genreOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select your favorite genres..."
                        triggerClassName="bg-input border-border focus:border-primary data-[state=open]:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="count" className="text-lg text-foreground/90">Number of Suggestions</FormLabel>
                    <FormControl>
                      <Input
                        id="count"
                        type="number"
                        min="1"
                        max="10"
                        className="w-24 bg-input border-border focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || genreOptions.length === 0} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? <LoadingSpinner size={24} className="mr-2" /> : <ThumbsUp className="w-5 h-5 mr-2" />}
                Get Suggestions
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="mt-8 text-center">
          <LoadingSpinner size={48} />
          <p className="text-muted-foreground mt-2">Our AI is thinking...</p>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <Card className="mt-12 shadow-lg border-accent/30 bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-accent flex items-center">
              <Film className="w-7 h-7 mr-3" /> Here are your suggestions:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-lg text-foreground/90">
              {suggestions.map((movie, index) => (
                <li key={index}>{movie}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {suggestions && suggestions.length === 0 && !isLoading && (
         <Card className="mt-12 shadow-lg border-destructive/30 bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-destructive flex items-center">
              <AlertTriangle className="w-7 h-7 mr-3" /> No Suggestions Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              We couldn&apos;t find any suggestions based on your input. Try being more specific or broader with your preferences.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
