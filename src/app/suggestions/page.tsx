
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'; // Keep Label if used directly, but FormLabel is preferred within FormField
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { suggestMovies, MovieSuggestionsInput, MovieSuggestionsOutput } from '@/ai/flows/movie-suggestions';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Film, ThumbsUp, CheckCircle } from 'lucide-react';

const suggestionFormSchema = z.object({
  viewingHistory: z.string().min(1, "Please enter at least one movie you've watched.").max(500, "Viewing history is too long."),
  likedMovies: z.string().min(1, "Please enter at least one movie you liked.").max(500, "Liked movies list is too long."),
  genrePreferences: z.string().min(1, "Please tell us your preferred genres.").max(200, "Genre preferences are too long."),
  count: z.coerce.number().min(1, "Suggest at least 1 movie.").max(10, "Cannot suggest more than 10 movies.").default(3),
});

type SuggestionFormValues = z.infer<typeof suggestionFormSchema>;

export default function SuggestionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const { toast } = useToast();

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues: {
      viewingHistory: '',
      likedMovies: '',
      genrePreferences: '',
      count: 3,
    },
  });

  const onSubmit: SubmitHandler<SuggestionFormValues> = async (data) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const input: MovieSuggestionsInput = {
        viewingHistory: data.viewingHistory.split(',').map(s => s.trim()).filter(Boolean),
        likedMovies: data.likedMovies.split(',').map(s => s.trim()).filter(Boolean),
        genrePreferences: data.genrePreferences.split(',').map(s => s.trim()).filter(Boolean),
        count: data.count,
      };
      const result: MovieSuggestionsOutput = await suggestMovies(input);
      setSuggestions(result.suggestions);
      toast({
        title: "Suggestions Ready!",
        description: "Here are some movies you might like.",
        variant: "default",
        action: <CheckCircle className="text-green-500" />, // Using a standard checkmark from lucide
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

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card className="shadow-2xl border-primary/30 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <ThumbsUp className="w-8 h-8 mr-3" /> AI Movie Suggestions
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Tell us about your taste, and our AI will suggest movies you might love! Separate multiple entries with commas.
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
                      <Textarea
                        id="viewingHistory"
                        placeholder="e.g., Inception, The Matrix, Interstellar"
                        className="min-h-[80px] bg-input border-border focus:border-primary"
                        {...field}
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
                    <FormLabel htmlFor="likedMovies" className="text-lg text-foreground/90">Movies You Liked</FormLabel>
                    <FormControl>
                      <Textarea
                        id="likedMovies"
                        placeholder="e.g., Parasite, Spirited Away"
                        className="min-h-[80px] bg-input border-border focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genrePreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="genrePreferences" className="text-lg text-foreground/90">Preferred Genres</FormLabel>
                    <FormControl>
                      <Input
                        id="genrePreferences"
                        placeholder="e.g., Sci-Fi, Thriller, Animation"
                        className="bg-input border-border focus:border-primary"
                        {...field}
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
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
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
