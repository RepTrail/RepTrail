'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Box } from '@/components/store/base/box';
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

export function PdfUploader({ type, students = [], role = 'trainer', userId, studentId: initialStudentId, locked = false, importLimit = null, importsUsed = 0 }: PdfUploaderProps & { locked?: boolean, importLimit?: number | null, importsUsed?: number }) {
    const selectionHooks = usePdfSelectionState();
    const bindingHooks = usePdfStudentBinding(initialStudentId);

    const isLimitReached = importLimit !== null && importsUsed >= importLimit;

    const { uploading, parsing, parsedData, setParsedData, handleFileChange: originalHandleFileChange } = usePdfUpload({
        type, role, bindingHooks, selectionHooks
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (locked || isLimitReached) return;
        originalHandleFileChange(e);
    };

    const currentType = parsedData?.type || type;

    const { handleSave, isSaving } = usePdfSaveFlow({
        type: currentType, userId, role, initialStudentId, parsedData, setParsedData, selectionHooks, bindingHooks
    });

    return (
        <Stack id="tour-import-card" fullWidth flex1 gap={STORE_TOKENS.SPACING.SECTION}>
            {!parsedData ? (
                <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                    {importLimit !== null && (
                        <Box padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border borderColor={isLimitReached ? "red" : STORE_TOKENS.COLORS.DIVIDER.SUBTLE} bg={isLimitReached ? "red" : "white"} bgOpacity={5}>
                            <Stack direction="row" align="center" justify="between">
                                <Font variant="body-sm" color={isLimitReached ? "red" : "zinc-400"}>
                                    {isLimitReached ? "Limite Mensal Atingido!" : "Cota Mensal de Importações (IA)"}
                                </Font>
                                <Font variant="body-sm" weight="bold" color={isLimitReached ? "red" : "zinc-500"}>
                                    {importsUsed} / {importLimit}
                                </Font>
                            </Stack>
                            <Box width="100%" height="4px" rounded="full" bg="white" bgOpacity={5}>
                                <Box width={`${Math.min(100, (importsUsed / importLimit) * 100)}%`} height="100%" rounded="full" bg={isLimitReached ? "red" : STORE_TOKENS.COLORS.BRAND} />
                            </Box>
                        </Box>
                    )}
                    <PdfDropzone
                        uploading={uploading}
                        parsing={parsing}
                        onFileChange={handleFileChange}
                        locked={locked || isLimitReached}
                    />
                </Stack>
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
