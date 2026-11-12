// src/ai/openrouter.ts

/**
 * OpenRouter client for free AI models
 */

// User provided OpenRouter API Key as default fallback

export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "DEFAULT_OPENROUTER_KEY";
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Curated list of active free models on OpenRouter.
 * The client attempts these in order if upstream rate-limits (429) or temporary outages occur.
 */
export const FREE_MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'liquid/lfm-2.5-2.6b:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'liquid/lfm-3-1.7b:free',
  'cohere/north-mini-code:free',
  'baidu/ernie-5.5-flash-preview:free',
];

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionOptions {
  messages: ChatMessage[];
  models?: string[];
  temperature?: number;
  response_format?: { type: 'json_object' | 'text' };
  signal?: AbortSignal;
}

/**
 * Safely parse JSON from LLM responses, stripping codeblocks or preamble
 */
export function extractJsonFromText<T = any>(text: string): T {
  let cleaned = text.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // Extract innermost matching braces if there's surrounding text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned) as T;
}

/**
 * Execute chat completion via OpenRouter with automatic fallback across free models
 */
export async function chatCompletion(options: ChatCompletionOptions): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY || "DEFAULT_OPENROUTER_KEY";
  const candidateModels = options.models && options.models.length > 0 ? options.models : FREE_MODELS;

  let lastError: Error | null = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://movista.app',
          'X-Title': 'Movista AI',
        },
        body: JSON.stringify({
          model,
          messages: options.messages,
          temperature: options.temperature ?? 0.7,
          response_format: options.response_format,
        }),
        signal: options.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.error?.message || `HTTP ${response.status} from model ${model}`;
        console.warn(`[OpenRouter] Model ${model} returned error: ${errorMsg}. Trying fallback...`);
        lastError = new Error(errorMsg);
        continue;
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string') {
        console.warn(`[OpenRouter] Model ${model} returned empty content. Trying fallback...`);
        lastError = new Error(`Empty response from ${model}`);
        continue;
      }

      return content;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      console.warn(`[OpenRouter] Connection error with model ${model}: ${err.message}. Trying fallback...`);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error('All OpenRouter free models failed to respond.');
}

