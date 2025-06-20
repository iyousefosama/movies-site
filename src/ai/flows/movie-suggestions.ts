// src/ai/flows/movie-suggestions.ts
'use server';

/**
 * @fileOverview Movie suggestion AI agent.
 *
 * - suggestMovies - A function that suggests movies based on viewing history and liked movies.
 * - MovieSuggestionsInput - The input type for the suggestMovies function.
 * - MovieSuggestionsOutput - The return type for the suggestMovies function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MovieSuggestionsInputSchema = z.object({
  moods: z.array(z.string()).describe('A list of moods the user wants in their movie suggestions.'),
  likedMovies: z.array(z.string()).describe('A list of movies the user liked (or last liked movie).'),
  genrePreferences: z.array(z.string()).describe('An array of preferred movie genres for the user'),
  count: z.number().default(3).describe('The number of movie suggestions to return.'),
  moodText: z.string().optional().describe('A free-text description of what the user is in the mood for.'),
  decade: z.string().optional().describe('Preferred decade for the movie.'),
  language: z.string().optional().describe('Preferred language for the movie.'),
});
export type MovieSuggestionsInput = z.infer<typeof MovieSuggestionsInputSchema>;

const MovieSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        title: z.string(),
        year: z.number(),
        genres: z.array(z.string()),
        reason: z.string(),
      })
    )
    .describe('An array of suggested movie objects based on the user input.'),
});
export type MovieSuggestionsOutput = z.infer<typeof MovieSuggestionsOutputSchema>;

export async function suggestMovies(input: MovieSuggestionsInput): Promise<MovieSuggestionsOutput> {
  console.log('👉 Input to suggestMovies:', JSON.stringify(input, null, 2));
  const result = await suggestMoviesFlow(input);
  console.log('✅ Suggestions Returned:', result.suggestions);
  return result;
}

const prompt = ai.definePrompt({
  name: 'movieSuggestionsPrompt',
  input: { schema: MovieSuggestionsInputSchema },
  output: { schema: MovieSuggestionsOutputSchema },
  prompt: `
  You are a professional movie recommendation engine. Suggest exactly {{count}} real films that match ALL these criteria:
  
  1. **CORE MATCHING** (MUST FOLLOW):
     - {{#if likedMovies}}Prioritize movies similar to: {{likedMovies}}{{/if}}
     - {{#if genrePreferences}}Only suggest genres from: {{genrePreferences}}{{/if}}
     - {{#if moods}}Tone must match these moods: {{moods}}{{/if}}
  
  2. **CONTEXT** (OPTIONAL):
     {{#if moodText}}User description: "{{moodText}}"{{/if}}
     {{#if decade}}Decade preference: {{decade}}{{/if}}
     {{#if language}}Language preference: {{language}}{{/if}}
  
  3. **STRICT RULES**:
     - Never suggest genres outside the user's preferences
     - Never suggest movies in viewingHistory/likedMovies
     - Never invent fake movies (verify against TMDB)
     - {{#if moods}}If "Funny" in moods, prioritize comedies{{/if}}
     - {{#if moods}}If "Feel-Good" in moods, avoid dark/depressing films{{/if}}
  
  4. **OUTPUT FORMAT**:
     For each suggestion include:
     - Title (with exact year)
     - 2-3 main genres (must match user preferences)
     - 1-sentence reason connecting to their input
  
  Now suggest {{count}} movies following ALL rules above:
  `,
});

const suggestMoviesFlow = ai.defineFlow(
  {
    name: 'suggestMoviesFlow',
    inputSchema: MovieSuggestionsInputSchema,
    outputSchema: MovieSuggestionsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
