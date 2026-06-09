 
import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Box } from '@/components/store/base/box';
import { Button as DSButton } from '@/components/store/base/button';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { useRegistry, RegistryColor } from '@/components/store/advanced/registry-context';
import { User } from 'lucide-react';

const ACTIVE_GLOW: Record<RegistryColor, string> = {
    orange: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]',
    emerald: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    blue: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    red: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    amber: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    zinc: 'shadow-[0_0_20px_rgba(113,113,122,0.15)]',
}

const ACTIVE_BORDER: Record<RegistryColor, string> = {
    orange: 'border-orange-500',
    emerald: 'border-emerald-500',
    blue: 'border-blue-500',
    red: 'border-red-500',
    amber: 'border-amber-500',
    zinc: 'border-zinc-500',
}

const SUGGESTION_FOCUS: Record<RegistryColor, string> = {
    orange: 'focus:bg-orange-500/10 focus:text-orange-400',
    emerald: 'focus:bg-emerald-500/10 focus:text-emerald-400',
    blue: 'focus:bg-blue-500/10 focus:text-blue-400',
    red: 'focus:bg-red-500/10 focus:text-red-400',
    amber: 'focus:bg-amber-500/10 focus:text-amber-400',
    zinc: 'focus:bg-zinc-500/10 focus:text-zinc-400',
}
import { FormSelect } from '@/components/store/base/form-select';
import { StudentCreateForm } from './StudentCreateForm';
import { UploaderStatusCard } from './UploaderStatusCard';

interface StudentBindingCardProps {
    bindingHooks: any;
    students: any[];
}

export function StudentBindingCard({ bindingHooks, students }: StudentBindingCardProps) {
    const { primaryColor } = useRegistry()
    const {
        selectedStudentId, setSelectedStudentId,
        bindingMode, setBindingMode,
        detectedStudentName, studentMatch,
        placeholderName, setPlaceholderName,
        placeholderEmail, setPlaceholderEmail,
        placeholderWhatsapp, setPlaceholderWhatsapp
    } = bindingHooks;

    const studentOptions = [
        ...(studentMatch?.suggestions?.filter((s: any) => s.active !== false).map((s: any) => ({
            label: `${s.full_name} (Sugerido)`,
            value: s.student_id
        })) || []),
        ...students.filter(s => s.active && !studentMatch?.suggestions?.find((ms: any) => ms.student_id === s.student_id)).map(s => ({
            label: s.student?.[0]?.full_name || s.student?.full_name || 'Sem nome',
            value: s.student_id
        }))
    ]

    const hasSelection = !!(selectedStudentId || (studentMatch?.exact && bindingMode === 'matched'));

    if (hasSelection) {
        const studentName = selectedStudentId
            ? (students.find((s: any) => s.student_id === selectedStudentId)?.student?.[0]?.full_name ||
                students.find((s: any) => s.student_id === selectedStudentId)?.student?.full_name ||
                studentMatch?.exact?.full_name || 'Aluno Selecionado')
            : (bindingMode === 'create' ? (placeholderName || detectedStudentName || 'Novo Aluno') : 'Somente Biblioteca');

        return (
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                <UploaderStatusCard
                    icon={User}
                    label="Destinatário Vinculado"
                    value={studentName}
                    isActive={true}
                    rightElement={
                        <DSButton
                            variant="outline-zinc"
                            size="xs"
                            onClick={() => {
                                setBindingMode('skip');
                                setSelectedStudentId('');
                            }}
                        >
                            Alterar
                        </DSButton>
                    }
                />
            </Stack>
        );
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>

            <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.CONTAINER} align={{ base: 'stretch', md: 'center' }} justify="between" fullWidth>
                <DSButton
                    id="tour-btn-create-student"
                    type="button"
                    variant={bindingMode === 'create' ? 'primary' : 'outline-zinc'}
                    size="md"
                    flex1={true}
                    onClick={() => {
                        setBindingMode('create');
                        setSelectedStudentId(null);
                        if (detectedStudentName && !placeholderName) setPlaceholderName(detectedStudentName);
                    }}
                    {...{
                        height: "12",
                    }}>
                    Criar Novo Aluno
                </DSButton>

                <DSButton
                    type="button"
                    variant={bindingMode === 'skip' ? 'primary' : 'outline-zinc'}
                    size="md"
                    flex1={true}
                    onClick={() => { setBindingMode('skip'); setSelectedStudentId(''); }}
                    {...{
                        height: "12",
                    }}>
                    Não Vincular
                </DSButton>

                <Box flex1={true} minWidth={200}>
                    <FormSelect
                        options={studentOptions}
                        value={selectedStudentId || ''}
                        placeholder="Escolher Existente..."
                        onChange={(val) => {
                            setSelectedStudentId(val);
                            setBindingMode('matched');
                        }}
                    />
                </Box>
            </Stack>
            {bindingMode === 'create' && (
                <StudentCreateForm
                    placeholderName={placeholderName}
                    setPlaceholderName={setPlaceholderName}
                    placeholderEmail={placeholderEmail}
                    setPlaceholderEmail={setPlaceholderEmail}
                    placeholderWhatsapp={placeholderWhatsapp}
                    setPlaceholderWhatsapp={setPlaceholderWhatsapp}
                />
            )}
        </Stack>
    );
}
