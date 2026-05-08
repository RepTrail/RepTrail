'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Icon } from '../base/icon'
import { LucideIcon } from 'lucide-react'

interface IconBarProps {
    icons: LucideIcon[]
}

export function IconBar({ icons }: IconBarProps) {
    return (
        <Box bg="zinc-950/40" border="white/10" padding={5} rounded="system" overflow="auto" scrollbar="hidden">
            <Stack direction="row" align="center" gap={5}>
                {icons.map((icon, i) => (
                    <Box key={i} bg="zinc-900" border="white/5" padding={2.5} rounded="sm" display="flex" align="center" justify="center" shrink0>
                        <Icon icon={icon} size="sm" color="zinc-600" />
                    </Box>
                ))}
            </Stack>
        </Box>
    )
}
