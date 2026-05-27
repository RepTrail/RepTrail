import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Stack } from '@/components/store/base/stack';
import { GlassPanel } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

interface UploaderStatusCardProps {
    id?: string;
    icon: LucideIcon;
    label: string;
    value: string;
    isActive?: boolean;
    rightElement?: ReactNode;
}

export function UploaderStatusCard({ id, icon, label, value, isActive = true, rightElement }: UploaderStatusCardProps) {
    return (
        <GlassPanel id={id} padding={{ base: STORE_TOKENS.PADDING.ELEMENT, md: STORE_TOKENS.PADDING.CONTAINER }} animation="in-fade-zoom">
            <Stack direction="row" justify="between" align="center" gap={{ base: STORE_TOKENS.SPACING.ELEMENT, md: STORE_TOKENS.SPACING.CONTAINER }}>
                <Stack direction="row" align="center" gap={{ base: STORE_TOKENS.SPACING.ELEMENT, md: STORE_TOKENS.SPACING.CONTAINER }}>
                    <GlassPanel padding={STORE_TOKENS.PADDING.ELEMENT}>
                        <Icon icon={icon} size="md" color={isActive ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.TEXT.MUTED} />
                    </GlassPanel>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                            {...{
                                color: isActive ? 'primary' : 'zinc-500',
                            }}>
                            {label}
                        </Font>
                        <Font
                            variant="heading"
                            weight="black"
                            uppercase
                            italic
                            {...{
                                color: "white",
                            }}>
                            {value}
                        </Font>
                    </Stack>
                </Stack>
                {rightElement}
            </Stack>
        </GlassPanel>
    );
}
