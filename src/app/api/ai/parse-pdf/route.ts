import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { getGeminiApiKey } from '@/actions/app-settings-actions';

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

        // Prioriza chave do banco de dados, fallback para env
        const apiKey = await getGeminiApiKey();
        if (!apiKey) {
            return NextResponse.json({ 
                error: 'Chave da API Gemini não configurada. Configure no painel admin.' 
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = type === 'workout'
            ? `
            You are a fitness expert AI. Extract structured Workouts and Cardios from the following text.
            IMPORTANT: Cardios often come in the same PDF as workouts. Look for items like "Cardio: 20 min esteira", "30 minutos bike", "HIIT 15 min", etc.
            
            Return ONLY valid JSON with this structure:
            {
                "workouts": [
                    {
                        "name": "Workout Name",
                        "exercises": [
                            { "name": "Exercise Name", "sets": number, "reps": "string range", "rest": number }
                        ]
                    }
                ],
                "cardios": [
                    { "type": "string (e.g. esteira, bike)", "duration": "string (e.g. 20 min)", "intensity": "string", "frequency": "string (daily, post-workout, etc)" }
                ]
            }
            Use integers for 'sets' and 'rest' (in seconds). If missing, use reasonable defaults (3 sets, 60s rest).
            TEXT TO PARSE:
            ${text}
            `
            : `
            You are a nutritionist expert AI. Extract a structured Diet from the following text.
            For EACH meal, calculate the total macronutrients (calories, protein, carbs, fat) based on average reliable nutritional values.
            
            Return ONLY valid JSON with this structure:
            {
                "diets": [
                    {
                        "meal_name": "Meal Name (e.g. Café da manhã)",
                        "foods": [
                            { 
                                "name": "Food Name", 
                                "quantity": "Quantity (e.g. 3 unidades, 100g)",
                                "calories": number,
                                "protein": number,
                                "carbs": number,
                                "fat": number,
                                "needs_review": boolean (set true if food is unrecognized or weight is unclear)
                            }
                        ],
                        "totals": {
                            "calories": number,
                            "protein": number,
                            "carbs": number,
                            "fat": number
                        }
                    }
                ]
            }
            All nutritional values (calories, protein, carbs, fat) MUST be numbers.
            TEXT TO PARSE:
            ${text}
            `;

        const parseWithRetry = async (retryCount = 0): Promise<any> => {
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const textResponse = response.text();
                const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(jsonString);
            } catch (error: any) {
                if (retryCount < 1) {
                    console.warn(`AI Parse attempt ${retryCount + 1} failed, retrying...`, error.message);
                    return parseWithRetry(retryCount + 1);
                }
                throw error;
            }
        };

        const parsedData = await parseWithRetry();

        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error("AI Route Error:", error.message);
        return NextResponse.json({
            error: 'Erro ao processar o PDF com IA. Por favor, tente novamente ou insira manualmente.',
            details: error.message
        }, { status: 500 });
    }
}
