'use client'

import { SettingsModal } from '@/components/feature/student/settings-modal'
import { NotificationRequestModal } from '@/components/feature/student/notification-request-modal'

interface StudentGlobalModalsProps {
    hasTrainer: boolean
}

export function StudentGlobalModals({ hasTrainer }: StudentGlobalModalsProps) {
    return (
        <>
            <SettingsModal hasTrainer={hasTrainer} />
            <NotificationRequestModal />
        </>
    )
}
