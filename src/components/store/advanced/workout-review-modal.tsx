'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Textarea } from '@/components/store/base/textarea'
import { FormSelect } from '@/components/store/base/form-select'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { 
    Dumbbell, 
    Zap, 
    Loader2
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { getWorkoutLogForReview } from '@/actions/log-actions'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { useToast } from '@/hooks/use-toast'

interface Load {
    id: string
    exercise_id: string
    weight_kg: number
    reps_performed: number
    set_type: string
    exercise: { id: string; name: string }
}

interface WorkoutReviewModalProps {
    isOpen: boolean
    onClose: () => void
    logId: string | null
    userId: string
}

const setTypeConfig: Record<string, { label: string; color: 'amber' | 'blue' | 'emerald' }> = {
    WARMUP: { label: 'AQUEC.', color: 'amber' },
    FEEDER: { label: 'FEEDER', color: 'blue' },
    WORKING: { label: 'TRABALHO', color: 'emerald' },
}

export function WorkoutReviewModal({ 
    isOpen, 
    onClose, 
    logId, 
    userId 
}: WorkoutReviewModalProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [workoutName, setWorkoutName] = useState('Revisão de Treino')
    const [pse, setPse] = useState<string>('7')
    const [notes, setNotes] = useState('')
    const [loads, setLoads] = useState<Load[]>([])
    const [edits, setEdits] = useState<Record<string, { weight: string; reps: string }>>({})

    const { mutate: updateMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.workouts.logs(userId),
        entity: ENTITIES.WORKOUT_LOG,
        actionName: 'update-load-entry',
        mutationFn: async () => {},
    })

    // Fetch data when modal opens
    useEffect(() => {
        if (isOpen && logId) {
            setIsLoading(true)
            if (logId === 'mock-log-id') {
                setWorkoutName('TREINO C (Preview)')
                setPse('8')
                setNotes('Treino muito produtivo, senti um pouco de dor no ombro direito durante o supino.')
                const mockLoads: Load[] = [
                    { id: 'm1', exercise_id: 'e1', weight_kg: 80, reps_performed: 10, set_type: 'WARMUP', exercise: { id: 'e1', name: 'Supino Reto' } },
                    { id: 'm2', exercise_id: 'e1', weight_kg: 120, reps_performed: 8, set_type: 'WORKING', exercise: { id: 'e1', name: 'Supino Reto' } },
                    { id: 'm3', exercise_id: 'e1', weight_kg: 120, reps_performed: 6, set_type: 'WORKING', exercise: { id: 'e1', name: 'Supino Reto' } },
                    { id: 'm4', exercise_id: 'e2', weight_kg: 40, reps_performed: 12, set_type: 'WORKING', exercise: { id: 'e2', name: 'Crucifixo Inclinado' } },
                ]
                setLoads(mockLoads)
                const init: Record<string, { weight: string; reps: string }> = {}
                mockLoads.forEach(l => init[l.id] = { weight: String(l.weight_kg), reps: String(l.reps_performed) })
                setEdits(init)
                setIsLoading(false)
                return
            }

            getWorkoutLogForReview(logId).then(data => {
                if (data) {
                    setWorkoutName(data.workout.name)
                    setPse(String(data.perceived_effort || '7'))
                    setNotes(data.feedback || '')
                    setLoads(data.loads || [])
                    
                    const init: Record<string, { weight: string; reps: string }> = {}
                    data.loads.forEach((l: any) => {
                        init[l.id] = { weight: String(l.weight_kg || 0), reps: String(l.reps_performed || 0) }
                    })
                    setEdits(init)
                }
                setIsLoading(false)
            })
        }
    }, [isOpen, logId])

    const grouped = loads.reduce((acc, load) => {
        const name = load.exercise?.name || 'Exercício'
        if (!acc[name]) acc[name] = []
        acc[name].push(load)
        return acc
    }, {} as Record<string, Load[]>)

    const handleSave = () => {
        Object.entries(edits).forEach(([loadId, { weight, reps }]) => {
            const w = parseFloat(weight)
            const r = parseInt(reps)
            if (isNaN(w) || isNaN(r)) return
            updateMutation({ loadId, weightKg: w, repsPerformed: r })
        })

        toast({ 
            title: 'Revisão Concluída', 
            description: 'Seu feedback e alterações foram salvos com sucesso.' 
        })
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={workoutName}
            subtitle="Revisão de performance e ajuste de cargas"
            icon={Dumbbell}
            variant="emerald"
            confirmLabel="Salvar Revisão"
            onConfirm={handleSave}
            confirmVariant="outline-emerald"
            isLoading={isLoading}
        >
            {isLoading ? (
                <Box padding={STORE_TOKENS.SPACING.EMPTY_STATE} display="flex" align="center" justify="center" fullWidth>
                    <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={Loader2} size="xl" color={STORE_TOKENS.COLORS.SUCCESS} spin />
                        <Font
                            variant="sub-tiny"
                            weight="black"
                            uppercase
                            {...{
                                color: "zinc-500",
                            }}>Carregando dados do treino...</Font>
                    </Stack>
                </Box>
            ) : (
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* 1. Subjective metrics */}
                    <Box border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.LOW}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <FormSelect 
                                label="Percepção de Esforço (PSE)"
                                placeholder="Selecione de 1 a 10..."
                                value={pse}
                                onChange={(val) => setPse(val as string)}
                                options={[
                                    { value: '1', label: '1 - Muito Leve', description: 'Nenhum esforço' },
                                    { value: '3', label: '3 - Moderado', description: 'Ritmo confortável' },
                                    { value: '5', label: '5 - Pesado', description: 'Esforço considerável' },
                                    { value: '7', label: '7 - Muito Pesado', description: 'Próximo ao limite' },
                                    { value: '9', label: '9 - Quase Máximo', description: 'Extremo' },
                                    { value: '10', label: '10 - Máximo', description: 'Falha total' },
                                ]}
                            />
                            <Textarea 
                                label="Notas sobre o Treino"
                                placeholder="Como você se sentiu hoje? Sentiu alguma dor ou desconforto?"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                        </Stack>
                    </Box>

                    {/* 2. Loads Review */}
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Font
                            variant="sub-tiny"
                            weight="black"
                            uppercase
                            italic
                            {...{
                                color: "zinc-500",
                            }}>
                            Revisão de Séries e Cargas
                        </Font>
                        
                        {Object.entries(grouped).map(([exerciseName, exerciseLoads]) => (
                            <Box 
                                key={exerciseName} 
                                border 
                                borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} 
                                rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                                bg={STORE_TOKENS.COLORS.BACKGROUND} 
                                bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                                overflow="hidden"
                            >
                                {/* Exercise Header */}
                                <Box bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} padding={STORE_TOKENS.PADDING.ELEMENT}>
                                    <Stack direction="row" align="center" justify="between" fullWidth gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Icon icon={Zap} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                            <Font
                                                variant="tiny"
                                                weight="black"
                                                uppercase
                                                italic
                                                {...{
                                                    color: "white",
                                                }}>
                                                {exerciseName}
                                            </Font>
                                        </Stack>

                                        {/* Column Headers (Desktop Only) */}
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} display={{ base: 'none', md: 'flex' }}>
                                            <Box width={80} align="center">
                                                <Font
                                                    variant="sub-tiny"
                                                    weight="black"
                                                    uppercase
                                                    {...{
                                                        color: "zinc-500",
                                                    }}>Peso</Font>
                                            </Box>
                                            <Box width={20} /> {/* Spacer for the 'x' icon */}
                                            <Box width={60} align="center">
                                                <Font
                                                    variant="sub-tiny"
                                                    weight="black"
                                                    uppercase
                                                    {...{
                                                        color: "zinc-500",
                                                    }}>Reps</Font>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {/* Sets List */}
                                <Stack divide gap={STORE_TOKENS.SPACING.NONE}>
                                    {exerciseLoads.map((load) => {
                                        const cfg = setTypeConfig[load.set_type] || setTypeConfig.WORKING
                                        const edit = edits[load.id] || { weight: '0', reps: '0' }

                                        return (
                                            <Box key={load.id} padding={STORE_TOKENS.PADDING.ELEMENT}>
                                                <Stack direction={{ base: 'col', md: 'row' }} align={{ base: 'start', md: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    {/* Set Type Badge */}
                                                    <Box width={{ base: 'full', md: 80 }}>
                                                        <Badge label={cfg.label} color={cfg.color} size="xs" variant="glass" />
                                                    </Box>

                                                    {/* Load/Reps Controls */}
                                                    <Stack direction="row" align={{ base: 'end', md: 'center' }} justify="end" flex1 fullWidth gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                        {/* Weight Column */}
                                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1={ { base: true, md: false } }>
                                                            <Box display={{ base: 'block', md: 'none' }} padding={STORE_TOKENS.PADDING.NONE}>
                                                                <Font
                                                                    variant="sub-tiny"
                                                                    weight="black"
                                                                    uppercase
                                                                    {...{
                                                                        color: "zinc-600",
                                                                    }}>Peso</Font>
                                                            </Box>
                                                            <Box width={{ base: 'full', md: 80 }}>
                                                                    <Input 
                                                                        type="number" 
                                                                        step="0.5" 
                                                                        value={edit.weight}
                                                                        onChange={(e) => setEdits(prev => ({ ...prev, [load.id]: { ...prev[load.id], weight: e.target.value } }))}
                                                                        textAlign="center"
                                                                        weight="bold"
                                                                    />
                                                            </Box>
                                                        </Stack>
                                                        
                                                        <Box width={{ base: 'auto', md: 20 }} align="center">
                                                            <Font
                                                                variant="tiny"
                                                                {...{
                                                                    color: "zinc-600",
                                                                }}>×</Font>
                                                        </Box>

                                                        {/* Reps Column */}
                                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1={ { base: true, md: false } }>
                                                            <Box display={{ base: 'block', md: 'none' }} padding={STORE_TOKENS.PADDING.NONE}>
                                                                <Font
                                                                    variant="sub-tiny"
                                                                    weight="black"
                                                                    uppercase
                                                                    {...{
                                                                        color: "zinc-600",
                                                                    }}>Reps</Font>
                                                            </Box>
                                                            <Box width={{ base: 'full', md: 60 }}>
                                                                    <Input 
                                                                        type="number" 
                                                                        value={edit.reps}
                                                                        onChange={(e) => setEdits(prev => ({ ...prev, [load.id]: { ...prev[load.id], reps: e.target.value } }))}
                                                                        textAlign="center"
                                                                        weight="bold"
                                                                    />
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            )}
        </Modal>
    );
}
