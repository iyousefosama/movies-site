// src/ai/flows/movie-suggestions.ts
'use server';

/**
 * @fileOverview Movie suggestion AI agent.
 *
 * - suggestMovies - A function that suggests movies based on viewing history and liked movies.
 * - MovieSuggestionsInput - The input type for the suggestMovies function.
 * - MovieSuggestionsOutput - The return type for the suggestMovies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MovieSuggestionsInputSchema = z.object({
  viewingHistory: z
    .array(z.string())
    .describe('An array of movie titles the user has watched.'),
  likedMovies: z
    .array(z.string())
    .describe('An array of movie titles the user has liked.'),
  genrePreferences: z
    .array(z.string())
    .describe('An array of preferred movie genres for the user'),
  count: z.number().default(3).describe('The number of movie suggestions to return.'),
});
export type MovieSuggestionsInput = z.infer<typeof MovieSuggestionsInputSchema>;

const MovieSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested movie titles based on the user input.'),
});
export type MovieSuggestionsOutput = z.infer<typeof MovieSuggestionsOutputSchema>;

export async function suggestMovies(input: MovieSuggestionsInput): Promise<MovieSuggestionsOutput> {
  return suggestMoviesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'movieSuggestionsPrompt',
  input: {schema: MovieSuggestionsInputSchema},
  output: {schema: MovieSuggestionsOutputSchema},
  prompt: `You are a movie expert. You will suggest movies to the user based on their viewing history and liked movies.

Consider the viewing history, liked movies and genre preferences to create the list of suggestions.

Viewing History: {{viewingHistory}}
Liked Movies: {{likedMovies}}
Genre Preferences: {{genrePreferences}}

Suggest {{count}} movies. Return only the movie titles. Do not include any other information or explanation.
`,
});

const suggestMoviesFlow = ai.defineFlow(
  {
    name: 'suggestMoviesFlow',
    inputSchema: MovieSuggestionsInputSchema,
    outputSchema: MovieSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
