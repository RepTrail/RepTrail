'use server'

import { createClient } from '@/lib/supabase/server'
import { parseWorkoutLocally, parseDietLocally } from '@/lib/pdf-parser-local'

export async function parseUploadedPdf(filePath: string, type: 'workout' | 'diet') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    console.log(`[PDF] Starting parse: path=${filePath}, type=${type}`)

    // 1. Download file from Storage
    console.log(`[PDF] Downloading from Supabase storage...`)
    const { data, error } = await supabase.storage.from('pdfs').download(filePath)

    if (error || !data) {
        console.error(`[PDF] Download failed:`, error)
        return { error: 'Failed to download file: ' + error?.message }
    }
    console.log(`[PDF] Download OK, blob size: ${data.size} bytes`)

    // 2. Extract raw text with pdf-parse
    let text = ''
    try {
        console.log(`[PDF] Converting blob to buffer...`)
        const arrayBuffer = await data.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        console.log(`[PDF] Buffer size: ${buffer.length} bytes`)

        // Polyfill for DOMMatrix (required by pdf-parse internals)
        if (typeof (global as any).DOMMatrix === 'undefined') {
            ; (global as any).DOMMatrix = class DOMMatrix {
                m11 = 1; m12 = 0; m13 = 0; m14 = 0
                m21 = 0; m22 = 1; m23 = 0; m24 = 0
                m31 = 0; m32 = 0; m33 = 1; m34 = 0
                m41 = 0; m42 = 0; m43 = 0; m44 = 1
                constructor(_arg?: any) { }
                toString() { return 'matrix(1, 0, 0, 1, 0, 0)' }
            }
        }

        const pdfParse = require('pdf-parse')
        const pdfData = await pdfParse(buffer)
        text = pdfData.text
        console.log(`[PDF] Extracted ${text.length} characters of text`)

        if (!text || text.trim().length === 0) throw new Error('No text extracted from PDF')
    } catch (e: any) {
        console.error(`[PDF] Parse error:`, e)
        return { error: 'Failed to process file: ' + e.message }
    }

    // 3. Try AI parsing first (OpenRouter), fallback to local parser
    let parsedData: any = null
    let method = 'local-parser'

    const openrouterKey = process.env.OPENROUTER_API_KEY
    if (openrouterKey) {
        try {
            console.log(`[PDF] Calling AI (OpenRouter) for structured parsing...`)
            const { createOpenRouterClient, callAI, DEFAULT_AI_MODEL } = await import('@/lib/ai-client')
            const client = createOpenRouterClient(openrouterKey)

            const prompt = type === 'workout'
                ? `
You are a surgical Fitness Data Extraction AI. You translate messy Portuguese gym PDFs into structured JSON.

Your number one priority is to find PREPARATORY SETS (Aquecimento/Warmup/Feeder) and separate them from WORKING SETS.

STRICT EXTRACTION PROTOCOL:
1. **Analyze every line**: Look for numbers near words like "aquecimento", "manguito", "preparação", "mobilidade", "ativação", "feeder", "aproximação", "vão", "antes", "subindo carga".
2. **Never Merge**: If the text says "2x15, 1x10, 3x8-12", the "3x8-12" are the ONLY ones that go into "sets". The others MUST go into "warmup_sets" or "feeder_sets".
3. **Format**: warmup_sets and feeder_sets must be strings like "2x15". If multiple exist, join them like "2x15 + 1x10".
4. **Name Fixing**: Correct names like "SUPINOINCLINADO" to "SUPINO INCLINADO".
5. **Think First**: Use the "thought_process" field to explain your logic for each exercise before filling the data. This will help you find hidden warmup sets.

JSON SCHEMA:
{
    "thought_process": "Write here your analysis of the PDF structure and where you found the warmup details...",
    "workouts": [
        {
            "name": "TREINO A",
            "day_of_week": 1,
            "exercises": [
                {
                    "name": "Exercício",
                    "sets": 3,
                    "reps": "10",
                    "rest": 180,
                    "warmup_sets": "2x15",
                    "feeder_sets": "1x10"
                }
            ]
        }
    ],
    "cardios": [],
    "ergogenics": []
}

TEXT TO ANALYZE:
${text}
`
                : `
You are a surgical Nutrition Data Extraction AI. You translate messy Portuguese diet PDFs into structured JSON.

Your number one priority is to extract EVERY meal and EVERY food item with its quantity and macros.

STRICT EXTRACTION PROTOCOL:
1. **Analyze every meal**: Look for headers like "Refeição", "Café", "Almoço", "Lanche", "Jantar", "Ceia", "Pré-treino", "Pós-treino".
2. **Food Details**: Extract the name and quantity (grams, units, spoons). 
3. **Macro Estimation**: If the PDF doesn't state calories, protein, carbs, and fat for a food item, ESTIMATE THEM based on clinical nutrition tables (standard values for 100g and then scale). 
4. **Substitutions**: If a food has an "OU" (OR) option, prioritize the first one but you can include the others in the name if brief.
5. **DO NOT EXTRACT ERGOGENICS**: Ignore any mention of hormones, steroids, or performance-enhancing protocols. Do not include them in meals either.
6. **Think First**: Use the "thought_process" field to explain your analysis of the diet structure.

JSON SCHEMA:
{
    "thought_process": "Analysis of the meals and foods found...",
    "meals": [
        {
            "meal_name": "CAFÉ DA MANHÃ",
            "foods": [
                { "name": "Frango Grelhado", "quantity": "100g", "calories": 165, "protein": 31, "carbs": 0, "fat": 3.6 }
            ]
        }
    ]
}

TEXT TO ANALYZE:
${text}
`

            parsedData = await callAI(client, prompt, DEFAULT_AI_MODEL)
            method = 'openrouter-ai'
            console.log(`[PDF] AI parse complete via OpenRouter`)
        } catch (aiErr: any) {
            console.warn(`[PDF] AI parse failed (${aiErr.message}), falling back to local parser`)
        }
    }

    // 4. Fallback: local regex parser
    if (!parsedData) {
        try {
            console.log(`[PDF] Running local parser for type=${type}`)
            parsedData = type === 'workout' ? parseWorkoutLocally(text) : parseDietLocally(text)
            console.log(`[PDF] Local parse complete`)
        } catch (parseError: any) {
            console.error('[PDF] Local Parse Error:', parseError.message)
            return { error: 'Falha ao processar o texto do PDF: ' + parseError.message }
        }
    }

    const responseData = {
        type,
        raw_text_preview: text.substring(0, 200) + '...',
        parsed_data: parsedData,
        method,
    }

    console.log(`[PDF] Success! Method: ${method}`)
    return { success: true, data: responseData }
}
