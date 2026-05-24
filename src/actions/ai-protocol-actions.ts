'use server'

import { createClient } from '@/lib/supabase/server'

export interface AIProtocolPreferences {
  // Goal
  goal: 'bulking' | 'cutting' | 'maintenance'
  // Workout
  workoutSplit: string
  trainingVolume: 'low' | 'high'
  strongMuscles?: string
  weakMuscles?: string
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

  const goal = preferences.goal || details?.goal || 'maintenance'
  const caloricAdjustment = goal === 'cutting' ? -400
    : goal === 'bulking' ? +400 : 0
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
- Objetivo: ${goal.toUpperCase()}
- Divisão de treino preferida: ${splitDisplay}
- Volume: ${volumeDisplay}
- Pontos Fortes (Manutenção): ${preferences.strongMuscles || 'Não especificado'}
- Pontos Fracos (Prioridade): ${preferences.weakMuscles || 'Não especificado'}
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
          "warmup_sets": 2,
          "warmup_reps": "15",
          "feeder_sets": 1,
          "feeder_reps": "8",
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
      "frequency": "Conforme sugerido pela IA",
      "days_of_week": [2, 4, 6]
    }
  ],
  "diets": [
    {
      "diet_name": "Protocolo Alimentar - ${goal === 'bulking' ? 'Superávit' : goal === 'cutting' ? 'Déficit' : 'Manutenção'}",
      "meals": [
        {
          "meal_name": "Refeição 1",
          "foods": [
            { "name": "Ovo inteiro", "quantity": "3 unidades", "calories": 210, "protein": 18, "carbs": 0, "fat": 15, "fiber": 0 }
          ]
        }
      ]
    }
  ]
}

REGRAS:
- AQUECIMENTO E PREPARAÇÃO (WARMUP & FEEDERS): Para o PRIMEIRO exercício de cada grupo muscular principal no treino (ex: primeiro exercício de peito, primeiro de pernas, etc.), prescreva obrigatoriamente séries de aquecimento ("warmup_sets": 2, "warmup_reps": "15") e séries preparatórias ("feeder_sets": 1, "feeder_reps": "8") para preparar as articulações e o sistema neuromuscular. Para exercícios subsequentes do mesmo grupo muscular, defina warmup_sets e feeder_sets como 0, e warmup_reps e feeder_reps como "".
- QUANTIDADE DE EXERCÍCIOS: É OBRIGATÓRIO incluir a lista completa de exercícios para cada treino. NUNCA retorne apenas um exercício de exemplo! Cada treino ("workout") deve ter entre 5 e 8 exercícios na array "exercises".
- FREQUÊNCIA DE CARDIO: Se o objetivo for Cutting, prescreva cardio de 4 a 6 dias na semana (ex: [1, 2, 4, 5, 6]). Se for Bulking/Manutenção, 3 a 4 dias (ex: [1, 3, 5]). NUNCA prescreva menos de 3 dias de cardio.
- DURAÇÃO DO CARDIO: Entre 30 e 60 minutos por sessão.
- PRIORIZAÇÃO MUSCULAR: Se houver "Pontos Fracos", garanta que esses grupos tenham maior volume semanal ou sejam treinados no início da sessão. Para "Pontos Fortes", mantenha um volume de manutenção.
- MACRONUTRIENTES E FIBRAS: Seja extremamente preciso nos cálculos. Grãos (como aveia), vegetais e frutas DEVEM ter valores de fibras realistas. Não deixe fibras como 0 se o alimento for integral ou vegetal.
- Crie um treino para cada dia de treino decidido.
- Volume de treino: ${preferences.trainingVolume === 'low'
      ? 'LOW VOLUME — meta de ~4 séries diretas por grupo muscular por semana. Use 3-4 séries por exercício e selecione menos exercícios por sessão. Priorize alta intensidade e progressão de carga.'
      : 'HIGH VOLUME — meta de ~20 séries diretas por grupo muscular por semana. Use 4-5 séries por exercício e inclua mais exercícios por sessão, distribuídos ao longo da semana.'}
- REGRA DE VOLUME SINERGISTA (MUITO IMPORTANTE): Ao calcular o volume semanal de bíceps e tríceps, considere:
  • Cada exercício de EMPURRAR (supino, desenvolvimento, crucifixo, flies, tríceps pulley etc.) conta como 0,5 série para o TRÍCEPS.
  • Cada exercício de PUXAR (remada, puxada, serrote, pullover etc.) conta como 0,5 série para o BÍCEPS.
  • Séries diretas de bíceps (rosca direta, rosca alternada etc.) e tríceps (tríceps corda, barra etc.) contam como 1 série inteira.
  • Some todas as séries (diretas + sinergistas × 0,5) para garantir que o total semanal de bíceps e tríceps atinja a meta de volume.
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
- day_of_week (Workouts): 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb.
- DISTRIBUIÇÃO DOS DIAS: Espalhe os treinos ao longo da semana. NÃO use dias consecutivos se não for necessário.
- Cardios: Agrupe por tipo. Se um cardio deve ser feito 3x na semana, retorne UM objeto no array 'cardios' com 'days_of_week' contendo os dias. Nunca use comentários dentro do array.
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
