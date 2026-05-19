'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/store/base/logo'
import { SidebarItem } from '../intermediary/sidebar-item'
import { BottomNavItem } from '../intermediary/bottom-nav-item'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Icon } from '@/components/store/base/icon'
import { Box } from '@/components/store/base/box'
import { Main } from '@/components/store/base/main'
import { Stack } from '@/components/store/base/stack'
import { Divider, MobileNavContainer, Inline } from '@/components/store/base/layout'
import { Surface, GlassPanel } from '@/components/store/base/surface'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { ImpersonationBar } from './impersonation-bar'
import { StoreMobileHeader } from './store-mobile-header'
import { cn } from '@/lib/utils'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { RegistryColor, RegistryProvider } from './registry-context'
import {
    Home, Users, Dumbbell, Utensils, Activity, FlaskConical,
    ShoppingBag, CreditCard, Trophy, User, FileUp, Search,
    UserCheck, Sparkles, TrendingUp, ClipboardList, Syringe,
    DollarSign, BarChart2, BarChart3, HeartHandshake, Shield,
    Menu, X, ArrowRightLeft, LucideIcon
} from 'lucide-react'

// ─── Icon Map ───────────────────────────────────────────────────────────────

const iconMap: Record<string, LucideIcon> = {
    Home, Users, Dumbbell, Utensils, Activity, FlaskConical,
    ShoppingBag, CreditCard, Trophy, User, FileUp, Search,
    UserCheck, Sparkles, TrendingUp, ClipboardList, Syringe,
    DollarSign, BarChart2, BarChart3, HeartHandshake, Shield,
    ArrowRightLeft,
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardNavLink {
    href: string
    label: string
    icon: string
    exact?: boolean
    hidden?: boolean
    onClick?: () => void
}

export interface DashboardUser {
    id: string
    name?: string | null
    email?: string | null
    avatar_url?: string | null
    isAdmin?: boolean
}

interface DashboardShellProps {
    children: React.ReactNode
    color: RegistryColor
    links: DashboardNavLink[]
    mobileLinks?: DashboardNavLink[]
    user?: DashboardUser
    profileHref?: string
    profileIcon?: any
    settingsHref?: string
    settingsVariant?: any
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export function DashboardShell({ children, color, links, mobileLinks, user, profileHref, profileIcon, settingsHref, settingsVariant }: DashboardShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
    const pathname = usePathname()
    const isPlayerMode = pathname.includes('/workout/') && !pathname.endsWith('/workouts')

    const visibleLinks = links.filter(l => !l.hidden)
    const bottomLinks = mobileLinks?.filter(l => !l.hidden) ?? visibleLinks.slice(0, 5)

    const ResolvedProfileIcon = typeof profileIcon === 'string' ? iconMap[profileIcon] : profileIcon

    const handleOpenSettings = () => {
        window.dispatchEvent(new CustomEvent('open-settings'))
    }

    const resolvedSettingsHref = settingsHref || (profileIcon === 'ArrowRightLeft' ? '/dashboard' : undefined)
    const resolvedSettingsVariant = settingsVariant || (profileIcon === 'ArrowRightLeft' ? 'outline-emerald' : undefined)

    return (
        <RegistryProvider primaryColor={color} defaultColor={color}>
            <Surface
                minHeight="screen"
                bg="zinc"
                bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND}
                overflowX="hidden"
                display="flex"
                direction="col"
                position="relative"
            >
            <BackgroundEffects variant="all" />

            {/* Sidebar (Mobile Right Drawer / Desktop Static Left) */}
            <DashboardSidebar
                color={color}
                links={visibleLinks}
                user={user}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                profileHref={profileHref}
                profileIcon={ResolvedProfileIcon}
                settingsHref={resolvedSettingsHref}
                settingsVariant={resolvedSettingsVariant}
                onOpenSettings={handleOpenSettings}
            />

            {/* Mobile Header (Canonical) */}
            {!isPlayerMode && (
                <StoreMobileHeader
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            )}

            {/* Mobile Bottom Nav */}
            {!isPlayerMode && <DashboardBottomNav color={color} links={bottomLinks} />}

            {/* Main Content Area */}
            <Main
                flex1
                fullWidth
                transition
                position="relative"
                zIndex={10}
                paddingLeft={{ base: 0, md: 'sidebar-wide' }}
                display="flex"
                direction="col"
            >
                <ImpersonationBar color={color} />
                {children}
            </Main>
            </Surface>
        </RegistryProvider>
    )
}

// ─── Sidebar Sub-component ───────────────────────────────────────────────────

function DashboardSidebar({
    color, links, user, isSidebarOpen, setIsSidebarOpen, profileHref, profileIcon, settingsHref, settingsVariant, onOpenSettings
}: {
    color: RegistryColor
    links: DashboardNavLink[]
    user?: DashboardUser
    isSidebarOpen: boolean
    setIsSidebarOpen: (v: boolean) => void
    profileHref?: string
    profileIcon?: any
    settingsHref?: string
    settingsVariant?: any
    onOpenSettings?: () => void
}) {
    const pathname = usePathname()

    React.useEffect(() => {
        setIsSidebarOpen(false)
    }, [pathname, setIsSidebarOpen])

    const isActive = (link: DashboardNavLink) =>
        link.exact ? pathname === link.href : pathname.startsWith(link.href)

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <Surface
                    position="fixed"
                    pin="inset"
                    variant="glass-dark"
                    zIndex={100}
                    display={{ base: 'block', lg: 'none' }}
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <></>
                </Surface>
            )}

            <Box
                as="aside"
                position="fixed"
                top={0}
                height="screen"
                zIndex={100}
                width="sidebar-wide"
                transition
                pin={{ base: 'right', lg: 'left' }}
                translateX={{ base: isSidebarOpen ? 0 : 'full', lg: 0 }}
            >
                <GlassPanel
                    fullWidth
                    fullHeight
                    variant="glass"
                    display="flex"
                    direction="col"
                    rounded="none"
                    border="none"
                >
                    {/* Drawer Border (Mobile Left / Desktop Right) */}
                    <Surface 
                        display={{ base: 'block', lg: 'none' }} 
                        position="absolute" 
                        pin="left" 
                        top={0} 
                        fullHeight 
                        width="px" 
                        bg="white" 
                        bgOpacity={5}
                    >
                        <></>
                    </Surface>
                    <Surface 
                        display={{ base: 'none', lg: 'block' }} 
                        position="absolute" 
                        pin="right" 
                        top={0} 
                        fullHeight 
                        width="px" 
                        bg="white" 
                        bgOpacity={5}
                    >
                        <></>
                    </Surface>

                    <Box fullWidth padding={STORE_TOKENS.PADDING.CONTAINER} flex1 display="flex" direction="col" overflow="hidden">
                        <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE} fullWidth flex1 overflow="hidden">
                            {/* Logo */}
                            <Box shrink={0}>
                                <Logo size="md" color={color as any} />
                            </Box>

                            {/* Navigation */}
                            <Box as="nav" flex1 fullWidth overflowY="auto" noScrollbar>
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                    {links.map((link) => {
                                        const IconComp = iconMap[link.icon]
                                        const active = isActive(link)
                                        const tourId = link.label === "Importar PDF" ? "tour-import-pdf" : 
                                                       link.label === "Alunos" ? "tour-sidebar-students" : 
                                                       undefined

                                        return (
                                            <SidebarItem
                                                key={link.href}
                                                id={tourId}
                                                label={link.label}
                                                icon={IconComp ?? Home}
                                                active={active}
                                                variant={color as any}
                                                onClick={link.onClick ? () => {
                                                    link.onClick?.()
                                                    setIsSidebarOpen(false)
                                                } : undefined}
                                                href={link.onClick ? undefined : link.href}
                                            />
                                        )
                                    })}
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider color={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} />

                    <Box padding={STORE_TOKENS.PADDING.CONTAINER} shrink={0}>
                        <SidebarProfile
                            user={user}
                            settingsIcon={profileIcon}
                            settingsHref={settingsHref}
                            settingsVariant={settingsVariant}
                            onOpenSettings={onOpenSettings}
                        />
                    </Box>
                </GlassPanel>
            </Box>
        </>
    )
}

// ─── Bottom Nav Sub-component ───────────────────────────────────────────────

function DashboardBottomNav({ color, links }: { color: RegistryColor; links: DashboardNavLink[] }) {
    const pathname = usePathname()

    const isActive = (link: DashboardNavLink) =>
        link.exact ? pathname === link.href : pathname.startsWith(link.href)

    return (
        <MobileNavContainer>
            {links.map((link) => {
                const IconComp = iconMap[link.icon]
                const active = isActive(link)

                return (
                    <BottomNavItem
                        key={link.href}
                        href={link.onClick ? undefined : link.href}
                        onClick={link.onClick}
                        icon={IconComp ?? Home}
                        active={active}
                        variant={color}
                    />
                )
            })}
        </MobileNavContainer>
    )
}
