'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { CheckIndicator } from '@/components/store/base/check-indicator'
import { Zap } from 'lucide-react'

interface ErgogenicItem {
    name: string
    dosage: string
}

interface ErgogenicsListProps {
    items: ErgogenicItem[]
}

/**
 * ErgogenicsList: Refactored to use CheckIndicator base component.
 */
export function ErgogenicsList({ items }: ErgogenicsListProps) {
    return (
        <Stack gap={2.5}>
            {items.map((item, idx) => (
                <GlassPanel 
                    key={item.name} 
                    padding={5} 
                    rounded="system" 
                    variant="glass"
                    transition
                    hoverBgOpacity={10}
                    cursor="pointer"
                >
                    <Stack direction="row" align="center" gap={5}>
                        <CheckIndicator checked={idx < 2} />
                        <Stack gap={1} flex1>
                            <Stack direction="row" align="center" justify="between">
                                <Font variant="body-sm" color="white" weight="black" uppercase italic tracking="widest">
                                    {item.name}
                                </Font>
                                <Badge 
                                    label={item.dosage} 
                                    icon={Zap} 
                                    variant="glass" 
                                    color="amber" 
                                    size="xs" 
                                />
                            </Stack>
                            <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase>
                                DOSAGEM DIÁRIA RECOMENDADA
                            </Font>
                        </Stack>
                    </Stack>
                </GlassPanel>
            ))}
        </Stack>
    )
}
