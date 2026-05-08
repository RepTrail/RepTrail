'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Zap, Clock } from 'lucide-react'

interface LogItemProps {
    action: string
    admin?: string
    target?: string
    details?: string | Record<string, unknown>
    date: string
}

export function LogItem({ action, admin, target, details, date }: LogItemProps) {
    const detailString = typeof details === 'object' ? JSON.stringify(details) : details

    return (
        <Box padding={5} bg="zinc-950/40" border="white/10" rounded="system">
            <Stack direction="row" gap={5} align="start">
                <Box bg="zinc-950" border="white/10" padding={2.5} rounded="sm" display="flex" align="center" justify="center" shrink0>
                    <Icon icon={Zap} color="amber" size="sm" />
                </Box>
                <Stack gap={2.5} flex1>
                    <Stack direction="row" align="center" gap={2.5} wrap>
                        <Font variant="label-caps">{action.replace(/_/g, ' ')}</Font>
                        {target && <Font variant="sub-tiny" color="amber" weight="black" italic>• {target}</Font>}
                        {admin && <Font variant="sub-tiny" color="zinc-600">por {admin}</Font>}
                    </Stack>
                    {detailString && (
                        <Box bg="black" bgOpacity={20} padding={2.5} rounded="sm" display="flex" align="center">
                            <Font variant="sub-tiny" color="zinc-500" mono>{detailString}</Font>
                        </Box>
                    )}
                    <Stack direction="row" align="center" gap={2.5}>
                        <Icon icon={Clock} color="zinc-700" size="xs" />
                        <Font variant="sub-tiny" color="zinc-600">{date}</Font>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}
