'use client'

import { useState, useMemo, useEffect } from 'react'
import { generateExecutionSteps } from '@/lib/workout-flow-engine'

interface UseWorkoutFlowProps {
    exercises: any[]
    initialStepIndex: number
    initialLogId?: string
    initialIsResting?: boolean
    onRestStart: (duration: number) => void
    onShowSummary: (setsToSummary: any[]) => void
    onFinish: () => void
}

export function useWorkoutFlow({ 
    exercises, 
    initialStepIndex, 
    initialLogId,
    initialIsResting,
    onRestStart,
    onShowSummary,
    onFinish
}: UseWorkoutFlowProps) {
    const steps = useMemo(() => generateExecutionSteps(exercises), [exercises])
    const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex)
    const [setsLog, setSetsLog] = useState<any[]>([])

    // ─── Initialization (Resume Logic) ───────────────────────────────────────
    useEffect(() => {
        if (initialLogId) {
            const currentGroup = steps[initialStepIndex]?.groupId
            if (currentGroup) {
                const previousStepsInGroup = steps.slice(0, initialStepIndex + (initialIsResting ? 1 : 0))
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
    }, [initialLogId, initialStepIndex, initialIsResting, steps, exercises])
    
    const currentStep = steps[currentStepIndex] || steps[0]
    const currentExercise = exercises[currentStep?.exerciseIndex]
    
    const totalCompletedSets = currentStepIndex
    const progress = steps.length > 0 ? (totalCompletedSets / steps.length) * 100 : 0

    const isBiSet = useMemo(() => {
        if (!currentStep) return false
        const groupSteps = steps.filter(s => s.groupId === currentStep.groupId)
        return new Set(groupSteps.map(s => s.exerciseName)).size > 1
    }, [currentStep?.groupId, steps])

    const nextSet = useMemo(() => {
        if (currentStepIndex >= steps.length - 1) return null
        const next = steps[currentStepIndex + 1]
        return {
            label: ({ WARMUP: 'Aquecimento', FEEDER: 'Feeder Set', WORKING: 'Série de Trabalho' } as any)[next.phase],
            set: next.setNumber,
            variant: ({ WARMUP: 'orange', FEEDER: 'blue', WORKING: 'emerald' } as any)[next.phase],
            isNewExercise: next.exerciseName !== currentStep.exerciseName,
            exerciseName: next.exerciseName
        }
    }, [currentStepIndex, steps, currentStep?.exerciseName])

    const advanceExercise = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1)
        } else {
            onFinish()
        }
    }

    const handleSetAction = () => {
        const ex = exercises[currentStep.exerciseIndex]
        let expectedReps = '10'
        if (currentStep.phase === 'WARMUP') expectedReps = ex.warmup_reps
        else if (currentStep.phase === 'FEEDER') expectedReps = ex.feeder_reps
        else expectedReps = ex.reps

        const newSetRecord = {
            id: `${ex.id}-${currentStepIndex}-${Date.now()}`,
            workoutExerciseId: ex.id,
            exerciseId: ex.exercise_id || (ex as any).exercise?.id,
            exerciseName: currentStep.exerciseName,
            type: currentStep.phase,
            setNumber: currentStep.setNumber,
            label: `${({ WARMUP: 'Aquecimento', FEEDER: 'Feeder Set', WORKING: 'Trabalho' } as any)[currentStep.phase]} ${currentStep.setNumber}`,
            expectedReps: expectedReps || '0',
            subIndex: currentStep.subIndex,
            groupId: currentStep.groupId
        }

        const updatedLog = [...setsLog, newSetRecord]
        setSetsLog(updatedLog)

        if (currentStep.isLastInBlock) {
            const currentGroupSets = updatedLog.filter(s => s.groupId === currentStep.groupId)
            onShowSummary(currentGroupSets)
        } else {
            onRestStart(ex.rest_seconds || 60)
        }
    }

    return {
        steps,
        currentStepIndex,
        setCurrentStepIndex,
        currentStep,
        currentExercise,
        setsLog,
        setSetsLog,
        progress,
        totalCompletedSets,
        isBiSet,
        nextSet,
        advanceExercise,
        handleSetAction
    }
}
