'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { GlassPanel } from '@/components/store/base/surface'
import { SegmentedSwitch } from '@/components/store/intermediary/segmented-switch'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { PdfUploader } from '@/components/store/advanced/pdf-uploader/PdfUploader'
import { Activity, Utensils } from 'lucide-react'

interface ImportPdfSectionContentProps {
    userId: string
    role?: 'trainer' | 'student'
    students?: any[]
}

const TAB_OPTIONS = [
    {
        id: 'workout',
        label: 'Treino',
        icon: Activity,
        activeVariant: 'outline-orange' as const,
    },
    {
        id: 'diet',
        label: 'Dieta',
        icon: Utensils,
        activeVariant: 'outline-orange' as const,
    },
]

/**
 * ImportPdfSectionContent
 * DS-compliant section for the PDF import flow.
 * Orchestrates the tab switcher and delegates rendering
 * to the legacy PdfUploader (backend preserved 100%).
 */
export function ImportPdfSectionContent({
    userId,
    role = 'student',
    students,
}: ImportPdfSectionContentProps) {
    const [activeTab, setActiveTab] = useState<'workout' | 'diet'>('workout')

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
            {/* ── Tab Switcher ─────────────────────────────────────── */}
            <Box fullWidth>
                <SegmentedSwitch
                    options={TAB_OPTIONS}
                    activeId={activeTab}
                    onSelect={(id) => setActiveTab(id as 'workout' | 'diet')}
                />
            </Box>

            {/* ── Liquid Glass Container ───────────────────────────── */}
            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth>
                {/* Backend logic fully delegated to PdfUploader — zero modification */}
                <PdfUploader
                    key={activeTab}
                    type={activeTab}
                    students={students}
                    role={role}
                    userId={userId}
                />
            </GlassPanel>
        </Stack>
    )
}
