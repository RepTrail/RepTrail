'use client'

import { useState } from 'react'

interface UseWorkoutSummaryProps {
    initialPerceivedEffort?: string
    initialAdherenceStatus?: 'success' | 'partial' | 'fail'
    onSaveSuccess: () => void
}

export function useWorkoutSummary({ 
    initialPerceivedEffort = '5', 
    initialAdherenceStatus = 'success',
    onSaveSuccess
}: UseWorkoutSummaryProps) {
    const [showSummary, setShowSummary] = useState(false)
    const [setsToSummary, setSetsToSummary] = useState<any[]>([])
    const [summaryInputs, setSummaryInputs] = useState<Record<number, { weight: string, reps: string }>>({})
    const [exerciseNote, setExerciseNote] = useState('')
    const [perceivedEffort, setPerceivedEffort] = useState(initialPerceivedEffort)
    const [adherenceStatus, setAdherenceStatus] = useState<'success' | 'partial' | 'fail'>(initialAdherenceStatus)

    const triggerSummary = (sets: any[]) => {
        setSetsToSummary(sets)
        setShowSummary(true)
    }

    const handleSave = (logId: string | null, recordSetMutation: (vars: any) => void) => {
        if (logId) {
            setsToSummary.forEach((set, i) => {
                const input = summaryInputs[i] || { weight: '0', reps: '0' }
                const recordNotes = (set.subIndex !== undefined && set.subIndex > 0) || 
                    (setsToSummary.some(s => s.groupId === set.groupId && s.subIndex !== undefined && s.subIndex > 0))
                    ? `[${set.exerciseName}] ${i === setsToSummary.length - 1 ? exerciseNote : ''}`
                    : (i === setsToSummary.length - 1 ? exerciseNote : '')

                recordSetMutation({
                    logId,
                    exerciseId: set.exerciseId,
                    weight: parseFloat(input.weight || '0'),
                    reps: parseInt(input.reps || '0'),
                    setType: set.type as any,
                    notes: recordNotes,
                    subIndex: set.subIndex,
                    groupId: set.groupId
                })
            })
        }
        
        setSummaryInputs({})
        setExerciseNote('')
        setShowSummary(false)
        onSaveSuccess()
    }

    return {
        showSummary,
        setShowSummary,
        setsToSummary,
        triggerSummary,
        summaryInputs,
        setSummaryInputs,
        exerciseNote,
        setExerciseNote,
        perceivedEffort,
        setPerceivedEffort,
        adherenceStatus,
        setAdherenceStatus,
        handleSave
    }
}
