/* eslint-disable no-restricted-syntax */
import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { BaseAvatar } from '../base/avatar'
import { LogOut, Settings } from 'lucide-react'

interface SidebarProfileProps {
    name?: string
    role?: string
    avatar?: string
    onOpenSettings?: () => void
}

export function SidebarProfile({ 
    name = 'Usuário', 
    role = 'Membro', 
    avatar,
    onOpenSettings 
}: SidebarProfileProps) {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

    return (
        <Stack gap={5}>
            {/* User Identity Area */}
            <Stack gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                    <BaseAvatar src={avatar} initials={initials} size="md" />
                    <Box flex1 truncate>
                        <Stack gap={0}>
                            <Font weight="black" variant="body-sm" color="white" uppercase italic>{name}</Font>
                            <Font variant="sub-tiny" color="zinc-600" tracking="wide">{role}</Font>
                        </Stack>
                    </Box>
                </Stack>

                {/* Actions Area */}
                <Stack direction="row" align="center" gap={2.5} fullWidth>
                    <Button
                        variant="zinc"
                        rounded="full"
                        isIconOnly
                        onClick={onOpenSettings}
                    >
                        <Icon icon={Settings} size="sm" />
                    </Button>

                    <Button
                        variant="outline-red"
                        rounded="full"
                        flex1
                    >
                        <Icon icon={LogOut} size="sm" />
                        <Font variant="sub-tiny" weight="black">Sair</Font>
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}
