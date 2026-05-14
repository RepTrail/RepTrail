'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Surface } from '@/components/store/base/surface'
import {
    Play,
    Pause,
    CheckCircle,
    SkipForward,
    Timer,
    Activity,
    ChevronLeft,
    ChevronRight,
    Trophy,
    Target,
    ChevronDown,
    ChevronUp,
    XCircle,
    Check,
    Loader2
} from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { getWorkoutLastSession } from '@/actions/log-actions'
import { generateExecutionSteps, ExecutionStep, WorkoutPhase } from '@/lib/workout-flow-engine'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function WorkoutPlayer({
    userId,
    workout,
    exercises,
    initialExerciseIndex = 0,
    initialLogId,
    initialSet,
    initialSetType,
    initialIsResting,
    initialRestEndTime,
}: {
    userId: string,
    workout: any,
    exercises: any[],
    initialExerciseIndex?: number,
    initialLogId?: string,
    initialSet?: number,
    initialSetType?: 'WARMUP' | 'FEEDER' | 'WORKING',
    initialIsResting?: boolean,
    initialRestEndTime?: number
}) {
    const [lastSession, setLastSession] = useState<any>(null)
    const isMounted = useRef(false)

    // 1. Generate Linear Steps
    const steps = useMemo(() => generateExecutionSteps(exercises), [exercises])

    // 2. Find Initial Step for Resume
    const findInitialStepIndex = () => {
        if (!initialExerciseIndex && !initialSet && !initialSetType) return 0
        const idx = steps.findIndex(s =>
            s.exerciseIndex === initialExerciseIndex &&
            s.setNumber === initialSet &&
            s.phase === initialSetType
        )
        return idx !== -1 ? idx : 0
    }

    const [currentStepIndex, setCurrentStepIndex] = useState(findInitialStepIndex())
    const currentStep = steps[currentStepIndex] || steps[0]

    const [isResting, setIsResting] = useState(initialIsResting || false)
    const [restTimeLeft, setRestTimeLeft] = useState(initialRestEndTime ? Math.max(0, Math.ceil((initialRestEndTime - Date.now()) / 1000)) : 0)
    const [restEndTime, setRestEndTime] = useState<number | null>(initialRestEndTime || null)

    // Batch Input State
    const [setsLog, setSetsLog] = useState<Array<{
        id: string,
        workoutExerciseId: string,
        exerciseId: string,
        exerciseName: string,
        type: string,
        setNumber: number,
        label: string,
        expectedReps: string,
        subIndex?: number,
        groupId?: string
    }>>([])
    const [showSummary, setShowSummary] = useState(false)
    const [summaryInputs, setSummaryInputs] = useState<Record<number, { weight: string, reps: string }>>({})
    const [summaryActiveSubIndex, setSummaryActiveSubIndex] = useState<Record<string, number>>({})
    const [exerciseNote, setExerciseNote] = useState('')

    const [logId, setLogId] = useState<string | null>(initialLogId || null)
    const [isFinished, setIsFinished] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [perceivedEffort, setPerceivedEffort] = useState('7')
    const [adherenceStatus, setAdherenceStatus] = useState<'success' | 'partial' | 'fail'>('success')

    // ─── Mutations (Local-First Elite) ──────────────────────────────────────────
    
    // Mutation to Start Workout (Optimistic)
    const startWorkoutMutation = useOptimisticMutation({
        actionName: 'start-workout-log',
        queryKey: QUERY_KEYS.workouts.session,
        entity: ENTITIES.WORKOUT_LOG,
        mutationFn: async () => {}, // SyncEngine handles the RPC
        onMutate: (variables: any) => {
            // Optimistically set the active session
            const sessionData = {
                id: variables.id,
                workout_id: workout.id,
                student_id: userId,
                status: 'in_progress',
                started_at: new Date().toISOString(),
                _optimistic: true
            }
            queryClient.setQueryData(QUERY_KEYS.workouts.session, sessionData)
            
            // Also update status card
            queryClient.setQueryData(QUERY_KEYS.workouts.status(userId, workout.id), {
                status: 'in_progress',
                logId: variables.id,
                _optimistic: true
            })
        }
    })

    const recordSetMutation = useOptimisticMutation({
        actionName: 'record-set-load',
        queryKey: QUERY_KEYS.workouts.session,
        entity: ENTITIES.WORKOUT_LOG,
        mutationFn: async () => {},
        onMutate: (variables: any) => {
            // SyncEngine handles the actual load_history insert
        }
    })

    const saveStateMutation = useOptimisticMutation({
        actionName: 'update-workout-log-state',
        queryKey: QUERY_KEYS.workouts.session,
        entity: ENTITIES.WORKOUT_LOG,
        mutationFn: async () => {},
        onMutate: (variables: any) => {
            queryClient.setQueryData(QUERY_KEYS.workouts.session, (old: any) => {
                if (!old) return old
                return { ...old, current_state: variables.state }
            })
        }
    })

    const finishMutation = useOptimisticMutation({
        actionName: 'finish-workout-log',
        queryKey: QUERY_KEYS.workouts.session,
        entity: ENTITIES.WORKOUT_LOG,
        mutationFn: async () => {},
        onMutate: (variables: any) => {
            // 1. Clear active session
            queryClient.setQueryData(QUERY_KEYS.workouts.session, null)

            // 2. Mark workout as completed
            const statusKey = QUERY_KEYS.workouts.status(userId, workout.id)
            queryClient.setQueryData(statusKey, {
                status: 'completed',
                logId: variables.id,
                _optimistic: true
            })

            const todayKey = QUERY_KEYS.workouts.today(userId)
            queryClient.setQueryData(todayKey, (old: any) => {
                if (!old) return old
                return { ...old, status: 'completed', _optimistic: true }
            })
        }
    })

    const { toast } = useToast()
    const router = useRouter()
    const queryClient = useQueryClient()


    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getWorkoutLastSession(userId, workout.id)
            if (data) setLastSession(data)
        }
        fetchHistory()

        // Populate setsLog if resuming in the middle of a block
        if (initialLogId) {
            const startIdx = findInitialStepIndex()
            const currentGroup = steps[startIdx]?.groupId
            if (currentGroup) {
                const previousStepsInGroup = steps.slice(0, startIdx + (initialIsResting ? 1 : 0))
                    .filter(s => s.groupId === currentGroup)

                const reconstructedLog = previousStepsInGroup.map((s, idx) => {
                    const ex = exercises[s.exerciseIndex]
                    const sTypeLabel = ({
                        WARMUP: 'Aquecimento',
                        FEEDER: 'Feeder Set',
                        WORKING: 'Trabalho'
                    } as any)[s.phase]

                    let expectedReps = '10'
                    if (s.phase === 'WARMUP') expectedReps = ex.warmup_reps
                    else if (s.phase === 'FEEDER') expectedReps = ex.feeder_reps
                    else expectedReps = ex.reps

                    return {
                        id: `${ex.id}-${idx}-${Date.now()}`,
                        workoutExerciseId: ex.id,
                        exerciseId: ex.exercise_id || (ex as any).exercise?.id,
                        exerciseName: s.exerciseName,
                        type: s.phase,
                        setNumber: s.setNumber,
                        label: `${sTypeLabel} ${s.setNumber}`,
                        expectedReps: expectedReps || '0',
                        subIndex: s.subIndex,
                        groupId: s.groupId
                    }
                })
                setSetsLog(reconstructedLog)
            }
        }

        // Midnight check: if day changes, invalidate stale data instead of reloading
        const currentDay = new Date().toDateString()
        const interval = setInterval(() => {
            if (new Date().toDateString() !== currentDay) {
                console.log('Day changed! Refreshing stale data...')
                // Local-First: invalidate stale today data without destroying the active session
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.today(userId) })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.all(userId) })
            }
        }, 60000)

        return () => clearInterval(interval)
    }, [userId, workout.id])

    const currentExercise = exercises[currentStep.exerciseIndex]
    const currentSet = currentStep.setNumber
    const setType = currentStep.phase

    // Simplified Progress & UI Helpers
    const totalWorkoutSets = steps.length
    const totalCompletedSets = isResting ? currentStepIndex + 1 : currentStepIndex
    const progress = totalWorkoutSets > 0 ? (totalCompletedSets / totalWorkoutSets) * 100 : 0

    const isBiSet = useMemo(() => {
        const currentGroupId = currentStep.groupId
        const groupSteps = steps.filter(s => s.groupId === currentGroupId)
        const uniqueNames = new Set(groupSteps.map(s => s.exerciseName))
        return uniqueNames.size > 1
    }, [currentStep.groupId, steps])

    const setTypeLabel = ({
        WARMUP: 'Aquecimento',
        FEEDER: 'Feeder Set',
        WORKING: 'Trabalho'
    } as any)[setType]

    // Reset state on step change
    useEffect(() => {
        if (!logId) return
 
        const stateToSave = {
            exerciseIndex: currentStep.exerciseIndex,
            set: currentStep.setNumber,
            type: currentStep.phase,
            restEndTime: restEndTime,
            isResting: isResting
        }
 
        const timer = setTimeout(() => {
            saveStateMutation.mutate({ logId, state: stateToSave })
        }, 1000)
 
        return () => clearTimeout(timer)
    }, [currentStepIndex, isResting, restEndTime, logId])

    // Initialize Log (Optimistic & Instant)
    useEffect(() => {
        if (logId) return
        
        const newLogId = crypto.randomUUID()
        setLogId(newLogId)
        
        startWorkoutMutation.mutate({ 
            id: newLogId,
            workoutId: workout.id,
            studentId: userId 
        })
    }, [workout.id, userId])

    // Rest Timer Logic

    useEffect(() => {
        if (!isResting || !restEndTime) return
        const interval = setInterval(() => {
            const now = Date.now()
            const secondsLeft = Math.ceil((restEndTime - now) / 1000)
            if (secondsLeft <= 0) {
                setRestTimeLeft(0)
                handleRestEnd()
            } else {
                setRestTimeLeft(secondsLeft)
            }
        }, 200)
        return () => clearInterval(interval)
    }, [isResting, restEndTime])

    const handleRestEnd = () => {
        setIsResting(false)
        setRestEndTime(null)

        if (currentStep.isLastInBlock) {
            advanceExercise()
            return
        }

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1)
        }

        if ("Notification" in window && Notification.permission === "granted") {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification("Descanso Finalizado!", {
                        body: "Hora de voltar para a série.",
                        icon: '/icon.jpg',
                        badge: '/icon.jpg',
                        vibrate: [200, 100, 200],
                        tag: 'workout-rest'
                    } as any);
                });
            } else {
                new Notification("Descanso Finalizado!", { body: "Hora de voltar para a série." })
            }
        }
    }

    const advanceExercise = () => {
        // Clear log for next block
        setSetsLog([])
        setSummaryInputs({})
        setExerciseNote('')
        setShowSummary(false)

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1)
        } else {
            setIsFinished(true)
        }
    }

    // Main Interaction Handler
    const handleSetAction = () => {
        // Record current set
        let expectedReps = '10'
        if (setType === 'WARMUP') expectedReps = currentExercise.warmup_reps
        else if (setType === 'FEEDER') expectedReps = currentExercise.feeder_reps
        else expectedReps = currentExercise.reps

        setSetsLog(prev => [...prev, {
            id: `${currentExercise.id}-${setsLog.length}-${Date.now()}`,
            workoutExerciseId: currentExercise.id,
            exerciseId: currentExercise.exercise_id || (currentExercise as any).exercise?.id,
            exerciseName: currentStep.exerciseName,
            type: setType,
            setNumber: currentSet,
            label: `${setTypeLabel} ${currentSet}`,
            expectedReps: expectedReps || '0',
            subIndex: currentStep.subIndex,
            groupId: currentStep.groupId
        }])

        // Intra-block logic (Rest or Switch)
        if (currentStep.isLastInBlock) {
            setShowSummary(true)
        } else if (currentStep.restSeconds > 0) {
            setRestTimeLeft(currentStep.restSeconds)
            setRestEndTime(Date.now() + currentStep.restSeconds * 1000)
            setIsResting(true)

            if ("Notification" in window && Notification.permission === "default") {
                Notification.requestPermission()
            }
        } else {
            setCurrentStepIndex(prev => prev + 1)
        }
    }

    const handleSaveExercise = async () => {
        // Validate that all sets have inputs (Mandatory Load Recording)
        for (let i = 0; i < setsLog.length; i++) {
            if (!summaryInputs[i]?.weight || !summaryInputs[i]?.reps) {
                toast({ variant: 'destructive', title: 'Dados Incompletos', description: 'Preencha carga e repetições de todas as séries.' })
                return
            }
        }

        if (logId) {
            // OPTIMISTIC ADVANCE: Move UI forward immediately
            const cachedCurrentStep = currentStep
            const cachedCurrentStepIndex = currentStepIndex

            if (cachedCurrentStep.restSeconds > 0 && cachedCurrentStepIndex < steps.length - 1) {
                setShowSummary(false)
                setRestTimeLeft(cachedCurrentStep.restSeconds)
                setRestEndTime(Date.now() + cachedCurrentStep.restSeconds * 1000)
                setIsResting(true)
            } else {
                advanceExercise()
            }

            // Fire and forget recording (Local-First Style)
            setsLog.forEach((set, i) => {
                const input = summaryInputs[i]
                const recordNotes = set.subIndex !== undefined && set.subIndex > 0 || (setsLog.some(s => s.groupId === set.groupId && s.subIndex !== undefined && s.subIndex > 0))
                    ? `[${set.exerciseName}] ${i === setsLog.length - 1 ? exerciseNote : ''}`
                    : (i === setsLog.length - 1 ? exerciseNote : '')

                recordSetMutation.mutate({
                    logId,
                    exerciseId: set.exerciseId,
                    weight: parseFloat(input.weight),
                    reps: parseInt(input.reps),
                    setType: set.type as any,
                    notes: recordNotes,
                    subIndex: set.subIndex,
                    groupId: set.groupId
                })
            })
        }
    }

    const handleFinishWorkout = () => {
        if (logId) {
            finishMutation.mutate({
                id: logId,
                feedback,
                perceivedEffort: parseInt(perceivedEffort),
                adherenceStatus
            })
        }
        
        toast({ title: "MISSÃO CUMPRIDA!", description: "Treino registrado com sucesso." })
        router.push('/dashboard/student')
    }

    const setTypeColor = ({
        WARMUP: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        FEEDER: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        WORKING: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    } as any)[setType]

    const getNextSetInfo = () => {
        if (currentStepIndex >= steps.length - 1) {
            return { label: 'Resumo do Exercício', set: 0, type: 'SUMMARY', color: 'text-white', isNewExercise: false, nextExerciseName: '' }
        }

        const next = steps[currentStepIndex + 1]
        const label = ({
            WARMUP: 'Aquecimento',
            FEEDER: 'Feeder Set',
            WORKING: 'Série de Trabalho'
        } as any)[next.phase]

        const color = ({
            WARMUP: 'text-orange-500',
            FEEDER: 'text-blue-500',
            WORKING: 'text-emerald-500'
        } as any)[next.phase]

        const isNewExercise = next.exerciseName !== currentStep.exerciseName

        return { label, set: next.setNumber, type: next.phase, color, isNewExercise, nextExerciseName: next.exerciseName }
    }

    const nextSet = getNextSetInfo()

    if (isFinished) {
        return (
            <Stack align="center" justify="center" padding={STORE_TOKENS.PADDING.SECTION} gap={STORE_TOKENS.SPACING.SECTION} maxWidth="md" className="mx-auto animate-in fade-in zoom-in duration-500">
                <Box position="relative">
                    <Box 
                        position="absolute" 
                        pin="inset" 
                        bg="emerald" 
                        bgOpacity={20} 
                        rounded="full" 
                        className="blur-3xl animate-pulse" 
                    />
                    <Surface variant="glass" border="standard" padding={STORE_TOKENS.PADDING.ELEMENT} rounded="full" className="relative shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                        <Icon icon={CheckCircle} size="lg" color="emerald" />
                    </Surface>
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                    <Font variant="h2" weight="black" italic color="white" uppercase tracking="tight">
                        Treino Finalizado!
                    </Font>
                    <Font variant="sub-tiny" weight="black" uppercase tracking="widest" color="zinc-500">
                        Como foi o seu desempenho hoje?
                    </Font>
                </Stack>

                <Surface variant="glass" border="standard" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} fullWidth>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {/* Status Selection */}
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                                Como foi a execução?
                            </Font>
                            <Grid columns={3} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Button
                                    variant={adherenceStatus === 'success' ? 'primary' : 'ghost'}
                                    onClick={() => setAdherenceStatus('success')}
                                    className="h-12"
                                    color={adherenceStatus === 'success' ? 'emerald' : 'zinc'}
                                >
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Icon icon={CheckCircle} size="xs" />
                                        <Font variant="sub-tiny" weight="black" uppercase tracking="tight">Sucesso</Font>
                                    </Stack>
                                </Button>
                                <Button
                                    variant={adherenceStatus === 'partial' ? 'primary' : 'ghost'}
                                    onClick={() => setAdherenceStatus('partial')}
                                    className="h-12"
                                    color={adherenceStatus === 'partial' ? 'orange' : 'zinc'}
                                >
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Icon icon={Activity} size="xs" />
                                        <Font variant="sub-tiny" weight="black" uppercase tracking="tight">Parcial</Font>
                                    </Stack>
                                </Button>
                                <Button
                                    variant={adherenceStatus === 'fail' ? 'primary' : 'ghost'}
                                    onClick={() => setAdherenceStatus('fail')}
                                    className="h-12"
                                    color={adherenceStatus === 'fail' ? 'red' : 'zinc'}
                                >
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Icon icon={XCircle} size="xs" />
                                        <Font variant="sub-tiny" weight="black" uppercase tracking="tight">Falha</Font>
                                    </Stack>
                                </Button>
                            </Grid>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                                Percepção de Esforço (1-10)
                            </Font>
                            <Box bg="black" bgOpacity={40} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} rounded="system" padding={2.5}>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="10" 
                                    value={perceivedEffort} 
                                    onChange={(e) => setPerceivedEffort(e.target.value)} 
                                    className="w-full bg-transparent text-white text-2xl font-black text-center outline-none h-12"
                                />
                            </Box>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                                Relato do Aluno
                            </Font>
                            <Box bg="black" bgOpacity={40} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} rounded="system" padding={STORE_TOKENS.PADDING.ELEMENT}>
                                <textarea 
                                    value={feedback} 
                                    onChange={(e) => setFeedback(e.target.value)} 
                                    placeholder="Comentários sobre o treino..." 
                                    className="w-full bg-transparent text-zinc-300 text-sm font-medium min-h-[100px] outline-none border-none resize-none" 
                                />
                            </Box>
                        </Stack>
                    </Stack>
                </Surface>

                <Button 
                    onClick={handleFinishWorkout} 
                    variant="primary"
                    color="emerald"
                    fullWidth 
                    size="lg"
                    className="h-20"
                >
                    <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="h4" weight="black" italic uppercase tracking="tight">Confirmar e Sair</Font>
                        <Icon icon={Check} size="sm" />
                    </Stack>
                </Button>
            </Stack>
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} padding={STORE_TOKENS.PADDING.CONTAINER}>
            {/* Progress Bar */}
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Stack direction="row" align="end" justify="between" padding={2.5}>
                    <Stack gap={2.5}>
                        <Font variant="sub-tiny" weight="black" color="zinc-600" uppercase tracking="widest">Progresso Geral</Font>
                        <Font variant="h3" weight="black" color="white" italic uppercase tracking="tight">
                            {totalCompletedSets} <span className="text-zinc-700">/ {totalWorkoutSets}</span>
                        </Font>
                    </Stack>
                    <Box bg="emerald" bgOpacity={10} padding={STORE_TOKENS.PADDING.ELEMENT} rounded="system" border borderColor="emerald">
                        <Font variant="sub-tiny" weight="black" color="emerald" uppercase tracking="widest">
                            {Math.round(progress)}%
                        </Font>
                    </Box>
                </Stack>
                <Box height={2} bg="zinc" bgOpacity={50} rounded="full" overflow="hidden" border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}>
                    <Box 
                        height="full" 
                        bg="emerald" 
                        className="transition-all duration-700 ease-out" 
                        style={{ width: `${progress}%` }} 
                    />
                </Box>
            </Stack>
                             {showSummary ? (
                    // SUMMARY VIEW
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard" borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}>
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Stack gap={2.5}>
                                    <Font variant="h3" weight="black" color="white" uppercase italic tracking="tight">Última Sessão</Font>
                                    <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase tracking="widest">Preencha os dados das séries realizadas</Font>
                                </Stack>

                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} maxHeight={500} overflowY="auto" className="pr-2 custom-scrollbar">
                                    {Object.entries(
                                        setsLog.reduce((acc, set, idx) => {
                                            const groupId = set.groupId || 'none'
                                            if (!acc[groupId]) acc[groupId] = { items: [] }
                                            acc[groupId].items.push({ ...set, summaryIdx: idx })
                                            return acc
                                        }, {} as Record<string, { items: any[] }>)
                                    ).map(([gId, group]) => {
                                        const uniqueExercises = Array.from(new Set(group.items.map(i => i.exerciseName)))
                                        const activeSubIndex = summaryActiveSubIndex[gId] || 0
                                        const activeExerciseName = uniqueExercises[activeSubIndex] || uniqueExercises[0]
                                        const filteredItems = group.items.filter(i => i.exerciseName === activeExerciseName)

                                        return (
                                            <Surface key={gId} variant="tonal-zinc" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard" borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}>
                                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                            <Box width={1.5} height={6} bg="emerald" rounded="full" className="shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                            <Font variant="body" weight="black" color="white" uppercase italic tracking="tight">
                                                                {uniqueExercises.length > 1 ? "Exercício Conjugado" : activeExerciseName}
                                                            </Font>
                                                        </Stack>

                                                        {uniqueExercises.length > 1 && (
                                                            <Box bg="black" bgOpacity={20} rounded="system" padding={STORE_TOKENS.PADDING.ELEMENT} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}>
                                                                <Grid columns={uniqueExercises.length} gap={2.5}>
                                                                    {uniqueExercises.map((exName, idx) => (
                                                                        <Button
                                                                            key={exName}
                                                                            variant={activeSubIndex === idx ? 'primary' : 'ghost'}
                                                                            size="sm"
                                                                            onClick={() => setSummaryActiveSubIndex(prev => ({ ...prev, [gId]: idx }))}
                                                                            color={activeSubIndex === idx ? 'emerald' : 'zinc'}
                                                                        >
                                                                            <Font variant="sub-tiny" weight="black" color="white" italic uppercase tracking="tight">
                                                                                {exName}
                                                                            </Font>
                                                                        </Button>
                                                                    ))}
                                                                </Grid>
                                                            </Box>
                                                        )}
                                                    </Stack>

                                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                        {filteredItems.map((set) => {
                                                            const exerciseHistory = lastSession?.loads?.filter((l: any) => l.exercise_id === set.exerciseId) || []
                                                            const pHistory = exerciseHistory.filter((l: any) => l.notes?.includes(`[${set.exerciseName}]`))
                                                            const historyRef = pHistory.length > 0 ? pHistory : exerciseHistory
                                                            const lastSessionSet = historyRef[set.setNumber - 1]

                                                            return (
                                                                <SummarySetRow
                                                                    key={set.summaryIdx}
                                                                    set={set}
                                                                    lastSessionSet={lastSessionSet}
                                                                    initialWeight={summaryInputs[set.summaryIdx]?.weight || ''}
                                                                    initialReps={summaryInputs[set.summaryIdx]?.reps || ''}
                                                                    onUpdate={(weight: string, reps: string) =>
                                                                        setSummaryInputs(prev => ({ ...prev, [set.summaryIdx]: { weight, reps } }))
                                                                    }
                                                                />
                                                            )
                                                        })}
                                                    </Stack>
                                                </Stack>
                                            </Surface>
                                        )
                                    })}
                                </Stack>

                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} padding={STORE_TOKENS.PADDING.ELEMENT} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} className="border-t">
                                    <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Anotação Técnica</Font>
                                    <Box bg="black" bgOpacity={40} rounded="system" border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} padding={STORE_TOKENS.PADDING.ELEMENT}>
                                        <textarea
                                            value={exerciseNote}
                                            onChange={(e) => setExerciseNote(e.target.value)}
                                            placeholder="Como foi o desempenho neste exercício?"
                                            className="w-full bg-transparent text-xs font-medium text-zinc-300 outline-none h-20 italic resize-none"
                                        />
                                    </Box>
                                </Stack>
                            </Stack>
                        </Surface>

                        <Button
                            variant="primary"
                            color="emerald"
                            fullWidth
                            className="h-20"
                            onClick={handleSaveExercise}
                        >
                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="h4" weight="black" italic uppercase tracking="tight">Concluir Exercício</Font>
                                <Icon icon={CheckCircle} size="sm" />
                            </Stack>
                        </Button>
                    </Stack>
                ) : isResting ? (
                    // REST VIEW
                    <Stack align="center" justify="center" padding="section" gap="section" maxWidth="md" className="mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Box position="relative">
                            <Box 
                                position="absolute" 
                                pin="inset" 
                                bg="emerald" 
                                bgOpacity={10} 
                                rounded="full" 
                                className="blur-3xl" 
                            />
                            <Surface variant="tonal-zinc" width={48} height={48} rounded="full" border="standard" borderColor="zinc-900" display="flex" align="center" justify="center">
                                <Box position="absolute" top={0} left="50%" className="-translate-x-1/2 -translate-y-1/2">
                                    <Surface variant="glass" padding={STORE_TOKENS.PADDING.ELEMENT} rounded="full" border="standard" borderColor="zinc-900">
                                        <Icon icon={Timer} size="sm" color="zinc-700" />
                                    </Surface>
                                </Box>
                                <Font variant="massive" weight="black" color="white" italic tracking="tight">
                                    {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
                                </Font>
                            </Surface>
                        </Box>

                        <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT} textAlign="center">
                            <Font variant="body" weight="black" color="white" uppercase italic>Hora de Descansar</Font>
                            {nextSet && (
                                <Stack align="center" gap={2.5} className="animate-pulse">
                                    {nextSet.isNewExercise && nextSet.nextExerciseName ? (
                                        <>
                                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Prepare-se para o próximo Exercício</Font>
                                            <Font variant="h2" weight="black" color="orange" uppercase italic tracking="tight">
                                                {nextSet.nextExerciseName}
                                            </Font>
                                            <Surface variant="tonal-zinc" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard" borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} className="mt-4">
                                                <Stack align="center" gap={0}>
                                                    <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Primeira Série</Font>
                                                    <Font variant="body-sm" weight="black" color={nextSet.color as any} uppercase italic tracking="tight">
                                                        {nextSet.label} {nextSet.type !== 'SUMMARY' && nextSet.set}
                                                    </Font>
                                                </Stack>
                                            </Surface>
                                        </>
                                    ) : (
                                        <>
                                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Próxima Série</Font>
                                            <Font variant="h3" weight="black" color={nextSet.color as any} uppercase italic tracking="tight">
                                                {nextSet.label} {nextSet.type !== 'SUMMARY' && nextSet.set}
                                            </Font>
                                        </>
                                    )}
                                </Stack>
                            )}
                        </Stack>

                        <Button
                            variant="ghost"
                            onClick={handleRestEnd}
                            className="h-12"
                        >
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={SkipForward} size="xs" color="zinc-500" />
                                <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase italic tracking="widest">Pular Descanso</Font>
                            </Stack>
                        </Button>
                    </Stack>
                ) : (
                    // EXECUTION VIEW
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Header + Info Card */}
                        <Surface variant="glass" border="standard" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} className="relative overflow-hidden group">
                            {/* Background Icon */}
                            <Box position="absolute" top={-40} right={-40} padding={STORE_TOKENS.PADDING.CONTAINER} className="opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 pointer-events-none">
                                <Icon icon={Play} size="100" color="white" />
                            </Box>

                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} className="relative z-10">
                                {/* Header */}
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Surface variant="tonal-zinc" padding={STORE_TOKENS.PADDING.ELEMENT} rounded="system" border="standard" borderColor="emerald">
                                            <Font variant="sub-tiny" weight="black" uppercase italic tracking="widest" color={setType === 'WARMUP' ? 'orange' : setType === 'FEEDER' ? 'blue' : 'emerald'}>
                                                {setTypeLabel}
                                            </Font>
                                        </Surface>
                                        {isBiSet && (
                                            <Surface variant="glass" border="subtle" padding={STORE_TOKENS.PADDING.ELEMENT} rounded="system">
                                                <Font variant="sub-tiny" weight="black" uppercase italic tracking="tight" color="zinc-500">
                                                    Bi-Set / Conjugado
                                                </Font>
                                            </Surface>
                                        )}
                                        {setType === 'WORKING' && (
                                            <Box width={2} height={2} bg="emerald" rounded="full" className="animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                        )}
                                    </Stack>
                                    <Font variant="h1" weight="black" color="white" uppercase italic tracking="tight" className="leading-[0.9]">
                                        {currentStep.exerciseName}
                                    </Font>
                                    {currentStep.subIndex !== undefined && (
                                        <Box bg="black" bgOpacity={40} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} padding={2.5} rounded="system" width="auto">
                                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                                                PARTE {(currentStep.subIndex + 1)}
                                            </Font>
                                        </Box>
                                    )}
                                </Stack>

                                {/* HUD Stats Layout Grid */}
                                <Grid columns={12} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    {/* Current Set - Prominent */}
                                    <Box colSpan={12} bg="zinc" bgOpacity={40} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} padding={STORE_TOKENS.PADDING.ELEMENT} rounded="system" display="flex" align="center" justify="between" className="shadow-2xl backdrop-blur-md">
                                        <Stack gap={2.5}>
                                            <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase tracking="widest">Série</Font>
                                            <Font variant="massive" weight="black" color="white" italic tracking="tight" className="leading-none">
                                                {currentSet}<span className="text-zinc-600 text-3xl align-top ml-1">/{
                                                    setType === 'WARMUP' ? currentExercise.warmup_sets :
                                                        setType === 'FEEDER' ? currentExercise.feeder_sets :
                                                            (currentExercise.working_sets || 3)
                                                }</span>
                                            </Font>
                                        </Stack>
                                        <Box width={10} height={10} bg="zinc" bgOpacity={40} rounded="full" display="flex" align="center" justify="center" border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}>
                                            <Icon icon={Trophy} size="sm" color="zinc-400" />
                                        </Box>
                                    </Box>

                                    {/* Target Reps (60%) */}
                                    <Box colSpan={7} bg="zinc" bgOpacity={20} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} padding={STORE_TOKENS.PADDING.ELEMENT} rounded="system">
                                        <Stack gap={2.5}>
                                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Alvo</Font>
                                            <Font variant="h2" weight="black" color="emerald" italic tracking="tight">
                                                {(() => {
                                                    const val = (setType === 'WARMUP' ? currentExercise.warmup_reps :
                                                        setType === 'FEEDER' ? currentExercise.feeder_reps :
                                                            currentExercise.reps) || '10'
                                                    const match = val.match(/(?:\d+.*series?|series?.*de|x)\s*(\d+(?:\s*[-–a/]\s*\d+)?)\b/i)
                                                    if (match) return match[1].replace(/\s+/g, '').replace(/a|[-–/]/g, '-')
                                                    return val.replace(/(?:movimentos|reps?|repetições|repeticoes|series?|de)/gi, '').trim()
                                                })()}
                                                <span className="text-zinc-500 text-xs font-bold ml-1 uppercase tracking-widest">REPS</span>
                                            </Font>
                                        </Stack>
                                    </Box>

                                    {/* Rest Time (40%) */}
                                    <Box colSpan={5} bg="zinc" bgOpacity={20} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} padding={STORE_TOKENS.PADDING.ELEMENT} rounded="system">
                                        <Stack gap={2.5}>
                                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Descanso</Font>
                                            <Font variant="h2" weight="black" color="zinc-400" italic tracking="tight">
                                                {setType === 'WARMUP' ? currentExercise.warmup_rest_seconds || 45 :
                                                    setType === 'FEEDER' ? currentExercise.feeder_rest_seconds || 60 :
                                                        currentExercise.rest_seconds || 60}
                                                <Font variant="tiny" color="zinc-500" weight="bold" className="opacity-60 uppercase tracking-widest">s</Font>
                                            </Font>
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Stack>
                        </Surface>

                        {/* Action Button - Massive Icon */}
                        <Button
                            variant="primary"
                            color={setType === 'WARMUP' ? 'orange' : setType === 'FEEDER' ? 'blue' : 'emerald'}
                            fullWidth
                            size="lg"
                            className="h-32 rounded-full overflow-hidden group"
                            onClick={handleSetAction}
                        >
                            <Box position="absolute" pin="inset" bg="white" bgOpacity={10} className="translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <Stack direction="row" align="center" justify="between" fullWidth padding={STORE_TOKENS.PADDING.CONTAINER} className="relative z-10">
                                <Stack gap={2.5}>
                                    <Font variant="sub-tiny" weight="bold" uppercase tracking="widest" className="opacity-80">
                                        {isBiSet && currentStep.restSeconds === 0 ? `Próximo: ${steps[currentStepIndex + 1]?.exerciseName || 'Exercício'}` :
                                            currentStep.isLastInBlock ? 'Finalizar' : 'Iniciar Descanso'}
                                    </Font>
                                    <Font variant="h3" weight="black" italic uppercase tracking="tight">
                                        {isBiSet && currentStep.restSeconds === 0 ? 'Ir para próximo' :
                                            currentStep.isLastInBlock ? 'Concluir & Revisar' : setTypeLabel}
                                    </Font>
                                </Stack>
                                <Icon icon={Play} size="lg" className="fill-current" />
                            </Stack>
                        </Button>
                    </Stack>
                )}
            </Stack>
    )
}


function SummarySetRow({ set, lastSessionSet, initialWeight, initialReps, onUpdate }: { set: any, lastSessionSet?: any, initialWeight: string, initialReps: string, onUpdate: (w: string, r: string) => void }) {
    const [weight, setWeight] = useState(initialWeight)
    const [reps, setReps] = useState(initialReps)

    const handleChange = (type: 'weight' | 'reps', val: string) => {
        let newWeight = weight
        let newReps = reps
        if (type === 'weight') {
            setWeight(val)
            newWeight = val
        } else {
            setReps(val)
            newReps = val
        }
        onUpdate(newWeight, newReps)
    }

    return (
        <Surface variant="tonal-zinc" padding={STORE_TOKENS.PADDING.ELEMENT} rounded="system" border="standard" borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}>
            <Stack direction={{ base: 'col', md: 'row' }} align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Box width="full" shrink={0} className="md:w-40">
                    <Surface 
                        variant="tonal-zinc" 
                        padding={STORE_TOKENS.PADDING.ELEMENT} 
                        rounded="system" 
                        border="standard"

                        borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}
                        width="auto"
                    >
                        <Font variant="sub-tiny" weight="black" color={set.type === 'WARMUP' ? 'orange' : set.type === 'FEEDER' ? 'blue' : 'emerald'} uppercase tracking="widest">
                            {set.type === 'WORKING' ? `Série ${set.setNumber}` : set.label}
                        </Font>
                    </Surface>
                </Box>

                <Grid columns={2} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <Stack gap={2.5}>
                        <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Carga (kg)</Font>
                        <Box bg="black" bgOpacity={40} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} rounded="system" padding={STORE_TOKENS.PADDING.ELEMENT}>
                            <input
                                type="number"
                                placeholder="0"
                                value={weight}
                                onChange={e => handleChange('weight', e.target.value)}
                                className="w-full bg-transparent text-white font-bold text-center outline-none h-8"
                            />
                        </Box>
                    </Stack>
                    <Stack gap={2.5}>
                        <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Reps</Font>
                        <Box bg="black" bgOpacity={40} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} rounded="system" padding={STORE_TOKENS.PADDING.ELEMENT}>
                            <input
                                type="number"
                                placeholder={set.expectedReps}
                                value={reps}
                                onChange={e => handleChange('reps', e.target.value)}
                                className="w-full bg-transparent text-emerald-500 font-bold text-center outline-none h-8"
                            />
                        </Box>
                    </Stack>
                </Grid>
            </Stack>
        </Surface>
    )
}


