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
    avatar?: string
    tags?: React.ReactNode
    extra?: React.ReactNode
    actions?: React.ReactNode
}

export function UserRow({
    initials,
    name,
    sub,
    avatar,
    tags,
    extra,
    actions
}: UserRowProps) {
    return (
        <Box padding={5} bg="zinc-950/40" border="white/10" rounded="system" transition="all" hoverBg="white/5">
            <Stack direction="col" mdDirection="row" align="center" gap={5} width="full">
                <BaseAvatar initials={initials} src={avatar} size="md" />

                <Stack gap={2.5} flex1 align="center" mdAlign="start" justify="center" width="full">
                    <Font variant="body" weight="black" uppercase italic truncate>{name}</Font>
                    <Stack direction="col" mdDirection="row" align="center" gap={2.5}>
                        <Font variant="sub-tiny" color="zinc-600" truncate>{sub}</Font>
                        <Stack direction="col" mdDirection="row" align="center" gap={2.5}>
                            {tags}
                        </Stack>
                    </Stack>
                </Stack>

                {extra && (
                    <Box display="md-hidden" border="white/5" padding={5} width="full">
                        {extra}
                    </Box>
                )}

                <Stack direction="row" align="center" gap={2.5} width="full" mdWidth="auto" justify="center" mdJustify="end">
                    {actions && (
                        <Stack direction="row" align="center" gap={2.5}>
                            {actions}
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Box>
    )
}
