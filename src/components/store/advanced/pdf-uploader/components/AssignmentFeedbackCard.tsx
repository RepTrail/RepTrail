import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { GlassPanel } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Box } from '@/components/store/base/box';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { useRegistry, RegistryColor } from '@/components/store/advanced/registry-context';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { UploaderStatusCard } from './UploaderStatusCard';

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

    const studentName = selectedStudentId
        ? (students.find((s: any) => s.student_id === selectedStudentId)?.student?.[0]?.full_name ||
            students.find((s: any) => s.student_id === selectedStudentId)?.student?.full_name ||
            studentMatch?.exact?.full_name || 'Aluno Selecionado')
        : (bindingMode === 'create' ? (placeholderName || detectedStudentName || 'Novo Aluno') : 'Somente Biblioteca')

    return (
        <UploaderStatusCard
            icon={User}
            label="Destinatário da Importação"
            value={studentName}
            isActive={isActive}
            rightElement={isActive ? (
                <GlassPanel padding={STORE_TOKENS.PADDING.ELEMENT}>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Box />
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: "primary",
                            }}>Vinculação Ativa</Font>
                    </Stack>
                </GlassPanel>
            ) : null}
        />
    );
}

