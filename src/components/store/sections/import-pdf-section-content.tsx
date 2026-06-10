'use client'

import React from 'react'
import { PdfUploader } from '@/components/store/advanced/pdf-uploader/PdfUploader'
import { PremiumLockOverlay } from '@/components/store/intermediary/premium-lock-overlay'

interface ImportPdfSectionContentProps {
    userId: string
    role?: 'trainer' | 'student'
    students?: any[]
    hasImportPdf?: boolean
    importLimit?: number | null
    importsUsed?: number
}

/**
 * ImportPdfSectionContent
 * DS-compliant section for the PDF import flow.
 * Delegates rendering directly to PdfUploader, which now
 * handles server-side AI auto-detection of Workout vs Diet.
 */
export function ImportPdfSectionContent({
    userId,
    role = 'student',
    students,
    hasImportPdf = true,
    importLimit = null,
    importsUsed = 0,
}: ImportPdfSectionContentProps) {
    return (
        <PremiumLockOverlay 
            variant="area" 
            locked={!hasImportPdf} 
            title="Importação via IA" 
            description="Seu plano não inclui inteligência artificial. Faça upgrade para importar arquivos PDF."
        >
            <PdfUploader
                type="workout"
                students={students}
                role={role}
                userId={userId}
                importLimit={importLimit}
                importsUsed={importsUsed}
            />
        </PremiumLockOverlay>
    )
}

