'use server'

import { createClient } from '@/lib/supabase/server'
import { saveParsedData } from '@/actions/save-actions'
import { revalidatePath } from 'next/cache'

export interface AIProtocolPreferences {
  // Workout
  workoutSplit: string
  trainingVolume: 'low' | 'high'   // NEW
  trainingDaysPerWeek: number
  sessionDurationMinutes: number
  // Cardio
  cardioLikes: string
  cardioDislikes: string
  // Diet
  mealsPerDay: number
  foodLikes: string
  foodDislikes: string
  dietaryRestrictions: string
}

export async function generateAIProtocol(preferences: AIProtocolPreferences) {
  const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado.' }

  // Fetch profile + student_details separately
  const [{ data: profileData }, { data: details }] = await Promise.all([
    supabase.from('profiles').select('full_name, email').eq('id', user.id).single(),
    supabase.from('student_details').select('current_weight, starting_weight, height, body_fat, activity_level, goal').eq('id', user.id).maybeSingle()
  ])

  if (!profileData) return { error: 'Perfil não encontrado.' }

  const openrouterKey = process.env.OPENROUTER_API_KEY
  if (!openrouterKey) return { error: 'Serviço de IA não configurado.' }

  // Use current_weight or starting_weight, fallback to 75
  const weight = details?.current_weight || details?.starting_weight || 75
  const height = details?.height || 175
  const bf = details?.body_fat || 15
  const lbm = weight * (1 - bf / 100)

  // Katch-McArdle BMR
  const bmr = Math.round(370 + 21.6 * lbm)

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
    athlete: 1.9
  }
  const multiplier = activityMultipliers[details?.activity_level || ''] || 1.55
  const tdee = Math.round(bmr * multiplier)

  const goal = details?.goal || 'Hipertrofia'
  const goalLower = goal.toLowerCase()
  const caloricAdjustment = goalLower.includes('emagre') || goalLower.includes('perda') ? -400
    : goalLower.includes('massa') || goalLower.includes('hipertrofi') ? +300 : 0
  const targetCalories = tdee + caloricAdjustment

  // Macro split
  const proteinG = Math.round(lbm * 2.2)
  const fatG = Math.round(targetCalories * 0.25 / 9)
  const carbG = Math.round((targetCalories - proteinG * 4 - fatG * 9) / 4)

  const splitNames: Record<string, string> = {
    ppl: 'PPL (Push, Pull, Legs)',
    upper_lower: 'Upper/Lower',
    one_group: '1 grupo muscular por semana',
    full_body: 'Full Body'
  }
  const splitDisplay = splitNames[preferences.workoutSplit] || preferences.workoutSplit
  const volumeDisplay = preferences.trainingVolume === 'low'
    ? 'Low Volume (~4 séries por grupo muscular por semana, alta intensidade)'
    : 'High Volume (~20 séries por grupo muscular por semana, volume elevado)'

  const prompt = `
Você é um Personal Trainer e Nutricionista de elite. Crie um protocolo completo e individualizado baseado nos dados abaixo.

## DADOS DO ATLETA
- Nome: ${profileData.full_name || 'Atleta'}
- Peso: ${weight}kg | Altura: ${height}cm | BF: ${bf}%
- Massa Magra: ${lbm.toFixed(1)}kg
- TMB (Katch-McArdle): ${bmr} kcal
- TDEE: ${tdee} kcal
- Objetivo: ${goal}
- Calorias-alvo: ${targetCalories} kcal
- Proteína: ${proteinG}g | Carboidrato: ${carbG}g | Gordura: ${fatG}g

## PREFERÊNCIAS DO ATLETA
- Divisão de treino: ${splitDisplay}
- Volume: ${volumeDisplay}
- Dias de treino por semana: ${preferences.trainingDaysPerWeek}
- Duração por sessão: ${preferences.sessionDurationMinutes} minutos
- Cardio que GOSTA: ${preferences.cardioLikes || 'Todos'}
- Cardio que NÃO gosta: ${preferences.cardioDislikes || 'Nenhum'}
- Refeições por dia: ${preferences.mealsPerDay}
- Alimentos que GOSTA: ${preferences.foodLikes || 'Todos'}
- Alimentos que NÃO gosta: ${preferences.foodDislikes || 'Nenhum'}
- Restrições alimentares: ${preferences.dietaryRestrictions || 'Nenhuma'}

## INSTRUÇÃO
Retorne SOMENTE um JSON válido com esta estrutura exata. Não adicione markdown, não adicione explicações antes ou depois do JSON.

{
  "workouts": [
    {
      "name": "TREINO A - EMPURRAR",
      "day_of_week": 1,
      "exercises": [
        {
          "name": "Supino Reto com Barra",
          "sets": 4,
          "reps": "10",
          "rest": 90,
          "warmup_sets": "2x15",
          "notes": "Controle na descida, 3 segundos"
        }
      ]
    }
  ],
  "cardios": [
    {
      "type": "Esteira - Caminhada Inclinada",
      "duration": "30",
      "intensity": "Moderado - 65-70% FCM",
      "frequency": "${preferences.trainingDaysPerWeek} vezes por semana",
      "days_of_week": [2, 4, 6]
    }
  ],
  "diets": [
    {
      "diet_name": "Protocolo Alimentar - ${goal === 'muscle_gain' ? 'Superávit' : goal === 'fat_loss' ? 'Déficit' : 'Manutenção'}",
      "meals": [
        {
          "meal_name": "Refeição 1",
          "foods": [
            { "name": "Ovo inteiro", "quantity": "3 unidades", "calories": 210, "protein": 18, "carbs": 0, "fat": 15 }
          ]
        }
      ]
    }
  ]
}

REGRAS:
- Crie ${preferences.trainingDaysPerWeek} treinos, um para cada dia
- Volume de treino: ${preferences.trainingVolume === 'low'
      ? 'LOW VOLUME — meta de ~4 séries diretas por grupo muscular por semana. Use 3-4 séries por exercício e selecione menos exercícios por sessão. Priorize alta intensidade e progressão de carga.'
      : 'HIGH VOLUME — meta de ~20 séries diretas por grupo muscular por semana. Use 4-5 séries por exercício e inclua mais exercícios por sessão, distribuídos ao longo da semana.'}
- REGRA DE VOLUME SINERGISTA (MUITO IMPORTANTE): Ao calcular o volume semanal de bíceps e tríceps, considere:
  • Cada exercício de EMPURRAR (supino, desenvolvimento, crucifixo, flies, tríceps pulley etc.) conta como 0,5 série para o TRÍCEPS.
  • Cada exercício de PUXAR (remada, puxada, serrote, pullover etc.) conta como 0,5 série para o BÍCEPS.
  • Séries diretas de bíceps (rosca direta, rosca alternada etc.) e tríceps (tríceps corda, barra etc.) contam como 1 série inteira.
  • Some todas as séries (diretas + sinergistas × 0,5) para garantir que o total semanal de bíceps e tríceps atinja a meta de volume.
- Cada treino deve caber em ${preferences.sessionDurationMinutes} minutos
- O cardio deve usar APENAS os tipos que o atleta gosta: ${preferences.cardioLikes || 'qualquer tipo'}
- Evite os tipos que não gosta: ${preferences.cardioDislikes || 'nenhum'}
- A dieta deve ter exatamente ${preferences.mealsPerDay} refeições
- NOMES DAS REFEIÇÕES: Use SOMENTE "Refeição 1", "Refeição 2", "Refeição 3"... sem horários, sem nomes descritivos.
- DISTRIBUIÇÃO CALÓRICA DAS REFEIÇÕES:
${preferences.mealsPerDay === 4 ? `  • 4 refeições: Refeição 1 = leve (~15% das calorias, iniciar metabolismo) | Refeição 2 = pesada (~35%, almoço principal) | Refeição 3 = moderada (~30%, pré-treino com carboidratos) | Refeição 4 = moderada (~20%, pós-treino com proteína)`
      : preferences.mealsPerDay === 6 ? `  • 6 refeições: Refeição 1 = leve (~10%) | Refeição 2 = pesada (~25%, principal do dia) | Refeição 3 = moderada (~15%, lanche) | Refeição 4 = moderada (~20%, pré-treino) | Refeição 5 = moderada (~20%, pós-treino) | Refeição 6 = leve (~10%, última do dia)`
        : `  • Distribua as calorias de forma que a segunda refeição seja a mais calórica do dia e a última seja leve. A penúltima deve ser pré-treino (carboidratos) e a última pós-treino (proteína).`}
- Use apenas alimentos que o atleta gosta: ${preferences.foodLikes || 'qualquer alimento'}
- Evite: ${preferences.foodDislikes || 'nenhum'} e respeite as restrições: ${preferences.dietaryRestrictions || 'nenhuma'}
- Macros total das refeições devem somar aproximadamente: ${proteinG}g proteína, ${carbG}g carbs, ${fatG}g gordura
- day_of_week: 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
`

  try {
    const { createOpenRouterClient, callAI, DEFAULT_AI_MODEL } = await import('@/lib/ai-client')
    const client = createOpenRouterClient(openrouterKey)
    const rawResponse = await callAI(client, prompt, DEFAULT_AI_MODEL, 8192)

    // Parse JSON from AI response (strip any markdown wrapping)
    let parsedData: any
    try {
      const jsonStr = typeof rawResponse === 'string'
        ? rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        : JSON.stringify(rawResponse)
      parsedData = typeof rawResponse === 'object' ? rawResponse : JSON.parse(jsonStr)
    } catch (e) {
      return { error: 'A IA retornou um formato inesperado. Tente novamente.' }
    }

    // 🧠 ELITE AI PROTOCOL: No direct saving on server. 
    // We return the raw protocol so the client can handle persistence (Outbox/Cache)
    return {
      success: true,
      data: parsedData,
      summary: {
        workoutsCount: parsedData.workouts?.length || 0,
        cardiosCount: parsedData.cardios?.length || 0,
        dietsCount: parsedData.diets?.length || 0,
        targetCalories,
        proteinG,
        carbG,
        fatG,
      }
    }

  } catch (err: any) {
    console.error('[AI PROTOCOL]', err)
    return { error: err.message || 'Erro inesperado. Tente novamente.' }
  }
}

export async function checkStudentHasProtocol(userId: string) {
  const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

  const [{ data: workouts }, { data: diets }] = await Promise.all([
    supabase.from('assigned_workouts').select('id').eq('student_id', userId).eq('active', true).limit(1),
    supabase.from('assigned_diets').select('id').eq('student_id', userId).eq('active', true).limit(1),
  ])

  return {
    hasWorkout: (workouts?.length || 0) > 0,
    hasDiet: (diets?.length || 0) > 0,
  }
}
