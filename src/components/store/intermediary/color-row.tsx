'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'

interface ColorRowProps {
    name: string
    token: string
    color: string
}

export function ColorRow({ name, token, color }: ColorRowProps) {
    return (
        <Box padding={5} bg="zinc-950/40" border="white/10" rounded="system">
            <Stack direction="row" align="center" gap={5}>
                <Box bg={color as any} rounded="sm" padding={5} border="white/10" shrink0 />
                <Stack gap={0} flex1>
                    <Font variant="body" weight="black" uppercase italic>{name}</Font>
                    <Font variant="sub-tiny" color="zinc-600">{token}</Font>
                </Stack>
            </Stack>
        </Box>
    )
}
