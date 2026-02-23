'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AutoTrainingOnboardingModal } from '@/components/feature/student/auto-training-onboarding-modal'
import { disableAutoTrainingForStudent, markAutoTrainingOnboardingModalSeen } from '@/actions/auto-training-actions'

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

    const handleAccept = async () => {
        await markAutoTrainingOnboardingModalSeen(userId)
        setIsModalOpen(false)
        router.refresh()
    }

    const handleReject = async () => {
        await disableAutoTrainingForStudent(userId)
        setIsModalOpen(false)
        router.refresh()
    }

    return (
        <AutoTrainingOnboardingModal
            isOpen={isModalOpen}
            onAccept={handleAccept}
            onReject={handleReject}
        />
    )
}
