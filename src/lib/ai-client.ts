import OpenAI from 'openai'

/**
 * Creates an OpenAI-compatible client pointed at OpenRouter.
 * OpenRouter supports GPT-4o, Claude, Gemini, Llama, etc.
 * All via the same OpenAI SDK interface.
 *
 * Priority: OPENROUTER_API_KEY env var → passed apiKey argument
 */
export function createOpenRouterClient(apiKey?: string | null) {
    const key = apiKey || process.env.OPENROUTER_API_KEY
    if (!key) throw new Error('OPENROUTER_API_KEY não configurada.')

    return new OpenAI({
        apiKey: key,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://reptrail.app',
            'X-Title': 'RepTrail',
        },
    })
}

/**
 * Default model to use for structured JSON extraction tasks.
 * Can be overridden per-call. OpenRouter model IDs:
 *   google/gemini-2.0-flash-001  – fast, smart, cheap
 *   openai/gpt-4o-mini           – reliable JSON extraction
 *   meta-llama/llama-3.3-70b-instruct – great free option
 */
export const DEFAULT_AI_MODEL = 'google/gemini-2.0-flash-001'

/**
 * Calls the AI and returns parsed JSON, with 1 retry on parse failure.
 */
export async function callAI<T = any>(
    client: OpenAI,
    prompt: string,
    model: string = DEFAULT_AI_MODEL
): Promise<T> {
    const attempt = async (): Promise<T> => {
        const completion = await client.chat.completions.create({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
        })

        const text = completion.choices[0]?.message?.content || ''
        // Strip any accidental markdown fences
        const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
        return JSON.parse(clean) as T
    }

    try {
        return await attempt()
    } catch {
        console.warn('[AI] First attempt failed, retrying...')
        return await attempt()
    }
}
