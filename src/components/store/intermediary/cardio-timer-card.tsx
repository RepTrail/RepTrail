'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Grid } from '@/components/store/base/grid'
import { Badge } from '@/components/store/base/badge'
import { GlassPanel } from '@/components/store/base/surface'
import { Activity, Play, Timer, Zap } from 'lucide-react'

interface CardioTimerCardProps {
    title: string
    duration: string
    intensity: string
    remainingTime: string
    estimatedBurn: string
}

/**
 * CardioTimerCard: Refactored to normal GlassPanel.
 * - All containers (main and sub-cards) now use GlassPanel variant="glass".
 */
export function CardioTimerCard({
    title,
    duration,
    intensity,
    remainingTime,
    estimatedBurn
}: CardioTimerCardProps) {
    return (
        <GlassPanel 
            padding={0} 
            rounded="system" 
            overflow="hidden"
            variant="glass"
        >
            <Box padding={5}>
                <Stack gap={5} align="center">
                    <Stack direction="row" align="center" justify="between" fullWidth>
                        <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={Activity} color="orange" size="sm" />
                            <Font variant="h4" color="white">
                                {title}
                            </Font>
                        </Stack>

                        <Stack direction="row" gap={2.5}>
                            <Badge 
                                label={duration} 
                                icon={Timer} 
                                variant="glass" 
                                color="zinc" 
                                size="xs" 
                            />
                            <Badge 
                                label={intensity} 
                                icon={Zap} 
                                variant="glass" 
                                color="amber" 
                                size="xs" 
                            />
                        </Stack>
                    </Stack>

                    <Stack gap={5} align="center">
                        <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase tracking="widest">
                            TEMPO RESTANTE
                        </Font>
                        <Font variant="h1" color="white" weight="black" italic align="center">
                            {remainingTime}
                        </Font>
                    </Stack>

                    <Box 
                        width="24" 
                        height="24" 
                        rounded="full" 
                        bg="white" 
                        display="flex" 
                        align="center" 
                        justify="center" 
                        cursor="pointer" 
                        hoverScale={105} 
                        activeScale={95}
                        shrink={0}
                        group
                    >
                        <Icon icon={Play} size="lg" color="black" />
                    </Box>

                    <Grid cols={2} gap={5} fullWidth>
                        <GlassPanel padding={5} rounded="system" variant="glass" display="flex" direction="col" align="center" gap={1}>
                            <Font variant="sub-tiny" color="orange" weight="black" uppercase opacity={80}>QUEIMA EST.</Font>
                            <Font variant="h3" color="white" weight="black" italic uppercase>
                                ~{estimatedBurn} KCAL
                            </Font>
                        </GlassPanel>
                        <GlassPanel padding={5} rounded="system" variant="glass" display="flex" direction="col" align="center" gap={1}>
                            <Font variant="sub-tiny" color="orange" weight="black" uppercase opacity={80}>INTENSIDADE</Font>
                            <Font variant="h3" color="white" weight="black" italic uppercase>
                                {intensity}
                            </Font>
                        </GlassPanel>
                    </Grid>
                </Stack>
            </Box>
        </GlassPanel>
    )
}
