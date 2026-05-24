'use client'

import React from 'react'
import { TrainerDashboardSidebarPanel } from '@/components/store/advanced/trainer-dashboard-sidebar-panel'

interface TrainerDashboardSidebarSectionContentProps {
    trainerCode?: string | null
    editProfileHref?: string
    publicProfileHref?: string
    showImportTeaser?: boolean
    importHref?: string
}

export function TrainerDashboardSidebarSectionContent({
    trainerCode,
    editProfileHref,
    publicProfileHref,
    showImportTeaser = true,
    importHref,
}: TrainerDashboardSidebarSectionContentProps) {
    return (
        <TrainerDashboardSidebarPanel
            trainerCode={trainerCode}
            editProfileHref={editProfileHref}
            publicProfileHref={publicProfileHref}
            showImportTeaser={showImportTeaser}
            importHref={importHref}
        />
    )
}