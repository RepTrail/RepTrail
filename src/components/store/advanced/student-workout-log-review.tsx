'use client'

import { useState } from 'react'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { Box, BoxColor } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font, FontColor } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Separator } from '@/components/store/base/separator'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { ChevronLeft, CheckCircle, Save, Dumbbell } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Load {
    id: string
    exercise_id: string
    weight_kg: number
    reps_performed: number
    set_type: string
    notes?: string
    exercise: { id: string; name: string }
}

interface WorkoutLogReviewProps {
    logId: string
    userId: string
    workoutName: string
    completedAt: string
    loads: Load[]
}

const setTypeConfig: Record<string, { label: string; color: FontColor; bg: BoxColor; borderOpacity: number }> = {
    WARMUP: { label: 'Aquec.', color: 'amber', bg: 'amber', borderOpacity: 20 },
    FEEDER: { label: 'Feeder', color: 'blue', bg: 'blue', borderOpacity: 20 },
    WORKING: { label: 'Trab.', color: 'emerald', bg: 'emerald', borderOpacity: 20 },
}

const DEFAULT_SET_TYPE = { label: 'Desconhecido', color: 'zinc' as FontColor, bg: 'zinc' as BoxColor, borderOpacity: 20 }

export function WorkoutLogReview({ logId, userId, workoutName, completedAt, loads }: WorkoutLogReviewProps) {
    const { toast } = useToast()
    const router = useRouter()
    const queryClient = useQueryClient()

    // Local state: map of loadId -> { weight, reps }
    const [edits, setEdits] = useState<Record<string, { weight: string; reps: string }>>(() => {
        const init: Record<string, { weight: string; reps: string }> = {}
        if (Array.isArray(loads)) {
            loads.forEach(l => {
                if (l && l.id) {
                    init[l.id] = { weight: String(l.weight_kg ?? 0), reps: String(l.reps_performed ?? 0) }
                }
            })
        }
        return init
    })

    const { mutate: updateMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.workouts.logs(userId),
        entity: ENTITIES.WORKOUT_LOG,
        actionName: 'update-load-entry',
        mutationFn: async () => { }, // Single-writer
    })

    // Group loads by exercise name
    const grouped = (Array.isArray(loads) ? loads : []).reduce((acc, load) => {
        if (!load) return acc
        const name = load.exercise?.name || 'Exercício'
        if (!acc[name]) acc[name] = []
        acc[name].push(load)
        return acc
    }, {} as Record<string, Load[]>)

    const handleSaveAll = () => {
        Object.entries(edits).forEach(([loadId, { weight, reps }]) => {
            const w = parseFloat(weight)
            const r = parseInt(reps)
            if (isNaN(w) || isNaN(r)) return

            updateMutation({ loadId, weightKg: w, repsPerformed: r })
        })

        toast({ title: 'Salvo!', description: 'Alterações enviadas para sincronização.' })
        router.push('/dashboard/student')
    }

    const date = new Date(completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    const time = new Date(completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    return (
        <Box display="flex" justify="center" fullWidth>
            <Box maxWidth="lg" display="flex" direction="col" gap="container" fullWidth>
                {/* Header */}
                <Stack gap="element">
                    <Button variant="ghost" size="xs" gap="tiny" asChild justify="start">
                        <Link href="/dashboard/student">
                            <Icon icon={ChevronLeft} size="xs" />
                            Voltar
                        </Link>
                    </Button>

                    <Box display="flex" align="start" gap="container">
                        <Box padding="element" bg="emerald" bgOpacity={10} rounded="system" border borderColor="emerald" borderOpacity={20}>
                            <Icon icon={CheckCircle} size="md" color="emerald" />
                        </Box>
                        <Stack gap="tiny">
                            <Font
                                variant="h3"
                                weight="black"
                                uppercase
                                italic
                                {...{
                                    color: "white",
                                }}>
                                {workoutName}
                            </Font>
                            <Box display="flex" align="center" gap="tiny">
                                <Icon icon={CheckCircle} size="xs" color="emerald" />
                                <Font
                                    variant="sub-tiny"
                                    weight="bold"
                                    uppercase
                                    tracking="widest"
                                    {...{
                                        color: "zinc-400",
                                    }}>
                                    Revisado em {date} às {time} • {Array.isArray(loads) ? loads.length : 0} séries
                                </Font>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>

                {/* Exercises */}
                <Stack gap="element">
                    {Object.entries(grouped).map(([exerciseName, exerciseLoads]) => (
                        <Box key={exerciseName} bg="zinc" bgOpacity={5} border borderColor="zinc" borderOpacity={10} rounded="system" overflow="hidden" display="flex" direction="col">
                            {/* Exercise title */}
                            <Box display="flex" align="center" gap="tiny" padding="element" bg="zinc" bgOpacity={10}>
                                <Icon icon={Dumbbell} size="sm" color="orange" opacity={70} />
                                <Font
                                    variant="body-sm"
                                    weight="black"
                                    uppercase
                                    italic
                                    {...{
                                        color: "white",
                                    }}>
                                    {exerciseName}
                                </Font>
                            </Box>
                            <Separator opacity={5} />

                            {/* Sets */}
                            <Box display="flex" direction="col">
                                {exerciseLoads.map((load, setIdx) => {
                                    const cfg = setTypeConfig[load.set_type] ?? DEFAULT_SET_TYPE
                                    const edit = edits[load.id] || { weight: '0', reps: '0' }
                                    const isLast = setIdx === exerciseLoads.length - 1

                                    return (
                                        <Stack key={load.id} gap={STORE_TOKENS.SPACING.NONE}>
                                            <Box
                                                display="flex"
                                                align="center"
                                                gap="container"
                                                padding="element"
                                            >
                                                {/* Set type badge */}
                                                <Box
                                                    bg={cfg.bg}
                                                    bgOpacity={10}
                                                    border
                                                    borderColor={cfg.bg}
                                                    borderOpacity={80}
                                                    rounded="system"
                                                    padding={STORE_TOKENS.PADDING.ELEMENT}
                                                    shrink={0}
                                                >
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="black"
                                                        uppercase
                                                        {...{
                                                            color: cfg.color,
                                                        }}>
                                                        {cfg.label}
                                                    </Font>
                                                </Box>

                                                {/* Weight input */}
                                                <Box flex={1} display="flex" align="center" gap="tiny">
                                                    <Input
                                                        type="number"
                                                        step="0.5"
                                                        min="0"
                                                        value={edit.weight}
                                                        onChange={e => setEdits(prev => ({ ...prev, [load.id]: { ...prev[load.id], weight: e.target.value } }))}
                                                        width={80}
                                                        textAlign="center"
                                                        weight="bold"
                                                        size="sm"
                                                    />
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="bold"
                                                        {...{
                                                            color: "zinc-500",
                                                        }}>kg</Font>
                                                </Box>

                                                <Font
                                                    variant="sub-tiny"
                                                    weight="black"
                                                    {...{
                                                        color: "zinc-500",
                                                    }}>×</Font>

                                                {/* Reps input */}
                                                <Box display="flex" align="center" gap="tiny">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={edit.reps}
                                                        onChange={e => setEdits(prev => ({ ...prev, [load.id]: { ...prev[load.id], reps: e.target.value } }))}
                                                        width={64}
                                                        textAlign="center"
                                                        weight="bold"
                                                        size="sm"
                                                    />
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="bold"
                                                        {...{
                                                            color: "zinc-500",
                                                        }}>reps</Font>
                                                </Box>
                                            </Box>
                                            {!isLast && <Separator opacity={3} />}
                                        </Stack>
                                    );
                                })}
                            </Box>
                        </Box>
                    ))}
                </Stack>

                {/* Save button — floating at the bottom */}
                <Box
                    position="fixed"
                    bottom={24}
                    left={0}
                    right={0}
                    zIndex={50}
                    display="flex"
                    justify="center"
                    pointerEvents="none"
                >
                    <Box maxWidth="sm" fullWidth pointerEvents="auto">
                        <Button
                            onClick={handleSaveAll}
                            variant="emerald"
                            size="lg"
                            fullWidth
                            gap="element"
                        >
                            <Icon icon={Save} size="sm" />
                            Salvar Alterações
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
