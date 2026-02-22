import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createOpenRouterClient, callAI, DEFAULT_AI_MODEL } from '@/lib/ai-client';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { text, type } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        let client;
        try {
            client = createOpenRouterClient();
        } catch {
            return NextResponse.json({
                error: 'Chave da API OpenRouter não configurada. Adicione OPENROUTER_API_KEY ao .env.local.'
            }, { status: 500 });
        }

        const prompt = type === 'workout'
            ? `
You are a fitness expert AI. Extract structured Workouts, Cardios and Ergogenic resources (steroids/supplements) from the following text.
IMPORTANT:
- Fix any concatenated exercise names (e.g. "CADEIRAFLEXORA" → "CADEIRA FLEXORA").
- Cardios and Ergogenics often come in the same PDF as workouts.
- Capture warmup_sets and feeder_sets if mentioned.

Return ONLY valid JSON (no markdown) with this structure:
{
    "workouts": [
        {
            "name": "Workout Name (e.g. SEGUNDA-FEIRA)",
            "day_of_week": 1,
            "exercises": [
                {
                    "name": "Exercise Name",
                    "sets": 3,
                    "reps": "8-12",
                    "rest": 60,
                    "warmup_sets": "2x15",
                    "feeder_sets": "1x12"
                }
            ]
        }
    ],
    "cardios": [
        { "type": "string", "duration": "string", "intensity": "string", "frequency": "string" }
    ],
    "ergogenics": [
        { "name": "string", "dosage": "string", "weekly_dosage": 1, "unit": "ml", "application_days": [1,4], "notes": "string" }
    ]
}
Use integers for sets and rest (in seconds). day_of_week: 1=Mon, 2=Tue, ..., 7=Sun.
warmup_sets and feeder_sets are optional strings like "2x15" — omit if not found.

TEXT TO PARSE:
${text}
`
            : `
You are a nutritionist expert AI. Extract a structured Diet and Ergogenic resources from the following text.
For each food item, estimate macronutrients based on quantity if not explicitly stated.

Return ONLY valid JSON (no markdown) with this structure:
{
    "diets": [
        {
            "diet_name": "Diet Name",
            "meals": [
                {
                    "meal_name": "Meal Name",
                    "foods": [
                        {
                            "name": "Food Name",
                            "quantity": "100g",
                            "calories": 0,
                            "protein": 0,
                            "carbs": 0,
                            "fat": 0
                        }
                    ]
                }
            ]
        }
    ],
    "ergogenics": [
        { "name": "string", "dosage": "string", "weekly_dosage": 1, "unit": "ml", "application_days": [1,4], "notes": "string" }
    ]
}

TEXT TO PARSE:
${text}
`;

        const parsedData = await callAI(client, prompt, DEFAULT_AI_MODEL);

        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error("AI Route Error:", error.message);
        return NextResponse.json({
            error: 'Erro ao processar o PDF com IA. Por favor, tente novamente.',
            details: error.message
        }, { status: 500 });
    }
}
