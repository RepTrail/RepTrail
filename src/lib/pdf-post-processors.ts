/**
 * ═══════════════════════════════════════════════════════════════
 * PDF POST-PROCESSORS
 * ═══════════════════════════════════════════════════════════════
 * 
 * Pure functions that extract additional data from raw PDF text.
 * These run AFTER the existing workout/diet parsers and only
 * fill in gaps the AI or local parser missed.
 * 
 * Architecture: Post-processing layer — never touches the existing parsers.
 */

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface ParsedCardio {
    type: string
    duration: string
    intensity: string
    frequency: string
    application_days?: number[]
}

export interface ParsedErgogenic {
    name: string
    dosage: string
    unit: 'mg' | 'ml' | 'un'
    weekly_dosage: number
    application_days: number[]
    notes: string
}

const DAY_MAP: Record<string, number> = {
    'SEGUNDA': 1, 'TERÇA': 2, 'TERCA': 2, 'QUARTA': 3, 'QUINTA': 4, 'SEXTA': 5, 'SÁBADO': 6, 'SABADO': 6, 'DOMINGO': 0,
    'SEG': 1, 'TER': 2, 'QUA': 3, 'QUI': 4, 'SEX': 5, 'SAB': 6, 'DOM': 0
}

function detectDaysFromText(text: string): number[] | null {
    const upperText = text.toUpperCase();
    const days: Set<number> = new Set();

    // Specific days
    for (const [key, val] of Object.entries(DAY_MAP)) {
        if (new RegExp(`\\b${key}\\b`).test(upperText)) {
            days.add(val);
        }
    }

    // Ranges (e.g., Segunda a Sexta)
    const rangeMatch = upperText.match(/(SEGUNDA|SEG|TERÇA|TER|QUARTA|QUA|QUINTA|QUI|SEXTA|SEX)\s*(?:A|ATÉ)\s*(SEGUNDA|SEG|TERÇA|TER|QUARTA|QUA|QUINTA|QUI|SEXTA|SEX|SÁBADO|SAB|DOMINGO|DOM)/);
    if (rangeMatch) {
        const start = DAY_MAP[rangeMatch[1]];
        const end = DAY_MAP[rangeMatch[2]];
        if (start !== undefined && end !== undefined) {
            if (start === end) {
                return [0, 1, 2, 3, 4, 5, 6];
            }
            let current = start;
            while (current !== end) {
                days.add(current);
                current = (current + 1) % 7;
            }
            days.add(end);
        }
    }

    if (upperText.includes('TODOS OS DIAS') || upperText.includes('DIARIAMENTE') || upperText.includes('DIÁRIO')) {
        return [0, 1, 2, 3, 4, 5, 6];
    }

    return days.size > 0 ? Array.from(days).sort() : null;
}

// ─── STUDENT NAME EXTRACTION ────────────────────────────────────────────────

const NAME_PATTERNS: RegExp[] = [
    /(?:ALUNO|CLIENTE|ATLETA|NOME|PACIENTE|STUDENT|NAME|CLIENT|PREPARADO PARA|DESTINATÁRIO)\s*[:–\-]?\s*([A-ZÀ-Ü].+)/i,
    /(?:PROTOCOLO|TREINO|DIETA|PLANILHA|PROGRAMA|FICHA|PLANNING)\s+(?:DE|DO|DA|PARA|PARA O|PARA A)\s+([A-ZÀ-Ü].+)/i,
    /(?:PARA)\s*[:–\-]?\s*([A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+){0,3})/,
    /^([A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+){1,3})$/, // Pure name line
    /^[A-ZÀ-Ü][A-ZÀ-Ü\s]{3,30}$/, // All caps name line (min 3 chars)
]

const NAME_BLACKLIST = [
    'TREINO', 'DIETA', 'PROTOCOLO', 'EXERCÍCIO', 'REFEIÇÃO', 'MUSCULAÇÃO',
    'HIPERTROFIA', 'EMAGRECIMENTO', 'FUNCIONAL', 'FORÇA', 'RESISTÊNCIA',
    'IMPORTADO', 'PDF', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA',
    'SÁBADO', 'DOMINGO', 'SEMANA', 'DIA', 'FASE', 'CICLO', 'PERÍODO',
    'FICHA', 'TREINAMENTO', 'OBJETIVO', 'PLANILHA', 'VERSÃO', 'REVISÃO',
    'REFEIÇÃO', 'LANCHE', 'CAFÉ', 'ALMOÇO', 'JANTAR', 'CEIA', 'NTO',
]

export function extractStudentName(text: string): string | null {
    const header = text.substring(0, 1500)
    const lines = header.split('\n').map(l => l.trim()).filter(Boolean)

    for (const line of lines) {
        if (line.length < 3 || line === 'ALUNO' || line === 'NOME') continue

        for (const pattern of NAME_PATTERNS) {
            const match = line.match(pattern)
            if (match && match[1]) {
                const candidate = match[1]
                    .replace(/[.,:;!?()[\]{}]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim()

                if (/^[\d\s\-:|]+$/.test(candidate)) continue
                const upperCandidate = candidate.toUpperCase()
                if (NAME_BLACKLIST.some(b => upperCandidate.includes(b))) continue
                if (candidate.length < 3 || candidate.length > 50) continue
                const words = candidate.split(/\s+/)
                if (words.length > 5) continue
                if (pattern.source.includes('^') && !/^[A-ZÀ-Ü]/.test(candidate)) continue

                return candidate
                    .split(/\s+/)
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                    .join(' ')
            }
        }
    }

    return null
}

// ─── CARDIO EXTRACTION ──────────────────────────────────────────────────────

const CARDIO_KEYWORDS = [
    'HIIT', 'ESTEIRA', 'BICICLETA', 'BIKE', 'ELÍPTICO', 'ELIPTICO',
    'CAMINHADA', 'CORRIDA', 'TRANSPORT', 'ESCADA', 'PULAR CORDA',
    'REMO', 'ERGÔMETRO', 'ERGOMETRO', 'SPINNING', 'AERÓBICO', 'AEROBICO',
    'CARDIO', 'NATAÇÃO', 'NATACAO', 'PEDALADA', 'BIKE'
]

const DURATION_PATTERN = /(\d+)\s*(?:min(?:utos?)?|'|minutos|m\b)/i
const FREQUENCY_PATTERN = /(\d+)\s*(?:x|vezes|dias)\s*(?:por\s*)?(?:sem(?:ana)?|\/sem|dias)/i

const INTENSITY_KEYWORDS: Record<string, string> = {
    'LEVE': 'Leve',
    'MODERADO': 'Moderada',
    'MODERADA': 'Moderada',
    'INTENSO': 'Intensa',
    'INTENSA': 'Intensa',
    'ALTA': 'Alta',
    'BAIXA': 'Baixa',
    'HIIT': 'Alta (HIIT)',
    'LISS': 'Baixa (LISS)',
}

/**
 * Extracts cardio prescriptions from raw PDF text.
 * NOW WITH ANTI-DUPLICATION AND EXAMPLE FILTERING.
 */
export function extractCardioFromText(text: string): ParsedCardio[] {
    const results: ParsedCardio[] = []
    const seenDurations = new Set<string>()
    
    // Split text into paragraphs/sections to analyze context
    const sections = text.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean)

    for (const section of sections) {
        const upperSection = section.toUpperCase()
        
        // 1. FILTER: Skip sections that are clearly EXAMPLES
        // If "EX." or "EXEMPLO" appears near the beginning or frequently, skip it.
        if (upperSection.includes('EXEMPLO') || upperSection.includes('EX.')) {
            // Check if it's an instructional section rather than a prescription
            if (upperSection.includes('MODALIDADE HIIT') || upperSection.includes('VELOCIDADE ENTRE')) {
                continue;
            }
        }

        // 2. Identify all cardio keywords and all durations in this section
        const foundKeywords: string[] = []
        for (const kw of CARDIO_KEYWORDS) {
            if (upperSection.includes(kw)) {
                foundKeywords.push(kw.charAt(0) + kw.slice(1).toLowerCase())
            }
        }

        if (foundKeywords.length === 0) continue

        // Find durations using global match
        const durationMatches = Array.from(section.matchAll(new RegExp(DURATION_PATTERN.source, 'gi')))
        
        if (durationMatches.length === 0) continue

        // 3. LOGIC: If we have multiple keywords and ONE common duration, it's an "OR" situation
        const firstDurationVal = durationMatches[0][1]
        const durationStr = `${firstDurationVal} min`
        
        // Skip if it's too short (likely a part of a HIIT example, like 1 min)
        if (parseInt(firstDurationVal) < 5 && !upperSection.includes('HIIT')) continue

        // Determine main type
        let finalType = foundKeywords[0]
        if (foundKeywords.length > 1) {
            if (upperSection.includes(' OU ') || section.includes('/') || section.includes(',')) {
                // Limit to max 3 keywords to keep it clean
                finalType = foundKeywords.slice(0, 3).join(' ou ')
            }
        }

        // Avoid adding the same duration twice in different sections unless they are different types
        const key = `${finalType}-${durationStr}`
        if (seenDurations.has(key)) continue
        seenDurations.add(key)

        // 4. Intensity & Frequency
        let intensity = 'Moderada'
        for (const [kw, val] of Object.entries(INTENSITY_KEYWORDS)) {
            if (upperSection.includes(kw)) {
                intensity = val
                break
            }
        }

        let frequency = ''
        const days = detectDaysFromText(section)
        if (days) {
            frequency = days.length === 7 ? 'Diário' : `${days.length}x/semana`
        } else {
            const freqMatch = section.match(FREQUENCY_PATTERN)
            if (freqMatch) {
                frequency = `${freqMatch[1]}x/semana`
            }
        }

        results.push({
            type: finalType,
            duration: durationStr,
            intensity,
            frequency: frequency || 'Diário',
            application_days: days || [0, 1, 2, 3, 4, 5, 6]
        })
    }

    return results
}

// ─── ERGOGENIC EXTRACTION ───────────────────────────────────────────────────

export const ERGOGENIC_KEYWORDS: Record<string, 'supplement' | 'hormonal'> = {
    'CREATINA': 'supplement', 'WHEY': 'supplement', 'CAFEÍNA': 'supplement', 'CAFEINA': 'supplement',
    'MELATONINA': 'supplement', 'ÔMEGA': 'supplement', 'OMEGA': 'supplement', 'GLUTAMINA': 'supplement',
    'BCAA': 'supplement', 'HMB': 'supplement', 'COLÁGENO': 'supplement', 'COLAGENO': 'supplement',
    'VITAMINA': 'supplement', 'ZINCO': 'supplement', 'MAGNÉSIO': 'supplement', 'MAGNESIO': 'supplement',
    'MALTODEXTRINA': 'supplement', 'PALATINOSE': 'supplement', 'CASEÍNA': 'supplement', 'CASEINA': 'supplement',
    'ALBUMINA': 'supplement',
    'TESTOSTERONA': 'hormonal', 'ENANTATO': 'hormonal', 'CIPIONATO': 'hormonal', 'OXANDROLONA': 'hormonal',
    'BOLDENONA': 'hormonal', 'TREMBOLONA': 'hormonal', 'PRIMOBOLAN': 'hormonal', 'STANOZOLOL': 'hormonal',
    'DECA': 'hormonal', 'NANDROLONA': 'hormonal', 'DURATESTON': 'hormonal', 'MASTERON': 'hormonal',
    'ANASTROZOL': 'hormonal', 'TAMOXIFENO': 'hormonal', 'CLOMIFENO': 'hormonal', 'HCG': 'hormonal',
    'GH': 'hormonal',
}

const DOSAGE_PATTERN = /(\d+(?:[.,]\d+)?)\s*(mg|ml|g|mcg|ui|iu|caps?|comp(?:rimido)?s?|gotas?|unid?)\b/i

export function extractErgogenicsFromText(text: string): ParsedErgogenic[] {
    const results: ParsedErgogenic[] = []
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const seen = new Set<string>()

    for (const line of lines) {
        const upperLine = line.toUpperCase()

        for (const [keyword, _category] of Object.entries(ERGOGENIC_KEYWORDS)) {
            if (!upperLine.includes(keyword)) continue

            const dosageMatch = line.match(DOSAGE_PATTERN)
            if (!dosageMatch) continue

            const dosageValue = dosageMatch[1].replace(',', '.')
            const rawUnit = dosageMatch[2].toLowerCase()
            
            let unit: 'mg' | 'ml' | 'un' = 'mg'
            const lowUnit = rawUnit.toLowerCase()
            if (lowUnit.startsWith('ml') || lowUnit.includes('gotas')) {
                unit = 'ml'
            } else if (lowUnit.includes('caps') || lowUnit.includes('comp') || lowUnit.includes('unid') || lowUnit === 'un' || lowUnit === 'u') {
                unit = 'un'
            }

            const name = keyword.charAt(0) + keyword.slice(1).toLowerCase()
            if (seen.has(name.toUpperCase())) continue
            seen.add(name.toUpperCase())

            const dosage = `${dosageValue}${rawUnit}`
            const days = detectDaysFromText(line) || [0, 1, 2, 3, 4, 5, 6]

            let weekly_dosage = 0
            const weeklyMatch = line.match(/(\d+)\s*(?:x|vezes)\s*(?:por\s*)?sem/i)
            if (weeklyMatch) {
                weekly_dosage = parseFloat(dosageValue) * parseInt(weeklyMatch[1])
            } else {
                weekly_dosage = parseFloat(dosageValue) * days.length
            }

            const dosageIdx = line.indexOf(dosageMatch[0])
            const afterDosage = line.substring(dosageIdx + dosageMatch[0].length).trim()
            const notes = afterDosage.length > 3 && afterDosage.length < 100
                ? afterDosage.replace(/^[,\-–\s]+/, '').trim()
                : ''

            results.push({ name, dosage, unit, weekly_dosage, application_days: days, notes })
        }
    }

    return results
}
