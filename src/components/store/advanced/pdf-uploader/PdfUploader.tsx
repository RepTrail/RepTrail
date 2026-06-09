'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'

import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { User } from 'lucide-react';


import { PdfUploaderProps } from './lib/types';
import { usePdfSelectionState } from './hooks/usePdfSelectionState';
import { usePdfStudentBinding } from './hooks/usePdfStudentBinding';
import { usePdfUpload } from './hooks/usePdfUpload';
import { usePdfSaveFlow } from './hooks/usePdfSaveFlow';

import { PdfDropzone } from './components/PdfDropzone';
import { StudentBindingCard } from './components/StudentBindingCard';
import { PdfPreviewSection } from './components/PdfPreviewSection';
import { PdfActionsFooter } from './components/PdfActionsFooter';

export function PdfUploader({ type, students = [], role = 'trainer', userId, studentId: initialStudentId }: PdfUploaderProps) {
    const selectionHooks = usePdfSelectionState();
    const bindingHooks = usePdfStudentBinding(initialStudentId);

    const { uploading, parsing, parsedData, setParsedData, handleFileChange } = usePdfUpload({
        type, role, bindingHooks, selectionHooks
    });

    const currentType = parsedData?.type || type;

    const { handleSave, isSaving } = usePdfSaveFlow({
        type: currentType, userId, role, initialStudentId, parsedData, setParsedData, selectionHooks, bindingHooks
    });

    return (
        <Stack id="tour-import-card" fullWidth flex1 gap={STORE_TOKENS.SPACING.SECTION}>
            {!parsedData ? (
                <PdfDropzone 
                    uploading={uploading} 
                    parsing={parsing} 
                    onFileChange={handleFileChange} 
                />
            ) : (
                <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                    
                    {role === 'trainer' && (
                        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={User} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Destinatário da Importação"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Vincule a importação a um aluno existente ou crie um novo perfil de aluno."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                            <StudentBindingCard 
                                bindingHooks={bindingHooks}
                                students={students}
                            />
                          </Stack>
        </Stack>
                    )}

                    <Stack id="tour-review-section" gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                        <PdfPreviewSection 
                            type={currentType}
                            parsedData={parsedData}
                            setParsedData={setParsedData}
                            selectionHooks={selectionHooks}
                        />

                        <PdfActionsFooter 
                            type={currentType}
                            role={role}
                            isSaving={isSaving}
                            bindingHooks={bindingHooks}
                            setParsedData={setParsedData}
                            onSave={handleSave}
                        />
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
}
