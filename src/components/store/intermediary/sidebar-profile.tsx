'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { BaseAvatar } from '@/components/store/base/avatar'
import { LogOut, Settings, Briefcase, ArrowRightLeft } from 'lucide-react'
import { signOutAction } from '@/actions/auth-actions'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Box } from '@/components/store/base/box'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import Link from 'next/link'

interface SidebarProfileUser {
    id?: string
    name?: string | null
    email?: string | null
    avatar_url?: string | null
    isAdmin?: boolean
    isAffiliate?: boolean
    role?: string
}

export function SidebarProfile({ 
    onOpenSettings,
    settingsHref,
    settingsIcon: SettingsIcon = Settings,
    settingsVariant = 'outline-blue',
    adminHref = '/admin',
    user
}: { 
    onOpenSettings?: () => void
    settingsHref?: string
    settingsIcon?: any
    settingsVariant?: any
    adminHref?: string
    user?: SidebarProfileUser
}) {
    const pathname = usePathname()
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : 'U'

    const [userRole, setUserRole] = React.useState<string | undefined>(user?.role)

    React.useEffect(() => {
        if (user?.role) {
            setUserRole(user.role)
            return
        }
        if (!user?.id) return

        const supabase = createClient()
        supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
            .then(({ data }) => {
                if (data?.role) {
                    setUserRole(data.role)
                }
            })
    }, [user?.id, user?.role])

    const isSwitchIcon = SettingsIcon === ArrowRightLeft
    let resolvedVariant = settingsVariant
    if (isSwitchIcon) {
        if (userRole === 'student') {
            resolvedVariant = 'outline-orange'
        } else if (userRole === 'trainer') {
            resolvedVariant = 'outline-emerald'
        } else {
            resolvedVariant = settingsVariant || 'outline-emerald'
        }
    }

    const settingsTrigger = (
        <Button
            variant={resolvedVariant}
            rounded={STORE_TOKENS.RADIUS.FULL}
            size="sm"
            isIconOnly
            onClick={settingsHref ? undefined : onOpenSettings}
        >
            <Icon icon={SettingsIcon} size="sm" />
        </Button>
    )

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            {/* User Identity Area */}
            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <BaseAvatar initials={initials} src={user?.avatar_url || undefined} size="md" />
                <Stack gap={STORE_TOKENS.SPACING.NONE} flex1 overflow="hidden" minWidth={0}>
                    <Font
                        {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                        variant="body-sm"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        {user?.name || 'Usuário'}
                    </Font>
                    <Font
                        variant="sub-tiny"
                        truncate
                        lowercase
                        display="block"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.DIM,
                        }}>
                        {user?.email || ''}
                    </Font>
                </Stack>
            </Stack>
            {/* Actions Area */}
            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                {user?.isAdmin && !pathname.startsWith('/admin') && (
                    <Link href={adminHref}>
                        <Button
                            variant="outline-red"
                            rounded={STORE_TOKENS.RADIUS.FULL}
                            size="sm"
                            isIconOnly
                        >
                            <Icon icon={ArrowRightLeft} size="sm" />
                        </Button>
                    </Link>
                )}

                {user?.isAffiliate && !pathname.startsWith('/dashboard/affiliate') && (
                    <Link href="/dashboard/affiliate">
                        <Button
                            variant="outline-amber"
                            rounded={STORE_TOKENS.RADIUS.FULL}
                            size="sm"
                            isIconOnly
                        >
                            <Icon icon={ArrowRightLeft} size="sm" />
                        </Button>
                    </Link>
                )}

                {settingsHref ? (
                    <Link href={settingsHref}>
                        {settingsTrigger}
                    </Link>
                ) : onOpenSettings ? (
                    settingsTrigger
                ) : null}

                <Box flex1>
                    <form action={signOutAction}>
                        <Button
                            variant="outline-red"
                            rounded={STORE_TOKENS.RADIUS.FULL}
                            size="sm"
                            fullWidth
                            type="submit"
                        >
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={LogOut} size="sm" />
                                <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL}>Sair</Font>
                            </Stack>
                        </Button>
                    </form>
                </Box>
            </Stack>
        </Stack>
    );
}
