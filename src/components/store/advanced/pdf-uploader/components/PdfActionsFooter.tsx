import React from 'react';
import { Stack } from '@/components/store/base/stack';
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
            <Stack direction={{ base: 'col', md: 'row' }} justify="end" gap={{ base: STORE_TOKENS.SPACING.ELEMENT, md: STORE_TOKENS.SPACING.CONTAINER }} fullWidth>
                <DSButton
                    variant="outline-red"
                    onClick={() => { setParsedData(null); setSelectedStudentId(''); }}
                    fullWidth={{ base: true, md: false }}
                >
                    <Icon icon={X} size="xs" color={STORE_TOKENS.COLORS.ERROR} />
                    Cancelar
                </DSButton>
                <DSButton
                    id="tour-save-button"
                    variant="outline-emerald"
                    onClick={onSave}
                    disabled={isSaving || (role === 'trainer' && bindingMode === 'create' && (!placeholderName || !placeholderEmail))}
                    loading={isSaving}
                    fullWidth={{ base: true, md: false }}
                >
                    {!isSaving && <Icon icon={Check} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />}
                    {bindingMode === 'create'
                        ? `Salvar e Vincular`
                        : `Salvar ${type === 'workout' ? 'Treino' : 'Dieta'}`
                    }
                </DSButton>
            </Stack>
        </Stack>
    );
}
