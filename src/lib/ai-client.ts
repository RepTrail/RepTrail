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
    console.log('DEBUG: AI API key check:', {
        hasKey: !!key,
        keyLength: key?.length,
        envHasKey: !!process.env.OPENROUTER_API_KEY,
        envKeyLength: process.env.OPENROUTER_API_KEY?.length
    })

    if (!key) {
        console.error('ERROR: OPENROUTER_API_KEY não configurada.')
        throw new Error('OPENROUTER_API_KEY não configurada.')
    }

    const client = new OpenAI({
        apiKey: key,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://reptrail.app',
            'X-Title': 'RepTrail',
        },
    })

    console.log('DEBUG: AI client created successfully')
    return client
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
    model: string = DEFAULT_AI_MODEL,
    maxTokens?: number
): Promise<T> {
    console.log('DEBUG: callAI starting:', { model, promptLength: prompt.length })

    const attempt = async (): Promise<T> => {
        try {
            console.log('DEBUG: Making AI request...')
            const completion = await client.chat.completions.create({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
                max_tokens: (arguments as any)[3] || undefined,
            })

            console.log('DEBUG: AI response received:', {
                choices: completion.choices?.length,
                content: completion.choices[0]?.message?.content?.substring(0, 100) + '...'
            })

            const text = completion.choices[0]?.message?.content || ''
            // Strip any accidental markdown fences
            const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
            console.log('DEBUG: Cleaned response:', clean)

            const parsed = JSON.parse(clean) as T
            console.log('DEBUG: Parsed JSON successfully:', parsed)
            return parsed
        } catch (error) {
            console.error('DEBUG: AI request failed:', error)
            throw error
        }
    }

    try {
        return await attempt()
    } catch (error) {
        console.warn('[AI] First attempt failed, retrying...', error)
        return await attempt()
    }
}
