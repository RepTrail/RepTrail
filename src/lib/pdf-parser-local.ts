
export interface ParsedExercise {
    name: string;
    sets: number;
    reps: string;
    rest: number;
    warmup_sets?: string;
    feeder_sets?: string;
    notes?: string;
}

export interface ParsedWorkout {
    name: string;
    day_of_week: number;
    exercises: ParsedExercise[];
}

export interface ParsedFood {
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface ParsedMeal {
    meal_name: string;
    foods: ParsedFood[];
}

/**
 * Inserts spaces in concatenated exercise names extracted from PDF.
 * pdf-parse v1 merges adjacent layout cells without spaces.
 * Examples: "CADEIRAFLEXORA" → "CADEIRA FLEXORA"
 */
function fixExerciseName(name: string): string {
    let fixed = name.trim().toUpperCase()

    // Insert space before common Portuguese connectors when glued to a word
    // e.g. "BARRAOU" → "BARRA OU", "HALTERESOU" → "HALTERES OU"
    fixed = fixed.replace(/([A-ZÁÀÃÂÉÊÍÓÕÔÚÇ])(OU\b)/g, '$1 $2')
    fixed = fixed.replace(/([A-ZÁÀÃÂÉÊÍÓÕÔÚÇ])(NO\b|NA\b|NOS\b|NAS\b|NO\s|NA\s)/g, '$1 $2')
    fixed = fixed.replace(/([A-ZÁÀÃÂÉÊÍÓÕÔÚÇ])(COM\b|DE\b|DO\b|DA\b|DOS\b|DAS\b)/g, '$1 $2')
    fixed = fixed.replace(/([A-ZÁÀÃÂÉÊÍÓÕÔÚÇ])(AO\b|AOS\b|E\b)/g, '$1 $2')

    // Known Portuguese gym word splits (greedy left-to-right matching)
    const splits: [RegExp, string][] = [
        // Cadeira variants
        [/CADEIRA(FLEXORA|ADUTORA|ABDUTORA|EXTENSORA)/g, 'CADEIRA $1'],
        // Desenvolvimento
        [/DESENVOLVIMENTO(MAQUINA|MÁQUINA|HALTER|BARRA|OMBRO)/g, 'DESENVOLVIMENTO $1'],
        // Gêmeos / panturrilha
        [/GEMEOS(SENTADO|EM PE|EMPE|LIVRE|NA MAQUINA)/g, 'GEMEOS $1'],
        [/PANTURRILHA(SENTADA|EM PE|EMPE)/g, 'PANTURRILHA $1'],
        // Terra / Romeno
        [/TERRA(ROMENO)/g, 'TERRA $1'],
        // Tríceps
        [/TRICEPS(CORDA|BARRA|HALTER|MAQUINA|PULLEY|TESTA|FRANCES)/g, 'TRICEPS $1'],
        [/BICEPS(BARRA|HALTER|CORDA|MARTELO|SCOTT|CONCENTRADO)/g, 'BICEPS $1'],
        // Corda
        [/CORDA(UNILATERAL|BILATERAL|ALTA|BAIXA)/g, 'CORDA $1'],
        // Rosca variants
        [/ROSCA(DIRETA|ALTERNADA|MARTELO|CONCENTRADA|SCOTT|INVERSA|CABO)/g, 'ROSCA $1'],
        // Remada
        [/REMADA(NA|NO|COM|UNILATERAL|BILATERAL|CAVALINHO|OVERHAND|UNDERHAND)/g, 'REMADA $1'],
        [/REMADA(LITTLE|ANALITTLE)/g, 'REMADA NA LITTLE'],
        // Supino
        [/SUPINO(RETO|INCLINADO|DECLINADO|HALTER|MAQUINA|BARRA)/g, 'SUPINO $1'],
        // Leg
        [/LEG(PRESS|CURL|EXTENSION|ABDUCTOR|ADDUCTOR)/g, 'LEG $1'],
        // Pulley / Pulldown
        [/PULLEY(ARTICULADO|FRENTE|COSTAS|UNILATERAL|BILATERAL)/g, 'PULLEY $1'],
        [/PULL(DOWN|DOWM|DWN)/g, 'PULLDOWN'],
        // Elevação
        [/ELEVACAO(LATERAL|FRONTAL|45|UNILATERAL)/g, 'ELEVACAO $1'],
        [/ELEVAÇÃO(LATERAL|FRONTAL|45|UNILATERAL)/g, 'ELEVAÇÃO $1'],
        // Crucifixo
        [/CRUCIFIXO(RETO|INCLINADO|DECLINADO|CABO|MAQUINA)/g, 'CRUCIFIXO $1'],
        // Fly
        [/FLY(INVERSO|RETO|INCLINADO)/g, 'FLY $1'],
        // Agachamento
        [/AGACHAMENTO(LIVRE|SMITH|HACK|SUMÔ|SUMO|BULGARO)/g, 'AGACHAMENTO $1'],
        // Face pull
        [/FACE(PULL)/g, 'FACE $1'],
        // Abdominal
        [/ABDOMINAIS(NO|NA|COM|CABO|SOLO)/g, 'ABDOMINAIS $1'],
        [/ABDOMINAL(NO|NA|COM|CABO|SOLO)/g, 'ABDOMINAL $1'],
        // Common connector cleanup
        [/\s{2,}/g, ' '],
    ]

    for (const [pattern, replacement] of splits) {
        fixed = fixed.replace(pattern, replacement)
    }

    // Title-case: keep all caps for Brazilian gym style
    return fixed.trim()
}

/**
 * Extracts sets/reps/rest from a line like:
 * "3x10-12 | rest: 60s" or "3 séries x 10 reps | 60s"
 */
function extractSetsReps(line: string): Partial<ParsedExercise> | null {
    // Pattern: "3x8-12" or "3 x 8" or "3 séries 10-12"
    const xPattern = line.match(/(\d+)\s*[xX×]\s*(\d+(?:[-–]\d+)?(?:\s*(?:reps|rep)?)?)/i)
    if (xPattern) {
        const restMatch = line.match(/(\d+)\s*s(?:eg|ec)?(?:\.|\b)/i)
        return {
            sets: parseInt(xPattern[1]),
            reps: xPattern[2].replace(/\s*(reps?)/i, '').trim(),
            rest: restMatch ? parseInt(restMatch[1]) : 60
        }
    }
    return null
}

export function parseWorkoutLocally(text: string) {
    const workouts: ParsedWorkout[] = []
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

    let currentWorkout: ParsedWorkout | null = null
    let currentDay = 1
    let pendingFeeder: string | null = null
    let pendingWarmup: string | null = null

    const dayMap: Record<string, number> = {
        'SEGUNDA': 1, 'TERÇA': 2, 'TERCA': 2, 'QUARTA': 3,
        'QUINTA': 4, 'SEXTA': 5, 'SABADO': 6, 'SÁBADO': 6, 'DOMINGO': 7,
        'TREINO A': 1, 'TREINO B': 2, 'TREINO C': 3, 'TREINO D': 4, 'TREINO E': 5, 'TREINO F': 6
    }

    // Lines that are pure noise (not exercise names or metadata we care about)
    const noisePatterns = [
        /^PAGE\s*\d+/i,
        /^OF\s*\d+/i,
        /^[-—_·•]+$/,
        /INSTRUÇÕES/i,
        /OBSERVAÇÕES/i,
        /IMPORTANTE:/i,
        /NOTAÇÃO/i,
        /NOTATION/i,
        /PRÓXIMO CICLO/i,
        /INTERVALO ENTRE/i,
        /CADA MÚSCULO/i,
        /GRUPAMENTO/i,
        /MUSCULAÇÃO/i,
        /TREINAMENTO:/i,
        /TEMPO SOBRE TENSÃO/i,
        /INTENSIDADE:/i,
        /AMPLITUDE:/i,
        /ALONGAMENTO/i,
        /VOCÊ DEVE/i,
        /TERMOS DE USO/i,
        /%RM/,
        /\bCARGA\b/i,
    ]

    // Keywords that indicate it's a day/workout header
    const dayHeaderPattern = /TREINO|DIA\s*[A-Z]|SEGUNDA|TERÇA|QUARTA|QUINTA|SEXTA|SABADO|DOMINGO/i

    // Feeder / warmup line detection
    const feederPattern = /^FEEDER[\s:]/i
    const warmupPattern = /^(AQUECIMENTO|WARMUP|WARM.UP)[\s:]/i
    const workingSetPattern = /^(WORKING\s*SET|SÉRIE\s*PRINCIPAL|EXECUÇÃO)[\s:]/i

    const cardios: any[] = []
    
    for (const line of lines) {
        const upperLine = line.toUpperCase()

        // Skip pure noise
        if (noisePatterns.some(p => p.test(line))) continue
        if (upperLine.startsWith('(') && upperLine.endsWith(')') && line.length < 60) continue

        // --- Detect cardio in workout ---
        if (/ESTEIRA|BIKE|BICICLETA|CARDIO|AEROBICO|AERÓBICO/i.test(upperLine) && /(\d+)\s*(min|'|m\b)/i.test(upperLine)) {
            const durMatch = upperLine.match(/(\d+)\s*(min|'|m\b)/i)
            if (durMatch) {
                cardios.push({
                    type: upperLine.includes('ESTEIRA') ? 'Esteira' : (upperLine.includes('BIKE') || upperLine.includes('BICICLETA') ? 'Bike' : 'Cardio'),
                    duration: durMatch[1] + ' min',
                    intensity: 'Moderada',
                    frequency: 'Diário'
                })
                continue
            }
        }

        // --- Detect day ---
        let detectedDay = 0
        for (const day in dayMap) {
            if (upperLine.includes(day)) {
                detectedDay = dayMap[day]
                break
            }
        }
        
        // Secondary day detection: "TREINO - A" or "DIA 1"
        if (!detectedDay) {
            const letterMatch = upperLine.match(/TREINO\s*[-–]?\s*([A-F])\b/);
            if (letterMatch) {
                detectedDay = letterMatch[1].charCodeAt(0) - 64; // A=1, B=2...
            }
            const numMatch = upperLine.match(/DIA\s*(\d)\b/);
            if (numMatch) {
                detectedDay = parseInt(numMatch[1]);
            }
        }

        if (detectedDay) currentDay = detectedDay

        // --- Detect workout header ---
        if (dayHeaderPattern.test(upperLine) && upperLine.length < 60) {
            if (currentWorkout && currentWorkout.exercises.length > 0) {
                workouts.push(currentWorkout)
            }
            currentWorkout = {
                name: line.replace(/\.$/, '').trim().toUpperCase(),
                day_of_week: currentDay,
                exercises: []
            }
            pendingFeeder = null
            pendingWarmup = null
            continue
        }

        if (!currentWorkout) continue

        // --- Feeder line ---
        if (feederPattern.test(line)) {
            pendingFeeder = line.replace(/^FEEDER[\s:]*/i, '').trim()
            continue
        }

        // --- Warmup line ---
        if (warmupPattern.test(line)) {
            pendingWarmup = line.replace(/^(AQUECIMENTO|WARMUP|WARM.UP)[\s:]*/i, '').trim()
            continue
        }

        // --- Working set line (just metadata for next exercise, skip) ---
        if (workingSetPattern.test(line)) continue

        // --- Skip lines that are clearly not exercise names ---
        const digitCount = (line.match(/\d/g) || []).length
        if (digitCount > 5 && !upperLine.includes('LEG') && !upperLine.includes('45')) continue
        if (upperLine.includes('%')) continue

        // --- Potential exercise name ---
        if (upperLine.length > 3 && upperLine.length < 80) {
            // Try to extract sets/reps from this line first
            const setInfo = extractSetsReps(line)

            if (setInfo) {
                // This line is a sets/reps annotation for the last exercise
                if (currentWorkout.exercises.length > 0) {
                    const lastEx = currentWorkout.exercises[currentWorkout.exercises.length - 1]
                    lastEx.sets = setInfo.sets ?? lastEx.sets
                    lastEx.reps = setInfo.reps ?? lastEx.reps
                    lastEx.rest = setInfo.rest ?? lastEx.rest
                }
                continue
            }

            // It's an exercise name — fix concatenation artifacts
            const fixedName = fixExerciseName(line)

            // Skip if after fixing it's still very short or looks like a number
            if (fixedName.length <= 3 || /^\d+$/.test(fixedName)) continue

            // Skip duplicates
            if (currentWorkout.exercises.find(ex => ex.name === fixedName)) {
                pendingFeeder = null
                pendingWarmup = null
                continue
            }

            currentWorkout.exercises.push({
                name: fixedName,
                sets: 2,
                reps: '5-10',
                rest: 180,
                ...(pendingWarmup ? { warmup_sets: pendingWarmup } : {}),
                ...(pendingFeeder ? { feeder_sets: pendingFeeder } : {}),
            })

            pendingFeeder = null
            pendingWarmup = null
        }
    }

    if (currentWorkout && currentWorkout.exercises.length > 0) {
        workouts.push(currentWorkout)
    }

    return {
        workouts: workouts.map(w => ({
            ...w,
            exercises: w.exercises.filter(ex =>
                !ex.name.includes('%') &&
                !ex.name.toLowerCase().includes('carga') &&
                ex.name.length > 3
            )
        })).filter(w => w.exercises.length > 0),
        cardios,
        ergogenics: []
    }
}

export function parseDietLocally(text: string) {
    const diets: ParsedMeal[] = []
    const cardios: any[] = []
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    let currentMeal: ParsedMeal | null = null
    let inDietSection = false

    const dietStartMarkers = ['PROTOCOLO DIETÉTICO', 'PROTOCOLO DIETETICO', 'JEJUM', 'REFEIÇÃO 01', 'REFEICAO 01']
    const dietEndMarkers = ['HIDRATAÇÃO', 'HIDRATACAO', 'OBSERVAÇÕES', 'OBSERVAÇAO', 'LEMBRE-SE', 'ATENÇAO']
    const mealKeywords = ['REFEIÇÃO', 'REFEICAO', 'CAFÉ DA MANHÃ', 'CAFE DA MANHA', 'ALMOÇO', 'ALMOCO', 'JANTAR', 'LANCHE', 'JEJUM', 'CEIA']

    const blacklistedPhrases = [
        'VOCÊ DEVE COMER', 'SUGESTÃO:', 'MANTENHA SEMPRE', 'QUALQUER ALIMENTO', 'IMPLICAR NEGATIVAMENTE',
        'ESTOU AQUI PARA AJUDAR', 'NÃO MINTA', 'NÃO HAVERÁ VITORIAS', 'O JOGO É SUJO', 'VAI GANHAR MAIS',
        'PRECISAM SER INGERIDOS', 'CASO NÃO TENHA', 'CONSUMIR 30 A', 'ANTES DA PRIMEIRA', 'OS MANIPULADOS PRECISAM'
    ]

    const ergogenics: any[] = []
    const ergoMarkers = ['PROTOCOLO ERGOGÊNICO', 'ERGO', 'PROTOCOLOS', 'CICLO', 'ESTEROIDES']
    const ergoKeywords = [
        'TESTOSTERONA', 'ENANTATO', 'CIPIONATO', 'PROPIONATO', 'DURATESTON',
        'DECA', 'NANDROLONA', 'TREMBOLONA', 'BOLDENONA', 'MASTERON', 'PRIMOBOLAN',
        'OXANDROLONA', 'STANOZOLOL', 'DIANABOL', 'HEMOGENIN', 'PROVIRON',
        'ANASTROZOL', 'TAMOXIFENO', 'CLOMID', 'HCG', 'T3', 'T4', 'CLEMBUTEROL'
    ]

    for (const line of lines) {
        const cleanedLine = line.replace(/^[^\w\d\s\(\)]+/, '').trim()
        const upperLine = cleanedLine.toUpperCase()

        // --- Detect ergogenics ---
        if (ergoKeywords.some(kw => upperLine.includes(kw)) && (upperLine.includes('MG') || upperLine.includes('ML') || /\d/.test(upperLine))) {
            const nameMatch = upperLine.match(new RegExp(`(${ergoKeywords.join('|')})[^\\n]*`, 'i'))
            if (nameMatch) {
                const dosageMatch = upperLine.match(/(\d+)\s*(mg|ml)/i)
                ergogenics.push({
                    id: crypto.randomUUID(),
                    name: cleanedLine.split('|')[0].trim(),
                    dosage: dosageMatch ? dosageMatch[0] : 'Ver protocolo',
                    weekly_dosage: dosageMatch ? parseInt(dosageMatch[1]) : 0,
                    unit: dosageMatch ? dosageMatch[2].toLowerCase() : 'mg',
                    application_days: [1, 4], // Default to Mon/Thu if not detected
                    notes: cleanedLine
                })
                continue
            }
        }

        if (!inDietSection) {
            if (dietStartMarkers.some(marker => upperLine.includes(marker))) {
                inDietSection = true
            } else {
                continue
            }
        }

        if (inDietSection) {
            if (dietEndMarkers.some(marker => upperLine.includes(marker)) && upperLine.length < 30) {
                inDietSection = false
                break
            }
        }

        const isMealLine = mealKeywords.some(kw => upperLine.includes(kw)) && cleanedLine.length < 35

        if (isMealLine) {
            if (currentMeal && currentMeal.foods.length > 0) {
                diets.push(currentMeal)
            }
            let mealName = cleanedLine
            for (const kw of mealKeywords) {
                if (upperLine.includes(kw)) {
                    const idx = upperLine.indexOf(kw)
                    mealName = cleanedLine.substring(idx)
                    break
                }
            }
            currentMeal = { meal_name: mealName.replace(/[\- ]+$/, '').trim(), foods: [] }
            continue
        }

        if (currentMeal && inDietSection) {
            if (blacklistedPhrases.some(phrase => upperLine.includes(phrase))) continue
            if (upperLine.length > 100) continue

            if (cleanedLine.length > 2) {
                const hasDigit = /\d/.test(cleanedLine)
                if (!hasDigit && cleanedLine.length > 35) continue

                const parenMatch = cleanedLine.match(/^(.+?)\s*\(\s*(.+?)\s*\)$/)
                const qtyMatch = cleanedLine.match(/^(\d+(?:[,\.]\d+)?(?:\s*[gmklunid\.]+)?(?:\s*unid)?)\s*(?:de)?\s*(.+)/i) ||
                    cleanedLine.match(/^(.+?)\s+(\d+(?:[,\.]\d+)?(?:\s*[gmklunid\.]+)?)$/i)

                if (parenMatch) {
                    const name = parenMatch[1].trim()
                    const qty = parenMatch[2].trim()
                    const subQty = name.match(/^(\d+(?:[,\.]\d+)?\s*[a-z]+)\s+(.+)/i)
                    if (subQty) {
                        currentMeal.foods.push({ name: subQty[2], quantity: subQty[1], calories: 0, protein: 0, carbs: 0, fat: 0 })
                    } else {
                        currentMeal.foods.push({ name, quantity: qty, calories: 0, protein: 0, carbs: 0, fat: 0 })
                    }
                } else if (qtyMatch) {
                    const partA = qtyMatch[1].trim()
                    const partB = qtyMatch[2].trim()
                    if (partA.match(/^\d/) || partA.match(/^(unid|fatia|clara)/i)) {
                        currentMeal.foods.push({ name: partB, quantity: partA, calories: 0, protein: 0, carbs: 0, fat: 0 })
                    } else {
                        currentMeal.foods.push({ name: partA, quantity: partB, calories: 0, protein: 0, carbs: 0, fat: 0 })
                    }
                } else {
                    currentMeal.foods.push({ name: cleanedLine, quantity: 'a gosto', calories: 0, protein: 0, carbs: 0, fat: 0 })
                }
            }
        }
    }

    if (currentMeal && currentMeal.foods.length > 0) {
        diets.push(currentMeal)
    }

    return {
        diets: diets.map(meal => ({
            ...meal,
            foods: meal.foods.filter(f =>
                f.name.length > 2 &&
                !f.name.toUpperCase().includes('PROTOCOLO') &&
                !f.name.toUpperCase().includes('ESTOU SEMPRE') &&
                !f.name.includes('--')
            )
        })).filter(m => m.foods.length > 0),
        cardios: [],
        ergogenics
    }
}
