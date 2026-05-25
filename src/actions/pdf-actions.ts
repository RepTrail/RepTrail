'use server'

import { createClient } from '@/lib/supabase/server'
import { parseWorkoutLocally, parseDietLocally } from '@/lib/pdf-parser-local'

export async function parseUploadedPdf(filePath: string, type: 'workout' | 'diet') {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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

    // Auto-detect PDF type by counting text matching keyword frequencies
    const textLower = text.toLowerCase()
    const workoutMatches = (textLower.match(/treino|exercício|repetição|série|aquecimento|peso|kg|carga|musculação|academia/g) || []).length;
    const dietMatches = (textLower.match(/dieta|refeição|café|almoço|jantar|lanche|caloria|proteína|carboidrato|gordura|grama/g) || []).length;
    const resolvedType = workoutMatches >= dietMatches ? 'workout' : 'diet';

    console.log(`[PDF] Auto-detected resolvedType: ${resolvedType} (workoutMatches=${workoutMatches}, dietMatches=${dietMatches})`);

    const openrouterKey = process.env.OPENROUTER_API_KEY
    if (openrouterKey) {
        try {
            console.log(`[PDF] Calling AI (OpenRouter) for structured parsing...`)
            const { createOpenRouterClient, callAI, DEFAULT_AI_MODEL } = await import('@/lib/ai-client')
            const client = createOpenRouterClient(openrouterKey)

            const prompt = resolvedType === 'workout'
                ? `
You are a surgical Fitness Data Extraction AI. You translate messy Portuguese gym PDFs into structured JSON.

 Your number one priority is to find PREPARATORY SETS (Aquecimento/Warmup/Feeder) and separate them from WORKING SETS.

STRICT EXTRACTION PROTOCOL:
1. **Identify Student**: Look for "Aluno", "Nome", "Atleta" or similar at the top of the text. Return it in a top-level field "detected_student_name".
2. **Analyze every line**: Look for numbers near words like "aquecimento", "manguito", "preparação", "mobilidade", "ativação", "feeder", "aproximação", "vão", "antes", "subindo carga".
3. **Day Mapping**: If you find "TREINO A", set "day_of_week": 1. "TREINO B" -> 2, "TREINO C" -> 3, etc. 
   CRITICAL: Look for specific days like "SEGUNDA", "TERÇA", "SEG/QUA/SEX", "TER/QUI/SAB". Map them to numeric arrays [1,2,3,4,5,6,7] where 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun.
   If "TODOS OS DIAS", "DIARIAMENTE" or "DAILY" is found, use [1,2,3,4,5,6,7]. 
   If "SEG/QUA/SEX" is found, result MUST be [1,3,5]. If "TER/QUI" is found, result MUST be [2,4].
4. **Never Merge**: If the text says "2x15, 1x10, 3x8-12", the "3x8-12" are the ONLY ones that go into "sets". The others MUST go into "warmup_sets" or "feeder_sets".
5. **REPS/SETS MUST BE PRIMITIVES**: The "reps" and "sets" fields MUST be strings or numbers. NEVER use objects or arrays.
6. **Format**: warmup_sets and feeder_sets must be strings like "2x15". 
7. **No Hallucinated Objects**: Do not return data as {"reps": "10", "sets": 2} inside another field. Stick to the schema.

JSON SCHEMA:
{
    "thought_process": "...",
    "detected_student_name": "Marcos Silva",
    "workouts": [
        {
            "name": "TREINO A - PEITO E TRÍCEPS",
            "day_of_week": 1,
            "exercises": [...]
        }
    ],
    "cardios": [
        { "type": "Esteira ou Bike", "duration": "30min", "intensity": "Moderada", "frequency": "3x/sem", "application_days": [1,3,5] }
    ],
STRICT CARDIO PROTOCOL:
1. **Handle Options**: If the text says "Esteira ou Bike", return ONE entry with type "Esteira ou Bike".
2. **Ignore Examples**: Do NOT extract cardios from sections that are clearly examples (e.g. "ex. caminhada de 1 min"). Only extract the main prescription.
3. **Deduplicate**: Do not repeat the same cardio multiple times.
    "ergogenics": [
        { "name": "Testo", "dosage": "250mg", "weekly_dosage": 250, "unit": "mg", "application_days": [1], "notes": "Aplicar no glúteo (NÃO REPITA OS DIAS AQUI)" },
        { "name": "Omega 3", "dosage": "4un", "weekly_dosage": 28, "unit": "un", "application_days": [1,2,3,4,5,6,0], "notes": "Cápsulas (NÃO REPITA OS DIAS AQUI)" }
    ]
}

STRICT GROUPING PROTOCOL:
1. **Mandatory Grouping**: All exercises belonging to the same workout session (e.g., "TREINO A", "TREINO B", or a specific muscle group block) MUST be grouped into a single workout object in the "workouts" array. 
2. **Do NOT Fragment**: Never create a separate workout object for each individual exercise. A workout object should be a collection of exercises.
3. **Headers as Names**: Use the workout headers found in the text (like "TREINO A - PEITO") as the "name" for the workout object.
4. **Day Logic**: All exercises in "TREINO A" should share the same "day_of_week".

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
If the PDF contains multiple distinct diet options or menus (e.g. "Cardápio 1", "Cardápio 2", "Opção A", "Opção B"), you MUST group them into an "options" array. Each option MUST have a descriptive name, its own set of meals, AND specific days of the week if mentioned (e.g. "Segunda a Sexta" -> [1,2,3,4,5]). If no days are mentioned, use [0,1,2,3,4,5,6].

STRICT EXTRACTION PROTOCOL:
1. **Identify Student**: Find the name after "Aluno", "Paciente" or "Cliente". Return it in "detected_student_name".
2. **Handle Messy Text**: PDF extraction often interleaves columns. Separate them.
3. **Meal Identification**: Look for headers: "Refeição", "Café", "Almoço", "Jantar", "Ceia", etc.
4. **Food & Quantity**: Extract weight (g, kg) or measure.
5. **Ergogenics**: Extract steroids/supplements into the "ergogenics" array.
6. **Days of Week**: Always look for "Segunda", "Terça", etc., or "Seg/Qua/Sex" and map to [1,2,3,4,5,6,7] (1=Mon, 7=Sun). 
   CRITICAL: If you see "SEG/QUA/SEX", result MUST be [1,3,5]. If you see "TER/QUI/SAB", result MUST be [2,4,6]. If no days are mentioned but the context implies it's the main diet, use [1,2,3,4,5,6,7].

JSON SCHEMA:
{
    "thought_process": "...",
    "detected_student_name": "Marcos Silva",
    "options": [
        {
            "name": "Cardápio Principal",
            "days_of_week": [1, 2, 3, 4, 5],
            "meals": [
                {
                    "meal_name": "Café da Manhã",
                    "foods": [
                        { "name": "Ovos", "quantity": "3 un", "calories": 0, "protein": 18, "carbs": 2, "fat": 15 }
                    ]
                }
            ]
        }
    ],
    "cardios": [
        { "type": "Esteira ou Bike", "duration": "30min", "intensity": "Moderada", "frequency": "3x/sem", "application_days": [1,3,5] }
    ],
STRICT CARDIO PROTOCOL:
1. **Handle Options**: If the text says "Esteira ou Bike", return ONE entry with type "Esteira ou Bike".
2. **Ignore Examples**: Do NOT extract cardios from sections that are clearly examples (e.g. "ex. caminhada de 1 min"). Only extract the main prescription.
3. **Deduplicate**: Do not repeat the same cardio multiple times.
    "ergogenics": [
        { "name": "Testosterona", "dosage": "250mg", "weekly_dosage": 250, "unit": "mg", "application_days": [1,4], "notes": "Seg/Qui" },
        { "name": "Omega 3", "dosage": "4un", "weekly_dosage": 28, "unit": "un", "application_days": [1,2,3,4,5,6,0], "notes": "Diário" }
    ]
}

TEXT TO ANALYZE:
${text}
`

            console.log(`[PDF] Sending ${text.length} chars to AI. Sample: ${text.substring(0, 100)}...`)
            parsedData = await callAI(client, prompt, DEFAULT_AI_MODEL, 4096)
            method = 'openrouter-ai'
            const mealCount = parsedData?.meals?.length || (parsedData?.options || []).reduce((acc: number, opt: any) => acc + (opt.meals?.length || 0), 0)
            console.log(`[PDF] AI parse complete. Meals found: ${mealCount}`)
        } catch (aiErr: any) {
            console.warn(`[PDF] AI parse failed (${aiErr.message}), falling back to local parser`)
        }
    }

    // 4. Fallback: local regex parser
    if (!parsedData) {
        try {
            console.log(`[PDF] Running local parser for type=${resolvedType}`)
            parsedData = resolvedType === 'workout' ? parseWorkoutLocally(text) : parseDietLocally(text)
            console.log(`[PDF] Local parse complete`)
        } catch (parseError: any) {
            console.error('[PDF] Local Parse Error:', parseError.message)
            return { error: 'Falha ao processar o texto do PDF: ' + parseError.message }
        }
    }

    // 5. Post-processing: extract cardio, ergogenics, and student name from raw text
    const { extractStudentName, extractCardioFromText, extractErgogenicsFromText, ERGOGENIC_KEYWORDS } = await import('@/lib/pdf-post-processors')

    const detectedStudentName = extractStudentName(text)
    const detectedCardios = extractCardioFromText(text)
    const detectedErgogenics = extractErgogenicsFromText(text)

    console.log(`[PDF] Post-processing: name=${detectedStudentName}, cardios=${detectedCardios.length}, ergogenics=${detectedErgogenics.length}`)

    // Merge: only fill in if parser/AI didn't already populate
    if (!parsedData.cardios?.length && detectedCardios.length > 0) {
        // Group similar cardios to avoid duplicates from different paragraphs
        const uniqueCardios = Array.from(new Map(detectedCardios.map(c => [`${c.type}-${c.duration}`, c])).values());
        parsedData.cardios = uniqueCardios
    }
    if (!parsedData.ergogenics?.length && detectedErgogenics.length > 0) {
        // Deduplicate ergogenics by name (case insensitive)
        const ergoMap = new Map();
        detectedErgogenics.forEach(e => {
            const key = e.name.toUpperCase().trim();
            if (!ergoMap.has(key) || (e.dosage && !ergoMap.get(key).dosage)) {
                ergoMap.set(key, e);
            }
        });
        parsedData.ergogenics = Array.from(ergoMap.values());
    }

    // ─── DEDUPLICATION: Remove ergogenics from meals ─────────────────────────
    // If an item was identified as an ergogenic, it shouldn't appear as a food item in the diet.
    const ergoTerms = new Set([
        ...(parsedData.ergogenics || []).map((e: any) => e.name.toUpperCase()),
        ...Object.keys(ERGOGENIC_KEYWORDS)
    ]);
    
    if (ergoTerms.size > 0) {
        const cleanMeals = (meals: any[]) => {
            return meals.map(meal => ({
                ...meal,
                foods: meal.foods?.filter((f: any) => {
                    const foodName = (f.name || f.food || '').toUpperCase();
                    // Block if exact match OR if the food name contains a known ergogenic keyword
                    return !Array.from(ergoTerms).some(term => 
                        foodName === term || 
                        (term.length > 3 && foodName.includes(term))
                    );
                }) || []
            })).filter(meal => meal.foods.length > 0);
        };

        if (parsedData.ergogenics?.length > 0) {
            parsedData.ergogenics = parsedData.ergogenics.map((e: any) => {
                // Strictly sanitize unit to match database constraints (mg, ml, un, g, mcg)
                let rawUnit = (e.unit || 'mg').toLowerCase().trim();
                
                // Common AI parsing patterns to clean up
                if (rawUnit.includes('mg')) rawUnit = 'mg';
                else if (rawUnit.includes('ml')) rawUnit = 'ml';
                else if (rawUnit.includes('un')) rawUnit = 'un';
                else if (rawUnit.includes('mcg')) rawUnit = 'mcg';
                else if (rawUnit.includes('g')) rawUnit = 'g';
                else rawUnit = 'mg'; // Default fallback that satisfies the constraint

                let notes = (e.notes || '').replace(/^["']|["']$/g, '').trim();
                const daysStr = (e.application_days || []).map((d: number) => ['dom','seg','ter','qua','qui','sex','sab'][d]).join('/');
                
                // If notes just repeat the days, clear them
                const cleanNotes = notes.toLowerCase().replace(/\s/g, '');
                const cleanDays = daysStr.replace(/\s/g, '');
                
                if (cleanNotes === cleanDays || 
                    notes.toLowerCase() === 'diário' || 
                    notes.toLowerCase() === 'diario' ||
                    notes.toLowerCase() === 'todos os dias' ||
                    notes.toLowerCase() === daysStr.toLowerCase() ||
                    (notes.toLowerCase().includes('/') && cleanNotes === cleanDays.replace(/\//g, ''))) {
                    notes = '';
                }

                return {
                    ...e,
                    unit: rawUnit,
                    notes: notes
                };
            });
        }

        if (resolvedType === 'diet') {
            if (parsedData.options?.length > 0) {
                parsedData.options = parsedData.options.map((opt: any) => ({
                    ...opt,
                    meals: cleanMeals(opt.meals || [])
                }));
            } else if (parsedData.meals?.length > 0) {
                parsedData.meals = cleanMeals(parsedData.meals);
            }
        }
    }

    // ─── AUTO-CALCULATE MACROS FOR PREVIEW ──────────────────────────────────
    if (resolvedType === 'diet' && parsedData) {
        console.log(`[PDF] Triggering auto-macro calculation for preview...`);
        const { estimateMacrosForFoodList } = await import('@/actions/diet-actions');
        
        const allFoods: any[] = [];
        if (parsedData.options?.length > 0) {
            parsedData.options.forEach((opt: any) => {
                opt.meals?.forEach((meal: any) => {
                    meal.foods?.forEach((food: any) => allFoods.push(food));
                });
            });
        } else if (parsedData.meals?.length > 0) {
            parsedData.meals.forEach((meal: any) => {
                meal.foods?.forEach((food: any) => allFoods.push(food));
            });
        }

        if (allFoods.length > 0) {
            try {
                const estimates = await estimateMacrosForFoodList(allFoods);
                estimates.forEach((est: any) => {
                    const food = allFoods[est.index];
                    if (food) {
                        food.protein = est.protein;
                        food.carbs = est.carbs;
                        food.fat = est.fat;
                        food.fiber = est.fiber;
                        food.calories = (est.protein * 4) + (est.carbs * 4) + (est.fat * 9);
                    }
                });
                console.log(`[PDF] Preview macros calculated for ${allFoods.length} items.`);
            } catch (err) {
                console.error("[PDF] Macro calculation error:", err);
            }
        }
    }

    const responseData = {
        type: resolvedType,
        raw_text_preview: text.substring(0, 200) + '...',
        parsed_data: parsedData,
        method,
        detected_student_name: detectedStudentName || parsedData.detected_student_name,
    }

    console.log(`[PDF] Success! Method: ${method}`)
    return { success: true, data: responseData }
}
