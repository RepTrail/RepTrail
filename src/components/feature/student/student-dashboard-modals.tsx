'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AutoTrainingOnboardingModal } from '@/components/feature/student/auto-training-onboarding-modal'
import { dismissAutoTrainingForSession, resetAutoTrainingOnboardingModal, enableAutoTrainingTrialForCurrentUser } from '@/actions/auto-training-actions'

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
        await enableAutoTrainingTrialForCurrentUser()
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
