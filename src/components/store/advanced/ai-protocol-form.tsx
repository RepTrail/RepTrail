'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { Surface } from '@/components/store/base/surface'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { FormSwitch } from '@/components/store/base/form-switch'
import { Textarea } from '@/components/store/base/textarea'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { 
    Zap, 
    Dumbbell, 
    Activity, 
    Utensils, 
    Sparkles,
    Loader2,
    Target,
    AlertCircle
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { generateAIProtocol, AIProtocolPreferences } from '@/actions/ai-protocol-actions'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { useToast } from '@/hooks/use-toast'
import { AIProtocolStepCard } from './ai-protocol-step-card'

interface AIProtocolFormProps {
    userId: string
    onSuccess: (summary: any) => void
}

/**
 * AIProtocolForm: Advanced organism grouping all behavior and layout for the protocol generator.
 * Extracted from AIProtocolSectionContent.
 * All nested structures (StepCards, Grids) are preserved for pixel-perfect parity.
 */
export function AIProtocolForm({ userId, onSuccess }: AIProtocolFormProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form state
    const [goal, setGoal] = useState<'bulking' | 'cutting' | 'maintenance'>('bulking')
    const [workoutSplit, setWorkoutSplit] = useState('ppl')
    const [customSplit, setCustomSplit] = useState('')
    const [trainingVolume, setTrainingVolume] = useState<'low' | 'high'>('high')
    const [strongMuscles, setStrongMuscles] = useState('')
    const [weakMuscles, setWeakMuscles] = useState('')
    const [cardioLikes, setCardioLikes] = useState<string[]>([])
    const [mealsPerDay, setMealsPerDay] = useState(4)
    const [foodLikes, setFoodLikes] = useState('')
    const [foodDislikes, setFoodDislikes] = useState('')

    const { mutate: saveProtocolMutate } = useOptimisticMutation({
        actionName: 'save-parsed-data',
        entity: ENTITIES.USER,
        entityId: userId,
        queryKey: QUERY_KEYS.student.all(userId),
        mutationFn: async (vars) => vars,
        onMutate: async ({ data }: { data: any }) => {
            if (data.workouts?.length) queryClient.setQueryData(QUERY_KEYS.workouts.today(userId), data.workouts)
            if (data.cardios?.length) queryClient.setQueryData(QUERY_KEYS.cardio.today(userId), data.cardios)
            if (data.diets?.length || data.meals?.length) queryClient.setQueryData(QUERY_KEYS.diets.today(userId), data.diets?.[0] || data)
        }
    })

    const { mutate: generateMutate } = useMutation({
        mutationFn: async (variables: any) => {
            const result = await generateAIProtocol(variables.preferences)
            if (result.error) throw new Error(result.error)
            return result
        },
        onMutate: () => {
            setLoading(true)
            toast({ title: "✨ Gerando seu protocolo...", description: "Aguarde enquanto a IA processa seu plano." })
        },
        onSuccess: (result) => {
            setLoading(false)
            if (result.data) {
                saveProtocolMutate({ type: 'workout', data: result.data, studentId: userId })
                onSuccess(result.summary)
            }
        },
        onError: (err: any) => {
            setLoading(false)
            setError(err.message)
            toast({ variant: "destructive", title: "Erro na geração", description: err.message })
        }
    })

    const handleGenerate = () => {
        const preferences: AIProtocolPreferences = {
            goal,
            workoutSplit: workoutSplit === 'other' ? customSplit : workoutSplit,
            trainingVolume,
            strongMuscles,
            weakMuscles,
            cardioLikes: cardioLikes.join(', '),
            cardioDislikes: '',
            mealsPerDay,
            foodLikes,
            foodDislikes,
            dietaryRestrictions: '',
        }
        generateMutate({ preferences })
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
            {/* 1. OBJETIVO & TREINO */}
            <AIProtocolStepCard 
                index={1} 
                title="Objetivo & Treino" 
                description="Defina sua meta principal e a estrutura do seu treinamento."
                icon={Target}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <FormSelect 
                        label="Seu Objetivo"
                        placeholder="Selecione o objetivo..."
                        value={goal}
                        onChange={(v) => setGoal(v as any)}
                        options={[
                            { value: 'bulking', label: 'Bulking', description: 'Ganho de massa e força muscular.' },
                            { value: 'cutting', label: 'Cutting', description: 'Queima de gordura e definição.' },
                            { value: 'maintenance', label: 'Manutenção', description: 'Manter físico e melhorar qualidade.' },
                        ]}
                    />

                    <Box height="px" bg="white" bgOpacity={5} fullWidth />

                    <Grid cols={{ base: 2.5, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <FormSelect 
                            label="Divisão"
                            placeholder="Selecione a divisão..."
                            value={workoutSplit}
                            onChange={(v) => setWorkoutSplit(v)}
                            options={[
                                { value: 'ppl', label: 'PPL', description: 'Push / Pull / Legs' },
                                { value: 'upper_lower', label: 'Upper/Lower', description: 'Superior / Inferior' },
                                { value: 'one_group', label: 'ABCDE', description: '1 Músculo por dia' },
                                { value: 'full_body', label: 'Full Body', description: 'Corpo todo' },
                                { value: 'other', label: 'Personalizado', description: 'Descreva sua divisão' },
                            ]}
                        />
                        <FormSwitch 
                            label="Volume"
                            value={trainingVolume}
                            onChange={(v) => setTrainingVolume(v as any)}
                            options={[
                                { label: 'LOW VOLUME', value: 'low' },
                                { label: 'HIGH VOLUME', value: 'high' }
                            ]}
                        />
                        {workoutSplit === 'other' && (
                            <Box mdColSpan={2}>
                                <Input label="Descrição da Divisão" placeholder="Ex: Peito e Costas..." value={customSplit} onChange={(e) => setCustomSplit(e.target.value)} />
                            </Box>
                        )}
                    </Grid>

                    <Box height="px" bg="white" bgOpacity={5} fullWidth />

                    <Grid cols={{ base: 2.5, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Textarea label="Pontos Fortes" placeholder="Peitoral, Braços..." value={strongMuscles} onChange={(e) => setStrongMuscles(e.target.value)} />
                        <Textarea label="Pontos Fracos" placeholder="Dorsais, Quadríceps..." value={weakMuscles} onChange={(e) => setWeakMuscles(e.target.value)} />
                    </Grid>
                </Stack>
            </AIProtocolStepCard>

            {/* 2. CARDIO */}
            <AIProtocolStepCard 
                index={2} 
                title="Perfil Aeróbico" 
                description="Modalidades preferidas para queima calórica."
                icon={Zap}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase tracking="widest">Modalidades Aceitas</Font>
                    <Grid cols={{ base: 2, md: 4 }} gap={2.5}>
                        {['Esteira', 'Bike', 'Escada', 'Corrida', 'HIIT', 'Natação', 'Caminhada', 'Corda'].map(c => (
                            <FormCheckbox 
                                key={c}
                                label={c.toUpperCase()}
                                checked={cardioLikes.includes(c)}
                                onChange={(checked) => setCardioLikes(prev => checked ? [...prev, c] : prev.filter(x => x !== c))}
                            />
                        ))}
                    </Grid>
                </Stack>
            </AIProtocolStepCard>

            {/* 3. DIETA */}
            <AIProtocolStepCard 
                index={3} 
                title="Plano Nutricional" 
                description="Personalização da base alimentar diária."
                icon={Utensils}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <FormSelect 
                        label="Refeições por dia"
                        value={String(mealsPerDay)}
                        onChange={(v) => setMealsPerDay(Number(v))}
                        options={[{ value: '3', label: '3 Refeições' }, { value: '4', label: '4 Refeições' }, { value: '5', label: '5 Refeições' }, { value: '6', label: '6 Refeições' }]}
                    />
                    <Grid cols={{ base: 2.5, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Textarea label="Gosto de" placeholder="Frango, Arroz, Ovos..." value={foodLikes} onChange={(e) => setFoodLikes(e.target.value)} />
                        <Textarea label="Não Gosto / Restrições" placeholder="Lactose, Brócolis..." value={foodDislikes} onChange={(e) => setFoodDislikes(e.target.value)} />
                    </Grid>
                </Stack>
            </AIProtocolStepCard>

            {/* ACTION AREA */}
            <Stack gap={5}>
                {error && (
                    <Surface variant="tonal-red" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                        <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={AlertCircle} size="xs" color="red" />
                            <Font variant="auxiliary" color="red">{error}</Font>
                        </Stack>
                    </Surface>
                )}
                <Button variant="primary" size="lg" fullWidth onClick={handleGenerate} disabled={loading}>
                    {loading ? (
                        <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={Loader2} size="sm" animate="spin" />
                            <Font variant="sub-tiny" weight="black" uppercase>Processando Protocolo...</Font>
                        </Stack>
                    ) : (
                        <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={Sparkles} size="xs" />
                            <Font variant="sub-tiny" weight="black" uppercase italic>Gerar Protocolo de Elite</Font>
                        </Stack>
                    )}
                </Button>
            </Stack>
        </Stack>
    )
}
