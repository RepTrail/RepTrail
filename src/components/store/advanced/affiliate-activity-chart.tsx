'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'

interface AffiliateActivityChartProps {
    clickDays: [string, number][]
    maxClicks: number
}

/**
 * AffiliateActivityChart: Advanced component for rendering traffic analytics.
 * Replaces inline chart logic in stats sections.
 */
export function AffiliateActivityChart({ clickDays, maxClicks }: AffiliateActivityChartProps) {
    return (
        <Surface variant="base" padding={5} rounded="system" border="subtle">
            <Stack gap={5}>
                <Box className="h-64" width="full" display="flex" align="end" gap={1}>
                    {clickDays.map(([date, count], i) => (
                        <Box 
                            key={date} 
                            flex1 
                            display="flex" 
                            direction="col" 
                            align="center" 
                            gap={2.5} 
                            height="full" 
                            justify="end" 
                            className="group relative"
                        >
                            {/* Tooltip built with system props where possible, 
                                keeping absolute div for specific hover behavior */}
                            <div className="absolute bottom-full mb-2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-bold border border-white/5">
                                {new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}: {count} clicks
                            </div>

                            <Box
                                fullWidth
                                bg="primary"
                                opacity={80}
                                hoverBgOpacity={100}
                                rounded="system"
                                transition
                                style={{
                                    height: `${(count / maxClicks) * 100}%`,
                                    minHeight: count > 0 ? '4px' : '1px'
                                }}
                            />

                            {i % 5 === 0 && (
                                <Box className="absolute -bottom-6">
                                    <Font variant="sub-tiny" color="zinc-600" weight="black">
                                        {new Date(date).getDate()}
                                    </Font>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
                <Box paddingTop={2.5} display="flex" justify="center">
                    <Font variant="sub-tiny" color="zinc-600" italic>Eixo horizontal representa os dias do mês</Font>
                </Box>
            </Stack>
        </Surface>
    )
}
