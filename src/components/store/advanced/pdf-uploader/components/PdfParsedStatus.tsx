import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Surface } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { Check } from 'lucide-react';

export function PdfParsedStatus() {
    return (
        <Surface id="tour-parsed-status" variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER}>
            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.ELEMENT}>
                    <Icon icon={Check} size="sm" color="emerald" />
                </Surface>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="label-caps" color="emerald">Leitura Concluída</Font>
                    <Font variant="description" color="emerald">Revise abaixo as informações extraídas pela nossa IA.</Font>
                </Stack>
            </Stack>
        </Surface>
    );
}
