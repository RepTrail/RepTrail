'use client'

import React, { useTransition } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { signOutAction } from '@/lib/dal/remote'

export function OnboardingLogoutButton() {
    const [isPending, startTransition] = useTransition()

    const handleLogout = () => {
        startTransition(async () => {
            await signOutAction()
        })
    }

    return (
        <Button
            variant="outline-zinc"
            onClick={handleLogout}
            disabled={isPending}
            fullWidth={{ base: true, lg: false }}
            text={isPending ? 'Saindo...' : 'Sair da conta'}
            iconLeft={LogOut} />
    );
}
