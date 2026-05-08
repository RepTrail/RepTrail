'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'

export function FinanceChart() {
    const data = [40, 65, 55, 85, 70, 95, 80]
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']

    return (
        <Box bg="zinc-950/40" padding={5} border="white/5" rounded="system">
            <Stack gap={5}>
                <Stack direction="row" align="center" justify="between">
                    <Stack gap={0}>
                        <Font variant="body" weight="black">Fluxo Semanal</Font>
                        <Font variant="sub-tiny" color="zinc-600">Comissões e Conversões</Font>
                    </Stack>
                    <Box bg="emerald/20" padding={2.5} rounded="full" display="flex" align="center" justify="center">
                        <Font variant="sub-tiny" color="emerald" weight="black" uppercase italic>+24% Crescimento</Font>
                    </Box>
                </Stack>

                <Box height="40" display="flex" align="end" justify="between" gap={2.5}>
                    {data.map((value, i) => (
                        <Stack key={i} flex1 align="center" gap={2.5} height="full" justify="end">
                            <Box 
                                width="full" 
                                height={value as any} 
                                bg={i === 5 ? 'orange' : 'white/10'} 
                                rounded="sm" 
                                transition="all"
                                hoverBg={i === 5 ? 'orange/20' : 'white/5'}
                                position="relative"
                                group
                            >
                                <Box 
                                    position="absolute" 
                                    top={0} 
                                    left={0} 
                                    bg="zinc-900" 
                                    padding={2.5} 
                                    rounded="sm" 
                                    opacity={0} 
                                    groupHoverOpacity={100} 
                                    transition="all"
                                    zIndex={10}
                                    display="flex"
                                    align="center"
                                    justify="center"
                                >
                                    <Font variant="sub-tiny" color="white" weight="black">{value}%</Font>
                                </Box>
                            </Box>
                            <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase>{days[i]}</Font>
                        </Stack>
                    ))}
                </Box>
            </Stack>
        </Box>
    )
}
