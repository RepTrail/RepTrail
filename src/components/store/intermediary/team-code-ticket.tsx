'use client'

import React from 'react'
import { GlassPanel } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface TeamCodeTicketProps {
    code?: string | null
}

export function TeamCodeTicket({ code }: TeamCodeTicketProps) {
    const resolvedCode = code?.trim().toUpperCase() || 'AGUARDE...'

    return (
        <GlassPanel
            border="dashed"
            padding={STORE_TOKENS.PADDING.EMPTY_STATE}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            fullWidth
        >
            <Stack align="center" justify="center">
                <Font
                    variant={{ base: 'h2', md: 'h1' }}
                    color={STORE_TOKENS.COLORS.TEXT.PRIMARY}
                    weight="black"
                    align="center"
                >
                    {resolvedCode}
                </Font>
            </Stack>
        </GlassPanel>
    )
}