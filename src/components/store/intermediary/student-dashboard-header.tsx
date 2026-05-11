'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'

interface StudentDashboardHeaderProps {
    title: string
    dateLabel?: string
    dateValue?: string
}

export function StudentDashboardHeader({ 
    title = "Resumo Hoje", 
    dateLabel = "Hoje",
    dateValue
}: StudentDashboardHeaderProps) {
    // Fallback date if not provided
    const displayDate = dateValue || new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

    return (
        <Stack direction={{ base: 'col', md: 'row' }} align={{ base: 'start', md: 'end' }} justify="between" gap="header-gap">
            <Font 
                variant="h1"
                weight="black" 
                color="white" 
                italic 
                uppercase 
                tracking="tighter"
                className="text-3xl lg:text-4xl leading-none"
            >
                {title}
            </Font>
            
            <Box padding={5} bg="zinc" bgOpacity={100} border rounded="system" className="bg-zinc-950 border-zinc-800">
                <Stack gap={1}>
                    <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase tracking="widest" display="block">
                        {dateLabel}
                    </Font>
                    <Font variant="description" color="white" weight="black" uppercase italic className="text-xs">
                        {displayDate}
                    </Font>
                </Stack>
            </Box>
        </Stack>
    )
}
