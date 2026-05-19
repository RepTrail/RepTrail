'use client'

import React from 'react'
import { DashboardShell, DashboardUser } from './dashboard-shell'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Shield, LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AdminPageShellProps {
    children: React.ReactNode
    user?: DashboardUser
    pageTitle: string       // e.g. "GESTÃO DE PERSONAIS" — first word white, rest red
    subtitle?: string
    icon?: LucideIcon
}

const ADMIN_LINKS = [
    { href: '/admin/dashboard', label: 'Início', icon: 'BarChart3', exact: true },
    { href: '/admin/personais', label: 'Personais', icon: 'UserCheck' },
    { href: '/admin/alunos', label: 'Alunos', icon: 'Users' },
    { href: '/admin/afiliados', label: 'Afiliados', icon: 'HeartHandshake' },
    { href: '/admin/loja', label: 'Loja', icon: 'ShoppingBag' },
    { href: '/admin/logs', label: 'Logs', icon: 'Activity' },
]

const ADMIN_MOBILE_LINKS = [
    { href: '/admin/dashboard', label: 'Início', icon: 'BarChart3', exact: true },
    { href: '/admin/personais', label: 'Personais', icon: 'UserCheck' },
    { href: '/admin/alunos', label: 'Alunos', icon: 'Users' },
    { href: '/admin/loja', label: 'Loja', icon: 'ShoppingBag' },
    { href: '/admin/logs', label: 'Logs', icon: 'Activity' },
]

export function AdminPageShell({ children, user, pageTitle = '', subtitle, icon = Shield }: AdminPageShellProps) {
    const words = (pageTitle || '').trim().split(' ')
    const first = words[0] || ''
    const rest = words.slice(1).join(' ')

    return (
        <DashboardShell
            color={STORE_TOKENS.COLORS.ERROR}
            links={ADMIN_LINKS}
            mobileLinks={ADMIN_MOBILE_LINKS}
            user={user}
        >
            <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
                {/* Page Header — RegistryMain pattern */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={icon} color={STORE_TOKENS.COLORS.ERROR} size="lg" />
                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.ERROR}>Painel Admin</Font>
                    </Inline>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="h1" nowrap>
                            {first}{rest ? <> <Font variant="h1" color={STORE_TOKENS.COLORS.ERROR} nowrap>{rest}</Font></> : null}
                        </Font>
                        {subtitle && <Font variant="description">{subtitle}</Font>}
                    </Stack>
                </Stack>

                {children}
            </Stack>
        </DashboardShell>
    )
}
