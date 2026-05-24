 
import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Surface } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { Button as DSButton } from '@/components/store/base/button';
import { Separator } from '@/components/store/base/separator';
import { Badge } from '@/components/store/base/badge';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { useRegistry, RegistryColor } from '@/components/store/advanced/registry-context';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StudentCreateForm } from './StudentCreateForm';

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

    return (
        <Surface variant="raised" padding={STORE_TOKENS.PADDING.CONTAINER}>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" align="center" justify="between" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={User} size="xs" color="primary" />
                        <Font variant="body" weight="bold" color="white">Vincular Importação:</Font>
                        {detectedStudentName && (
                            <Badge label={`Detectado: ${detectedStudentName}`} variant="outline" color="zinc" />
                        )}
                    </Stack>
                    {(studentMatch?.exact || (selectedStudentId && bindingMode === 'matched')) && (
                        <Badge label="Aluno Vinculado" variant="glass" color="primary" />
                    )}
                </Stack>

                {studentMatch?.exact && bindingMode === 'matched' ? (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Font variant="description" color="zinc-400">
                            Identificamos o aluno <Font variant="description" color="primary" weight="bold">{studentMatch.exact.full_name}</Font> automaticamente.
                        </Font>
                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <DSButton
                                variant="outline-zinc"
                                size="sm"
                                onClick={() => {
                                    setBindingMode('skip');
                                    setSelectedStudentId(null);
                                }}
                            >
                                Alterar Vínculo
                            </DSButton>
                        </Stack>
                    </Stack>
                ) : (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Separator opacity={5} />
                        
                        <Font variant="auxiliary" weight="black" uppercase color="zinc-500" tracking="widest">
                            {detectedStudentName ? "Como deseja processar esta importação?" : "Quem deve receber este treino/dieta?"}
                        </Font>

                        <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} className="w-full flex-wrap md:flex-nowrap min-h-0">
                            <DSButton
                                id="tour-btn-create-student"
                                type="button"
                                variant={bindingMode === 'create' ? 'outline-primary' : 'ghost'}
                                className={cn(
                                    "flex-1 !h-[56px] transition-all duration-300 min-h-0",
                                    bindingMode === 'create' && cn(ACTIVE_GLOW[primaryColor], 'scale-[1.02]')
                                )}
                                onClick={() => {
                                    setBindingMode('create');
                                    setSelectedStudentId(null);
                                    if (detectedStudentName && !placeholderName) setPlaceholderName(detectedStudentName);
                                }}
                            >
                                Criar Novo Aluno
                            </DSButton>

                            <div className="flex-1 min-w-[200px] min-h-0">
                                <Select value={selectedStudentId || undefined} onValueChange={(val) => { setSelectedStudentId(val); setBindingMode('matched'); }}>
                                    <SelectTrigger
                                        className={cn(
                                            "w-full rounded-system !h-[56px] bg-zinc-950/40 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 px-6 flex items-center justify-between min-h-0",
                                            bindingMode === 'matched'
                                                ? cn(ACTIVE_BORDER[primaryColor], 'text-white', ACTIVE_GLOW[primaryColor], 'scale-[1.02]')
                                                : "border-white/5 text-zinc-500 hover:border-white/10"
                                        )}
                                    >
                                        <SelectValue placeholder="Escolher Existente" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" sideOffset={12} className="bg-zinc-900 border-2 border-white/5 text-white w-[var(--radix-select-trigger-width)] z-[100] rounded-system shadow-2xl p-2 overflow-hidden">
                                        <div className="px-2 py-3 text-[8px] font-black uppercase tracking-widest text-zinc-600 border-b border-white/5 mb-2">Sugestões e Lista de Alunos</div>
                                        {studentMatch?.suggestions?.filter((s: any) => s.active !== false).map((s: any) => (
                                            <SelectItem key={s.student_id} value={s.student_id} className={cn('text-xs py-4 rounded-system cursor-pointer', SUGGESTION_FOCUS[primaryColor])}>
                                                {s.full_name} (Sugerido)
                                            </SelectItem>
                                        ))}
                                        {students.filter(s => s.active && !studentMatch?.suggestions?.find((ms: any) => ms.student_id === s.student_id)).map(s => (
                                            <SelectItem key={s.student_id} value={s.student_id} className="text-xs py-4 rounded-system focus:bg-white/5 cursor-pointer">
                                                {s.student?.[0]?.full_name || s.student?.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <DSButton
                                type="button"
                                variant={bindingMode === 'skip' ? 'outline-zinc' : 'ghost'}
                                className={cn(
                                    "flex-1 !h-[56px] transition-all duration-300 min-h-0",
                                    bindingMode === 'skip' && "shadow-xl"
                                )}
                                onClick={() => { setBindingMode('skip'); setSelectedStudentId(''); }}
                            >
                                Não Vincular
                            </DSButton>
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
                )}
            </Stack>
        </Surface>
    );
}
