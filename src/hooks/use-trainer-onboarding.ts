'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export type OnboardingStep = 
    | 'idle' 
    | 'import_diet'    // Step 1: Instruct to import diet PDF
    | 'create_student'  // Step 2: During import flow (automatic if bindingMode === 'create')
    | 'aha_moment'      // Step 3: Result shown, aluno pronto
    | 'discovery'       // Step 4+: Optional steps (profile, payment)
    | 'completed'

export function useTrainerOnboarding(userId: string, stats: { activeStudents: number, workoutsCount: number, dietsCount: number }) {
    const [step, setStep] = useState<OnboardingStep>('idle')
    const [ghostData, setGhostData] = useState<{ name?: string, email?: string } | null>(null)
    const pathname = usePathname()
    const router = useRouter()

    // Initialize from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem(`onboarding_step_${userId}`)
        const savedGhost = localStorage.getItem(`onboarding_ghost_${userId}`)
        
        if (saved) {
            setStep(saved as OnboardingStep)
        } else if (stats.activeStudents === 0 && stats.workoutsCount === 0 && stats.dietsCount === 0) {
            // New user detection
            setStep('import_diet')
            localStorage.setItem(`onboarding_step_${userId}`, 'import_diet')
        }

        if (savedGhost) {
            try {
                setGhostData(JSON.parse(savedGhost))
            } catch (e) {
                console.error('Failed to parse ghost data', e)
            }
        }
    }, [userId, stats])

    // State transitions based on navigation/actions
    const nextStep = (next: OnboardingStep) => {
        setStep(next)
        localStorage.setItem(`onboarding_step_${userId}`, next)
    }

    const reset = () => {
        setStep('import_diet')
        localStorage.setItem(`onboarding_step_${userId}`, 'import_diet')
    }

    const complete = () => {
        setStep('completed')
        localStorage.setItem(`onboarding_step_${userId}`, 'completed')
    }

    const dismiss = () => {
        setStep('completed')
        localStorage.setItem(`onboarding_step_${userId}`, 'completed')
    }

    return {
        step,
        ghostData,
        nextStep,
        reset,
        complete,
        dismiss
    }
}
