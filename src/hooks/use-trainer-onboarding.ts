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
    const [isTourActive, setIsTourActive] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    // Extract primitive values to avoid infinite loops when object reference changes
    const { activeStudents, workoutsCount, dietsCount } = stats;

    // Initialize from LocalStorage
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const forceReset = urlParams.get('reset_tour') === 'true'

        if (forceReset) {
            localStorage.removeItem(`onboarding_step_${userId}`)
            localStorage.removeItem(`onboarding_ghost_${userId}`)
            localStorage.removeItem(`onboarding_tour_dismissed_${userId}`)
            window.location.href = '/dashboard/trainer'
            return
        }

        const saved = localStorage.getItem(`onboarding_step_${userId}`)
        const savedGhost = localStorage.getItem(`onboarding_ghost_${userId}`)
        const tourDismissed = localStorage.getItem(`onboarding_tour_dismissed_${userId}`)
        
        if (saved) {
            setStep(saved as OnboardingStep)
        } else if (activeStudents === 0 && workoutsCount === 0 && dietsCount === 0) {
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

        // Start tour if not dismissed and we are in onboarding
        if (!tourDismissed && saved !== 'completed') {
            setIsTourActive(true)
        }

        // 🔄 SYNC: Listen for changes from other instances (e.g. Page updating Layout)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === `onboarding_step_${userId}` && e.newValue) {
                setStep(e.newValue as OnboardingStep)
            }
            if (e.key === `onboarding_tour_dismissed_${userId}` && e.newValue === 'true') {
                setIsTourActive(false)
            }
        }
        const handleCustomUpdate = (e: any) => {
            if (e.detail?.step) {
                setStep(e.detail.step)
            }
        }

        window.addEventListener('storage', handleStorage)
        window.addEventListener('onboarding_update', handleCustomUpdate)
        return () => {
            window.removeEventListener('storage', handleStorage)
            window.removeEventListener('onboarding_update', handleCustomUpdate)
        }
    }, [userId, activeStudents, workoutsCount, dietsCount])

    // State transitions based on navigation/actions
    const nextStep = (next: OnboardingStep) => {
        setStep(next)
        localStorage.setItem(`onboarding_step_${userId}`, next)
        window.dispatchEvent(new CustomEvent('onboarding_update', { detail: { step: next } }))
    }

    const reset = () => {
        setStep('import_diet')
        localStorage.setItem(`onboarding_step_${userId}`, 'import_diet')
    }

    const complete = () => {
        setStep('completed')
        localStorage.setItem(`onboarding_step_${userId}`, 'completed')
        setIsTourActive(false)
    }

    const dismiss = () => {
        setStep('completed')
        localStorage.setItem(`onboarding_step_${userId}`, 'completed')
        setIsTourActive(false)
        localStorage.setItem(`onboarding_tour_dismissed_${userId}`, 'true')
    }

    const dismissTour = () => {
        setIsTourActive(false)
        localStorage.setItem(`onboarding_tour_dismissed_${userId}`, 'true')
    }

    return {
        step,
        ghostData,
        isTourActive,
        nextStep,
        reset,
        complete,
        dismiss,
        dismissTour
    }
}
