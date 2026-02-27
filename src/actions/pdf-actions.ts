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

    // Early validation: check if PDF content matches expected type
    const textLower = text.toLowerCase()
    const isWorkoutContent = /treino|exercício|repetição|série|aquecimento|peso|kg|carga|musculação|academia/.test(textLower)
    const isDietContent = /dieta|refeição|café|almoço|jantar|lanche|caloria|proteína|carboidrato|gordura|grama/.test(textLower)

    // If content clearly doesn't match type, return error early
    if (type === 'workout' && !isWorkoutContent && isDietContent) {
        return { error: 'Este PDF parece ser uma dieta, não um treino. Use a aba "Dieta" para importar arquivos de dieta.' }
    }
    if (type === 'diet' && !isDietContent && isWorkoutContent) {
        return { error: 'Este PDF parece ser um treino, não uma dieta. Use a aba "Treino" para importar arquivos de treino.' }
    }

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
3. **REPS MUST BE NUMBERS**: The "reps" field MUST contain only the target number of repetitions. If it is a range (e.g., "10-12"), use the highest number (e.g., "12"). NEVER include text like "movimentos", "repetições", or descriptions.
4. **Format**: warmup_sets and feeder_sets must be strings like "2x15". If multiple exist, join them like "2x15 + 1x10".
5. **Name Fixing**: Correct names like "SUPINOINCLINADO" to "SUPINO INCLINADO".
6. **Think First**: Use the "thought_process" field to explain your logic for each exercise before filling the data. This will help you find hidden warmup sets.

JSON SCHEMA:
{
    "thought_process": "...",
    "workouts": [
        {
            "name": "TREINO A",
            "day_of_week": 1,
            "exercises": [
                {
                    "name": "Exercício",
                    "sets": 3,
                    "reps": "10",
                    "rest": 60,
                    "warmup_sets": "2x15",
                    "feeder_sets": "1x10",
                    "notes": "Explicação técnica aqui"
                }
            ]
        }
    ]
}

STRICT INTENSITY TECHNIQUES PROTOCOL:
1. **Identify Grouped Exercises**: Look for words like "CONJUGADO", "BI-SET", "TRI-SET", "GIGANT-SET", "SUPER-SET". If two exercises are linked, add a note to BOTH exercises stating they are part of a bi-set/conjugado.
2. **Technique Detection**: Look for "DROP", "DROP-SET", "REST-PAUSE", "CLUSTER", "CLUSTER-SET", "PICO DE CONTRAÇÃO", "FALHA".
3. **Storage**: All these techniques should be written clearly in the "notes" field of the corresponding exercise.

TEXT TO ANALYZE:
${text}
`
                : `
You are a High-Precision Nutrition Data Extraction AI. You translate messy, poorly-formatted text extracted from PDF diets into perfectly structured JSON.

Your number one priority is to extract EVERY single meal and EVERY food item with its exact quantity and macros.

SPECIAL INSTRUCTION FOR MULTIPLE MENUS/OPTIONS:
If the PDF contains multiple distinct diet options or menus (e.g. "Cardápio 1", "Cardápio 2", "Opção A", "Opção B"), you MUST group them into an "options" array. Each option MUST have a descriptive name and its own set of meals. If there is only one menu, still use the "options" array with one element named "Cardápio Principal".

STRICT EXTRACTION PROTOCOL:
1. **Handle Messy Text**: PDF extraction often interleaves columns. If you see "Rice 100g Chicken 120g", treat them as separate items.
2. **Meal Identification**: Look for any meal headers: "Refeição", "Café", "Lanche", "Almoço", "Jantar", "Ceia", "Pré/Pós Treino", "Colação", "Desjejum".
3. **Food & Quantity**: For every food, find its weight (g, kg) or measure (colher, unidade, xícara). If a quantity is missing, estimate based on common sense for the meal type.
4. **Substitutions (OU/OR)**: If a line says "Alimento A OU Alimento B", you MUST extract Alimento A as the primary, and you can put "OU Alimento B" in the notes or simply ignore the substitute to keep it clean.
5. **Ignore Supplemental Info**: Do NOT extract instructions like "Cook with olive oil", "Drink water", or "Don't skip meals". Only extract the protocol.
6. **NO ERGOGENICS**: Absolutely ignore steroids, hormones, or medicine.
7. **Thought Process**: Explain how you separated the meals/options if the text was interleaved.

JSON SCHEMA:
{
    "thought_process": "Analysis of the PDF structure and meal layout...",
    "options": [
        {
            "name": "NOME DA OPÇÃO (ex: Cardápio 1 - Dia de Treino)",
            "meals": [
                {
                    "meal_name": "NOME DA REFEIÇÃO",
                    "foods": [
                        { "name": "Alimento", "quantity": "Quantidade (ex: 100g)", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
                    ]
                }
            ]
        }
    ]
}

TEXT TO ANALYZE:
${text}
`

            console.log(`[PDF] Sending ${text.length} chars to AI. Sample: ${text.substring(0, 100)}...`)
            parsedData = await callAI(client, prompt, DEFAULT_AI_MODEL, 8192)
            method = 'openrouter-ai'
            console.log(`[PDF] AI parse complete. Meals found: ${parsedData?.meals?.length || 0}`)
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
