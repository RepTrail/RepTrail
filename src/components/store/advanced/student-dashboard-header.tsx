'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * StudentDashboardHeader: Advanced component for the student dashboard home greeting.
 * Displays the current date and "Resumo Hoje" title following Store governance.
 */
export function StudentDashboardHeader() {
    const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const [first, ...rest] = "RESUMO HOJE".split(' ')

    return (
        <Stack 
            direction={{ base: 'col', md: 'row' }} 
            align={{ base: 'start', md: 'end' }} 
            justify="between" 
            gap={STORE_TOKENS.SPACING.CONTAINER}
        >
            <Font variant="h1" weight="black" uppercase italic tracking="tight">
                {first} <Font
                variant="h1"
                weight="black"
                uppercase
                italic
                tracking="tight"
                {...{
                    color: STORE_TOKENS.COLORS.BRAND,
                }}>{rest.join(' ')}</Font>
            </Font>
            <Surface 
                variant="base" 
                padding={STORE_TOKENS.PADDING.ELEMENT} 
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
            >
                <Stack>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>
                        Hoje
                    </Font>
                    <Font variant="body-sm" weight="black" uppercase italic>
                        {tzNow.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                    </Font>
                </Stack>
            </Surface>
        </Stack>
    );
}
