'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

// Business Logic & Actions
import { getWorkoutLastSession } from '@/actions/log-actions'
import { generateExecutionSteps } from '@/lib/workout-flow-engine'

// Hooks (Refactored Layer)
import { useWorkoutSession } from './workout-player/hooks/use-workout-session'
import { useWorkoutFlow } from './workout-player/hooks/use-workout-flow'
import { useWorkoutRest } from './workout-player/hooks/use-workout-rest'
import { useWorkoutSummary } from './workout-player/hooks/use-workout-summary'

// UI States (Refactored Layer)
import { WorkoutExecutionState } from './workout-player/execution/workout-execution-state'
import { WorkoutRestState } from './workout-player/rest/workout-rest-state'
import { WorkoutSummaryState } from './workout-player/summary/workout-summary-state'
import { WorkoutFinishedState } from './workout-player/finished/workout-finished-state'

interface WorkoutPlayerProps {
    userId: string
    workout: any
    exercises: any[]
    initialExerciseIndex?: number
    initialLogId?: string
    initialSet?: number
    initialSetType?: 'WARMUP' | 'FEEDER' | 'WORKING'
    initialIsResting?: boolean
    initialRestEndTime?: number
    onRestChange?: (isResting: boolean) => void
}

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
    onRestChange
}: WorkoutPlayerProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [lastSession, setLastSession] = useState<any>(null)

    // ─── DOMAIN HOOKS (Semantic Orchestration) ───────────────────────────────

    const { logId, mutations } = useWorkoutSession({ 
        userId, 
        workoutId: workout.id, 
        initialLogId 
    })

    const { 
        isResting, 
        restTimeLeft, 
        restEndTime, 
        startRest, 
        handleRestEnd 
    } = useWorkoutRest({
        initialIsResting: initialIsResting || false,
        initialRestEndTime,
        onRestChange,
        onRestEnd: () => flow.advanceExercise()
    })

    const summary = useWorkoutSummary({
        onSaveSuccess: () => flow.advanceExercise()
    })

    // Initial Index Helper
    const initialIdx = (() => {
        const steps = generateExecutionSteps(exercises)
        if (!initialExerciseIndex && !initialSet && !initialSetType) return 0
        const idx = steps.findIndex((s: any) =>
            s.exerciseIndex === initialExerciseIndex &&
            s.setNumber === initialSet &&
            s.phase === initialSetType
        )
        return idx !== -1 ? idx : 0
    })()

    const flow = useWorkoutFlow({
        exercises,
        initialStepIndex: initialIdx,
        initialLogId,
        initialIsResting,
        onRestStart: (duration) => startRest(duration),
        onShowSummary: (sets) => summary.triggerSummary(sets),
        onFinish: () => setIsFinished(true)
    })

    const [isFinished, setIsFinished] = useState(false)
    const [feedback, setFeedback] = useState('')

    // ─── EFFECTS ──────────────────────────────────────────────────────────────

    // Persistence Effect (Save current state for resume)
    useEffect(() => {
        if (!logId) return
        const stateToSave = {
            exerciseIndex: flow.currentStep?.exerciseIndex,
            set: flow.currentStep?.setNumber,
            type: flow.currentStep?.phase,
            restEndTime: restEndTime,
            isResting: isResting
        }
        const timer = setTimeout(() => {
            mutations.saveState(stateToSave)
        }, 1000)
        return () => clearTimeout(timer)
    }, [flow.currentStepIndex, isResting, restEndTime, logId])

    // History Effect
    useEffect(() => {
        getWorkoutLastSession(userId, workout.id).then(data => {
            if (data) setLastSession(data)
        })
    }, [userId, workout.id])

    // ─── HANDLERS ─────────────────────────────────────────────────────────────

    const handleFinishWorkout = () => {
        mutations.finishWorkout({
            id: logId!,
            feedback,
            perceivedEffort: parseInt(summary.perceivedEffort),
            adherenceStatus: summary.adherenceStatus
        })
        toast({ title: "MISSÃO CUMPRIDA!", description: "Treino registrado com sucesso." })
        router.push('/dashboard/student')
    }

    // ─── RENDER (Orchestration Layer) ─────────────────────────────────────────

    if (isFinished) {
        return (
            <WorkoutFinishedState
                adherenceStatus={summary.adherenceStatus}
                perceivedEffort={summary.perceivedEffort}
                feedback={feedback}
                onUpdateAdherence={summary.setAdherenceStatus}
                onUpdateEffort={summary.setPerceivedEffort}
                onUpdateFeedback={setFeedback}
                onFinish={handleFinishWorkout}
            />
        )
    }

    if (summary.showSummary) {
        return (
            <WorkoutSummaryState
                currentExercise={flow.currentExercise}
                setsToSummary={summary.setsToSummary}
                lastSession={lastSession}
                summaryInputs={summary.summaryInputs}
                exerciseNote={summary.exerciseNote}
                onUpdateInput={(idx, w, r) => summary.setSummaryInputs(prev => ({ ...prev, [idx]: { weight: w, reps: r } }))}
                onUpdateNote={summary.setExerciseNote}
                onSave={() => summary.handleSave(logId, mutations.recordSet)}
            />
        )
    }

    if (isResting) {
        return (
            <WorkoutRestState
                restTimeLeft={restTimeLeft}
                nextSet={flow.nextSet}
                onSkip={handleRestEnd}
            />
        )
    }

    return (
        <WorkoutExecutionState
            currentStep={flow.currentStep}
            currentExercise={flow.currentExercise}
            nextSet={flow.nextSet}
            progress={flow.progress}
            totalCompletedSets={flow.totalCompletedSets}
            totalSteps={flow.steps.length}
            isBiSet={flow.isBiSet}
            onAction={flow.handleSetAction}
        />
    )
}


