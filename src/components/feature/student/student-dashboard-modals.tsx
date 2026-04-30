'use client'

import { useState, useEffect } from 'react'
import { AutoTrainingOnboardingModal } from '@/components/feature/student/auto-training-onboarding-modal'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

interface StudentDashboardModalProps {
    userId: string
    showModal: boolean
    hasTrainer: boolean
}

export function StudentDashboardModals({ userId, showModal, hasTrainer }: StudentDashboardModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isImpersonating, setIsImpersonating] = useState(false)

    useEffect(() => {
        if (showModal && !hasTrainer) {
            setIsModalOpen(true)
        }

        // Check impersonation status
        const cookies = document.cookie.split('; ')
        const imp = cookies.find(c => c.startsWith('rt_impersonating='))?.split('=')[1]
        setIsImpersonating(imp === 'true')
    }, [showModal, hasTrainer])

    useEffect(() => {
        const handleOpen = () => setIsModalOpen(true)
        window.addEventListener('open-auto-training-onboarding', handleOpen)
        return () => window.removeEventListener('open-auto-training-onboarding', handleOpen)
    }, [])

    const { mutate: acceptMutate } = useOptimisticMutation({
        actionName: 'enable-auto-training-trial',
        entity: ENTITIES.USER,
        entityId: userId,
        queryKey: QUERY_KEYS.student.all(userId),
        mutationFn: async () => {
             const { enableAutoTrainingTrialForCurrentUser } = await import('@/actions/auto-training-actions')
             return await enableAutoTrainingTrialForCurrentUser()
        },
        onMutate: () => setIsModalOpen(false)
    })

    const { mutate: rejectMutate } = useOptimisticMutation({
        actionName: 'dismiss-auto-training',
        entity: ENTITIES.USER,
        entityId: userId,
        queryKey: QUERY_KEYS.student.all(userId),
        mutationFn: async () => {
             const { dismissAutoTrainingForSession } = await import('@/actions/auto-training-actions')
             return await dismissAutoTrainingForSession(userId)
        },
        onMutate: () => setIsModalOpen(false)
    })

    const handleAccept = async () => acceptMutate(undefined)
    const handleReject = async () => rejectMutate(undefined)
    const handleClose = () => setIsModalOpen(false)

    return (
        <AutoTrainingOnboardingModal
            isOpen={isModalOpen && !isImpersonating}
            onAccept={handleAccept}
            onReject={handleReject}
            onClose={handleClose}
        />
    )
}
