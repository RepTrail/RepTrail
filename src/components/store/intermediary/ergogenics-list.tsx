'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { CheckIndicator } from '@/components/store/base/check-indicator'
import { Zap, FlaskConical } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from './empty-state'

interface ErgogenicItem {
    id: string
    name: string
    dosage: string
    isCompleted: boolean
}

interface ErgogenicsListProps {
    items: ErgogenicItem[]
    status?: 'active' | 'empty'
    onToggle?: (id: string, currentStatus: boolean) => void
}

/**
 * ErgogenicsList: Simple list for daily management visualization.
 * Now supports real toggle functionality.
 */
export function ErgogenicsList({ items, status = 'active', onToggle }: ErgogenicsListProps) {
    if (status === 'empty') {
        return (
            <EmptyState
                icon={FlaskConical}
                title="SEM ERGOGÊNICOS"
                description="NENHUM PROTOCOLO DE SUBSTÂNCIAS ATIVO PARA HOJE."
            />
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            {items.map((item) => (
                <GlassPanel
                    key={item.id}
                    padding={STORE_TOKENS.PADDING.ELEMENT}
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    variant="glass"
                    transition
                    cursor="pointer"
                    onClick={() => onToggle?.(item.id, item.isCompleted)}
                >
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <CheckIndicator checked={item.isCompleted} />
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                            <Stack direction="row" align="center" justify="between">
                                <Font
                                    {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                                    variant="body-sm"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                    }}>
                                    {item.name}
                                </Font>
                                <Badge
                                    label={item.dosage}
                                    icon={Zap}
                                    variant="glass"
                                    color={STORE_TOKENS.COLORS.WARNING}
                                    size="xs"
                                />
                            </Stack>
                            <Font
                                {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>
                                DOSAGEM DIÁRIA RECOMENDADA
                            </Font>
                        </Stack>
                    </Stack>
                </GlassPanel>
            ))}
        </Stack>
    );
}
