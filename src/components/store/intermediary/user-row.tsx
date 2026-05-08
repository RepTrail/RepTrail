'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { BaseAvatar } from '../base/avatar'

interface UserRowProps {
    initials: string
    name: string
    sub: string
    tags: React.ReactNode | string[]
    actions: React.ReactNode
}

export function UserRow({ initials, name, sub, tags, actions }: UserRowProps) {
    return (
        <Box 
            padding={5} 
            border="white/5" 
            hoverBg="white/5" 
            transition="all"
        >
            <Stack direction="row" align="center" justify="between" gap={5}>
                <Stack direction="row" align="center" gap={5}>
                    <BaseAvatar initials={initials} />
                    <Stack gap={0}>
                        <Font weight="bold">{name}</Font>
                        <Font variant="sub-tiny" color="zinc-500">{sub}</Font>
                    </Stack>
                    <Stack direction="row" gap={2.5} display="md-flex" align="center">
                        {Array.isArray(tags) ? tags.map((tag, idx) => (
                            <Box key={idx} bg="zinc-800" paddingX={2.5} paddingY={1.5} rounded="sm">
                                <Font variant="sub-tiny" color="zinc-400" uppercase weight="black">{tag}</Font>
                            </Box>
                        )) : tags}
                    </Stack>
                </Stack>
                <Box>
                    {actions}
                </Box>
            </Stack>
        </Box>
    )
}