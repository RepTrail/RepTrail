 
'use client'

import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { PdfUploaderProps } from './lib/types';
import { usePdfSelectionState } from './hooks/usePdfSelectionState';
import { usePdfStudentBinding } from './hooks/usePdfStudentBinding';
import { usePdfUpload } from './hooks/usePdfUpload';
import { usePdfSaveFlow } from './hooks/usePdfSaveFlow';

import { PdfDropzone } from './components/PdfDropzone';
import { PdfParsedStatus } from './components/PdfParsedStatus';
import { StudentBindingCard } from './components/StudentBindingCard';
import { AssignmentFeedbackCard } from './components/AssignmentFeedbackCard';
import { PdfPreviewSection } from './components/PdfPreviewSection';
import { PdfActionsFooter } from './components/PdfActionsFooter';
import { PdfFeatureBadges } from './components/PdfFeatureBadges';

export function PdfUploader({ type, students = [], role = 'trainer', userId, studentId: initialStudentId }: PdfUploaderProps) {
    const selectionHooks = usePdfSelectionState();
    const bindingHooks = usePdfStudentBinding(initialStudentId);

    const { uploading, parsing, parsedData, setParsedData, handleFileChange } = usePdfUpload({
        type, role, bindingHooks, selectionHooks
    });

    const { handleSave, isSaving } = usePdfSaveFlow({
        type, userId, role, initialStudentId, parsedData, setParsedData, selectionHooks, bindingHooks
    });

    return (
        <Stack id="tour-import-card" fullWidth gap={STORE_TOKENS.SPACING.CONTAINER}>
            {!parsedData ? (
                <PdfDropzone 
                    uploading={uploading} 
                    parsing={parsing} 
                    onFileChange={handleFileChange} 
                />
            ) : (
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} className="animate-pulse">
                    <PdfParsedStatus />
                    
                    {role === 'trainer' && (
                        <StudentBindingCard 
                            bindingHooks={bindingHooks}
                            students={students}
                        />
                    )}

                    {role === 'trainer' && (
                        <AssignmentFeedbackCard 
                            bindingHooks={bindingHooks}
                            students={students}
                        />
                    )}

                    <PdfPreviewSection 
                        type={type}
                        parsedData={parsedData}
                        setParsedData={setParsedData}
                        selectionHooks={selectionHooks}
                    />

                    <PdfActionsFooter 
                        type={type}
                        role={role}
                        isSaving={isSaving}
                        bindingHooks={bindingHooks}
                        setParsedData={setParsedData}
                        onSave={handleSave}
                    />
                </Stack>
            )}
            
            <PdfFeatureBadges />
        </Stack>
    );
}
