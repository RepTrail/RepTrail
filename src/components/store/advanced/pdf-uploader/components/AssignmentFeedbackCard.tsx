import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Surface } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { User } from 'lucide-react';

interface AssignmentFeedbackCardProps {
    bindingHooks: any;
    students: any[];
}

export function AssignmentFeedbackCard({ bindingHooks, students }: AssignmentFeedbackCardProps) {
    const { selectedStudentId, bindingMode, detectedStudentName, studentMatch, placeholderName } = bindingHooks;

    return (
        <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} animation="in-fade-zoom">
            <Stack direction="row" justify="between" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Surface
                        variant={selectedStudentId || bindingMode === 'create' ? 'tonal-emerald' : 'raised'}
                        padding={STORE_TOKENS.PADDING.CONTAINER}
                    >
                        <Icon icon={User} size="md" color={selectedStudentId || bindingMode === 'create' ? 'emerald' : 'zinc-500'} />
                    </Surface>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color="zinc-500">Destinatário da Importação</Font>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="heading" weight="black" uppercase italic color="white">
                                {selectedStudentId
                                    ? (students.find((s: any) => s.student_id === selectedStudentId)?.student?.[0]?.full_name ||
                                        students.find((s: any) => s.student_id === selectedStudentId)?.student?.full_name ||
                                        studentMatch?.exact?.full_name || 'Aluno Selecionado')
                                    : (bindingMode === 'create' ? (placeholderName || detectedStudentName || 'Novo Aluno') : 'Somente Biblioteca')
                                }
                            </Font>
                        </Stack>
                    </Stack>
                </Stack>
                {(selectedStudentId || bindingMode === 'create') && (
                    <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.ELEMENT}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color="emerald">Vinculação Ativa</Font>
                        </Stack>
                    </Surface>
                )}
            </Stack>
        </Surface>
    );
}
