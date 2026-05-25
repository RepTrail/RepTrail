'use client'

import React from 'react'
import { PdfUploader } from '@/components/store/advanced/pdf-uploader/PdfUploader'

interface ImportPdfSectionContentProps {
    userId: string
    role?: 'trainer' | 'student'
    students?: any[]
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
}: ImportPdfSectionContentProps) {
    return (
        <PdfUploader
            type="workout"
            students={students}
            role={role}
            userId={userId}
        />
    )
}

