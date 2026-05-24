import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Surface } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { useRegistry, RegistryColor } from '@/components/store/advanced/registry-context';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AssignmentFeedbackCardProps {
    bindingHooks: any;
    students: any[];
}

const PULSE_DOT: Record<RegistryColor, string> = {
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    zinc: 'bg-zinc-500',
}

export function AssignmentFeedbackCard({ bindingHooks, students }: AssignmentFeedbackCardProps) {
    const { primaryColor } = useRegistry()
    const { selectedStudentId, bindingMode, detectedStudentName, studentMatch, placeholderName } = bindingHooks;
    const isActive = !!(selectedStudentId || bindingMode === 'create')

    return (
        <Surface variant="tonal-primary" padding={STORE_TOKENS.PADDING.CONTAINER} animation="in-fade-zoom">
            <Stack direction="row" justify="between" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Surface
                        variant={isActive ? 'tonal-primary' : 'raised'}
                        padding={STORE_TOKENS.PADDING.CONTAINER}
                    >
                        <Icon icon={User} size="md" color={isActive ? 'primary' : 'zinc-500'} />
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
                {isActive && (
                    <Surface variant="tonal-primary" padding={STORE_TOKENS.PADDING.ELEMENT}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <div className={cn('w-2 h-2 rounded-full animate-pulse', PULSE_DOT[primaryColor])} />
                            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color="primary">Vinculação Ativa</Font>
                        </Stack>
                    </Surface>
                )}
            </Stack>
        </Surface>
    );
}
