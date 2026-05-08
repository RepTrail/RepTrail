/* eslint-disable no-restricted-syntax */
'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { BaseAvatar } from '../base/avatar'
import { LogOut, Settings } from 'lucide-react'

export function SidebarProfile({ onOpenSettings }: { onOpenSettings?: () => void }) {
    return (
        <Stack gap={5}>
            {/* User Identity Area */}
            <Stack direction="row" align="center" gap={2.5}>
                <BaseAvatar initials="M" size="md" />
                <Stack gap={0} flex1>
                    <Font weight="black" variant="body-sm" color="white" uppercase italic nowrap>Marcos Vinicius</Font>
                    <Font variant="sub-tiny" color="zinc-600" tracking="wide" nowrap>contato@reptrail.com.br</Font>
                </Stack>
            </Stack>

            {/* Actions Area */}
            <Stack direction="row" align="center" gap={2.5} fullWidth>
                <Button
                    variant="zinc"
                    rounded="full"
                    size="sm"
                    isIconOnly
                    onClick={onOpenSettings}
                >
                    <Icon icon={Settings} size="sm" />
                </Button>

                <Button
                    variant="outline-red"
                    rounded="full"
                    size="sm"
                    flex1
                >
                    <Stack direction="row" align="center" gap={2.5}>
                        <Icon icon={LogOut} size="sm" />
                        <Font variant="sub-tiny" weight="black">Sair</Font>
                    </Stack>
                </Button>
            </Stack>
        </Stack>
    )
}
