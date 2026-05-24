import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Separator } from '@/components/store/base/separator';
import { Icon } from '@/components/store/base/icon';
import { Button as DSButton } from '@/components/store/base/button';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { X, Check } from 'lucide-react';

interface PdfActionsFooterProps {
    type: 'workout' | 'diet';
    role: 'trainer' | 'student';
    isSaving: boolean;
    bindingHooks: any;
    setParsedData: (data: any) => void;
    onSave: () => void;
}

export function PdfActionsFooter({ type, role, isSaving, bindingHooks, setParsedData, onSave }: PdfActionsFooterProps) {
    const { placeholderName, placeholderEmail, detectedStudentName, bindingMode, setSelectedStudentId } = bindingHooks;
    
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            <Separator opacity={5} />
            <Stack direction="row" justify="end" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <DSButton
                    variant="ghost"
                    onClick={() => { setParsedData(null); setSelectedStudentId(''); }}
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                >
                    <Icon icon={X} size="xs" color="zinc-500" />
                    Cancelar
                </DSButton>
                <DSButton
                    id="tour-save-button"
                    variant="outline-primary"
                    onClick={onSave}
                    disabled={isSaving || (role === 'trainer' && bindingMode === 'create' && (!placeholderName || !placeholderEmail))}
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                    loading={isSaving}
                >
                    {!isSaving && <Icon icon={Check} size="xs" color="primary" />}
                    {bindingMode === 'create'
                        ? `Salvar e Vincular a ${placeholderName || detectedStudentName || 'Novo Aluno'}`
                        : `Salvar ${type === 'workout' ? 'Treino' : 'Dieta'}`
                    }
                </DSButton>
            </Stack>
        </Stack>
    );
}
