import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Separator } from '@/components/store/base/separator';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { Check, Sparkles } from 'lucide-react';

export function PdfFeatureBadges() {
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            <Separator opacity={5} />
            <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} wrap="wrap">
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Icon icon={Sparkles} size="xs" color="zinc-600" />
                    <Font
                        {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                        {...{
                            color: "zinc-600",
                        }}>AI Powered Extraction</Font>
                </Stack>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Icon icon={Check} size="xs" color="zinc-600" />
                    <Font
                        {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                        {...{
                            color: "zinc-600",
                        }}>Auto Structured JSON</Font>
                </Stack>
            </Stack>
        </Stack>
    );
}
