/* eslint-disable no-restricted-syntax */
'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { BaseAvatar } from '../base/avatar'
import { LogOut, Settings } from 'lucide-react'
import { signOutAction } from '@/actions/auth-actions'

interface SidebarProfileUser {
    id?: string
    name?: string | null
    email?: string | null
    avatar_url?: string | null
}

export function SidebarProfile({ 
    onOpenSettings,
    user
}: { 
    onOpenSettings?: () => void
    user?: SidebarProfileUser
}) {
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : 'U'

    return (
        <Stack gap={5}>
            {/* User Identity Area */}
            <Stack direction="row" align="center" gap={2.5}>
                <BaseAvatar initials={initials} size="md" />
                <Stack gap={0} flex1>
                    <Font weight="black" variant="body-sm" color="white" uppercase italic nowrap>
                        {user?.name || 'Usuário'}
                    </Font>
                    <Font variant="sub-tiny" color="zinc-600" tracking="wide" nowrap>
                        {user?.email || ''}
                    </Font>
                </Stack>
            </Stack>

            {/* Actions Area */}
            <Stack direction="row" align="center" gap={2.5} fullWidth>
                {onOpenSettings && (
                    <Button
                        variant="zinc"
                        rounded="full"
                        size="sm"
                        isIconOnly
                        onClick={onOpenSettings}
                    >
                        <Icon icon={Settings} size="sm" />
                    </Button>
                )}

                <form action={signOutAction} className="flex-1">
                    <Button
                        variant="outline-red"
                        rounded="full"
                        size="sm"
                        fullWidth
                    >
                        <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={LogOut} size="sm" />
                            <Font variant="sub-tiny" weight="black">Sair</Font>
                        </Stack>
                    </Button>
                </form>
            </Stack>
        </Stack>
    )
}
