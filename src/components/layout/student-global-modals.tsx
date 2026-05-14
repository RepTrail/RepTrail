'use client'

import { SettingsModal } from '@/components/store/advanced/student-settings-modal'
import { NotificationRequestModal } from '@/components/store/features(deprecated)/notification-request-modal'

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

