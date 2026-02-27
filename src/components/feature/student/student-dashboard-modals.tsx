'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AutoTrainingOnboardingModal } from '@/components/feature/student/auto-training-onboarding-modal'
import { dismissAutoTrainingForSession, resetAutoTrainingOnboardingModal } from '@/actions/auto-training-actions'

interface StudentDashboardModalProps {
    userId: string
    showModal: boolean
    hasTrainer: boolean
}

export function StudentDashboardModals({ userId, showModal, hasTrainer }: StudentDashboardModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (showModal && !hasTrainer) {
            setIsModalOpen(true)
        }
    }, [showModal, hasTrainer])

    useEffect(() => {
        const handleOpen = () => setIsModalOpen(true)
        window.addEventListener('open-auto-training-onboarding', handleOpen)
        return () => window.removeEventListener('open-auto-training-onboarding', handleOpen)
    }, [])

    const handleAccept = async () => {
        // User accepted, so we mark it as seen so it doesn't pop up again
        // unless they go to settings and force it again.
        await dismissAutoTrainingForSession(userId)
        setIsModalOpen(false)
        router.refresh()
    }

    const handleReject = async () => {
        await dismissAutoTrainingForSession(userId)
        setIsModalOpen(false)
        router.refresh()
    }

    const handleClose = () => {
        setIsModalOpen(false)
    }

    return (
        <AutoTrainingOnboardingModal
            isOpen={isModalOpen}
            onAccept={handleAccept}
            onReject={handleReject}
            onClose={handleClose}
        />
    )
}
