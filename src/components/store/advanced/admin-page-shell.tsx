'use client'

import React from 'react'
import { DashboardShell, DashboardUser } from './dashboard-shell'
import { RegistryContext } from './registry-context'
import { Stack } from '../base/stack'
import { Inline } from '../base/layout'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Shield, LucideIcon } from 'lucide-react'

interface AdminPageShellProps {
    children: React.ReactNode
    user?: DashboardUser
    pageTitle: string       // e.g. "GESTÃO DE PERSONAIS" — first word white, rest red
    subtitle?: string
    icon?: LucideIcon
}

const ADMIN_LINKS = [
    { href: '/admin/dashboard',  label: 'Início',    icon: 'BarChart3',      exact: true },
    { href: '/admin/personais',  label: 'Personais', icon: 'UserCheck' },
    { href: '/admin/alunos',     label: 'Alunos',    icon: 'Users' },
    { href: '/admin/afiliados',  label: 'Afiliados', icon: 'HeartHandshake' },
    { href: '/admin/loja',       label: 'Loja',      icon: 'ShoppingBag' },
    { href: '/admin/logs',       label: 'Logs',      icon: 'Activity' },
]

const ADMIN_MOBILE_LINKS = [
    { href: '/admin/dashboard',  label: 'Início',    icon: 'BarChart3',  exact: true },
    { href: '/admin/personais',  label: 'Personais', icon: 'UserCheck' },
    { href: '/admin/alunos',     label: 'Alunos',    icon: 'Users' },
    { href: '/admin/loja',       label: 'Loja',      icon: 'ShoppingBag' },
    { href: '/admin/logs',       label: 'Logs',      icon: 'Activity' },
]

export function AdminPageShell({ children, user, pageTitle = '', subtitle, icon = Shield }: AdminPageShellProps) {
    const words = (pageTitle || '').trim().split(' ')
    const first = words[0] || ''
    const rest = words.slice(1).join(' ')

    return (
        <RegistryContext.Provider value={{
            primaryColor: 'red',
            activeTab: 'admin',
            setActiveTab: () => {},
            activeSection: '',
            setActiveSection: () => {},
            isSidebarOpen: false,
            setIsSidebarOpen: () => {},
        }}>
            <DashboardShell
                color="red"
                links={ADMIN_LINKS}
                mobileLinks={ADMIN_MOBILE_LINKS}
                user={user}
            >
                <Stack gap={{ base: 12.5, md: 'section' }}>
                    {/* Page Header — RegistryMain pattern */}
                    <Stack gap={2.5}>
                        <Inline gap={2.5}>
                            <Icon icon={icon} color="red" size="lg" />
                            <Font variant="auxiliary" color="red">Painel Admin</Font>
                        </Inline>
                        <Stack gap={1}>
                            <Font variant="h1" nowrap>
                                {first}{rest ? <> <Font variant="h1" color="red" nowrap>{rest}</Font></> : null}
                            </Font>
                            {subtitle && <Font variant="description">{subtitle}</Font>}
                        </Stack>
                    </Stack>

                    {children}
                </Stack>
            </DashboardShell>
        </RegistryContext.Provider>
    )
}
