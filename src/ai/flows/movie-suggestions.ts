// src/ai/flows/movie-suggestions.ts
'use server';

/**
 * @fileOverview Movie suggestion AI agent powered by OpenRouter free models.
 *
 * - suggestMovies - A function that suggests movies based on viewing history and liked movies.
 * - MovieSuggestionsInput - The input type for the suggestMovies function.
 * - MovieSuggestionsOutput - The return type for the suggestMovies function.
 */

import { z } from 'zod';
import { chatCompletion, extractJsonFromText } from '../openrouter';

const MovieSuggestionsInputSchema = z.object({
  moods: z.array(z.string()).describe('A list of moods the user wants in their movie suggestions.'),
  likedMovies: z.array(z.string()).describe('A list of movies the user liked (or last liked movie).'),
  genrePreferences: z.array(z.string()).describe('An array of preferred movie genres for the user'),
  count: z.number().default(3).describe('The number of movie suggestions to return.'),
  moodText: z.string().optional().describe('A free-text description of what the user is in the mood for.'),
  decade: z.string().optional().describe('Preferred decade for the movie.'),
  language: z.string().optional().describe('Preferred language for the movie.'),
  viewingHistory: z.array(z.string()).optional(),
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
  const validatedInput = MovieSuggestionsInputSchema.parse(input);
  const count = validatedInput.count || 3;

  const systemPrompt = `You are a professional movie recommendation engine.
You MUST suggest exactly ${count} real films. Never invent fake or hallucinated movies.
You MUST respond STRICTLY with valid JSON conforming to this schema:
{
  "suggestions": [
    {
      "title": "Movie Title",
      "year": 2021,
      "genres": ["Genre1", "Genre2"],
      "reason": "1-sentence reason connecting to user preferences"
    }
  ]
}

STRICT CRITERIA:
1. Suggest real, verifiable movies only.
2. Ensure genres and tone align closely with user preferences.
3. Do not suggest movies already listed in the user's liked movies or viewing history.
4. Output strictly the JSON object. Do not wrap in conversational chatter.`;

  const userParts: string[] = [];

  if (validatedInput.likedMovies && validatedInput.likedMovies.length > 0) {
    userParts.push(`- Liked movies: ${validatedInput.likedMovies.join(', ')}`);
  }

  if (validatedInput.viewingHistory && validatedInput.viewingHistory.length > 0) {
    userParts.push(`- Viewing history (avoid repeating): ${validatedInput.viewingHistory.join(', ')}`);
  }

  if (validatedInput.genrePreferences && validatedInput.genrePreferences.length > 0) {
    userParts.push(`- Preferred genres: ${validatedInput.genrePreferences.join(', ')}`);
  }

  if (validatedInput.moods && validatedInput.moods.length > 0) {
    userParts.push(`- Desired moods/tone: ${validatedInput.moods.join(', ')}`);
  }

  if (validatedInput.moodText) {
    userParts.push(`- Additional mood details: "${validatedInput.moodText}"`);
  }

  if (validatedInput.decade) {
    userParts.push(`- Preferred decade: ${validatedInput.decade}`);
  }

  if (validatedInput.language) {
    userParts.push(`- Preferred language: ${validatedInput.language}`);
  }

  userParts.push(`- Number of suggestions needed: ${count}`);

  const userPrompt = `Please recommend movies matching the following user preferences:\n${userParts.join('\n')}`;

  const responseContent = await chatCompletion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  try {
    const parsed = extractJsonFromText<MovieSuggestionsOutput>(responseContent);
    const validatedOutput = MovieSuggestionsOutputSchema.parse(parsed);
    return validatedOutput;
  } catch (parseError) {
    console.error('[OpenRouter] Failed to parse JSON response:', responseContent, parseError);
    throw new Error('Received an invalid recommendation format from the AI model. Please try again.');
  }
}
