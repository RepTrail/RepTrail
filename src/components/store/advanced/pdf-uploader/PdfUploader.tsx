'use client'

import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { User } from 'lucide-react';
import { RegistrySection } from '@/components/store/advanced/registry-section';

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
        <Stack id="tour-import-card" fullWidth gap="section">
            {!parsedData ? (
                <PdfDropzone 
                    uploading={uploading} 
                    parsing={parsing} 
                    onFileChange={handleFileChange} 
                />
            ) : (
                <Stack gap="section" fullWidth>
                    
                    {role === 'trainer' && (
                        <RegistrySection 
                            title="Destinatário da Importação" 
                            subtitle="Vincule a importação a um aluno existente ou crie um novo perfil de aluno."
                            icon={User}
                        >
                            <StudentBindingCard 
                                bindingHooks={bindingHooks}
                                students={students}
                            />
                        </RegistrySection>
                    )}

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
            )}

        </Stack>
    );
}
