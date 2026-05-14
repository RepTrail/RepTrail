'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/store/base/logo'
import { SidebarItem } from '../intermediary/sidebar-item'
import { BottomNavItem } from '../intermediary/bottom-nav-item'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Box } from '@/components/store/base/box'
import { Main } from '@/components/store/base/main'
import { Stack } from '@/components/store/base/stack'
import { Divider, MobileNavContainer, MobileHeaderContainer, Inline } from '@/components/store/base/layout'
import { Surface, GlassPanel } from '@/components/store/base/surface'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { ImpersonationBar } from './impersonation-bar'
import { cn } from '@/lib/utils'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { RegistryColor } from './registry-context'
import {
    Home, Users, Dumbbell, Utensils, Activity, FlaskConical,
    ShoppingBag, CreditCard, Trophy, User, FileUp, Search,
    UserCheck, Sparkles, TrendingUp, ClipboardList, Syringe,
    DollarSign, BarChart2, BarChart3, HeartHandshake, Shield,
    Menu, X, ArrowRightLeft, LucideIcon
} from 'lucide-react'

// ─── Icon Map (Server-safe string → LucideIcon) ───────────────────────────────

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
    /** Pass the icon name as a string, e.g. 'Home', 'Dumbbell', 'Trophy' */
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
    /** Subset for bottom nav (defaults to first 5 visible links) */
    mobileLinks?: DashboardNavLink[]
    user?: DashboardUser
    profileHref?: string
    profileIcon?: any
}

// ─── Color Maps ───────────────────────────────────────────────────────────────

const lightColorMap: Record<RegistryColor, string> = {
    blue: '#3b82f633', // blue-500/20 approx
    red: '#ef444433',
    amber: '#f59e0b33',
    emerald: '#10b98133',
    orange: '#f9731633',
    zinc: '#71717a33',
}

const orbColorMap: Record<RegistryColor, string> = {
    blue: '#3b82f61a', // blue-500/10 approx
    red: '#ef44441a',
    amber: '#f59e0b1a',
    emerald: '#10b9811a',
    orange: '#f973161a',
    zinc: '#71717a1a',
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export function DashboardShell({ children, color, links, mobileLinks, user, profileHref, profileIcon }: DashboardShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    const visibleLinks = links.filter(l => !l.hidden)
    const bottomLinks = mobileLinks?.filter(l => !l.hidden) ?? visibleLinks.slice(0, 5)

    const ResolvedProfileIcon = typeof profileIcon === 'string' ? iconMap[profileIcon] : profileIcon

    return (
        <Surface
            minHeight="screen"
            bg="zinc"
            bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND}
            overflowX="hidden"
            display="flex"
            direction="col"
            position="relative"
        >
            {/* Background Effects (Grid & Orbs) — Unified Base Component */}
            <BackgroundEffects variant="all" />

            {/* Desktop Sidebar */}
            <DashboardSidebar
                color={color}
                links={visibleLinks}
                user={user}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                profileHref={profileHref}
                profileIcon={ResolvedProfileIcon}
            />

            {/* Mobile Top Header */}
            <DashboardMobileHeader
                color={color}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Mobile Bottom Nav */}
            <DashboardBottomNav color={color} links={bottomLinks} />

            {/* Main Content */}
            <Main
                flex1
                fullWidth
                transition
                position="relative"
                zIndex={10}
                paddingLeft={{ base: 0, lg: 'sidebar-wide' }}
              >
                <ImpersonationBar color={color} />
                {children}
            </Main>
        </Surface>
    )
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

function DashboardSidebar({
    color, links, user, isSidebarOpen, setIsSidebarOpen, profileHref, profileIcon
}: {
    color: RegistryColor
    links: DashboardNavLink[]
    user?: DashboardUser
    isSidebarOpen: boolean
    setIsSidebarOpen: (v: boolean) => void
    profileHref?: string
    profileIcon?: any
}) {
    const pathname = usePathname()

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
                pin="left"
                translateX={{ base: isSidebarOpen ? 0 : '-full', lg: 0 }}
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
                    {/* Right border for desktop static */}
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

                                        return (
                                            <SidebarItem
                                                key={link.href}
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
                            settingsHref={profileHref}
                            settingsIcon={profileIcon}
                        />
                    </Box>
                </GlassPanel>
            </Box>
        </>
    )
}

// ─── Mobile Header ────────────────────────────────────────────────────────────

function DashboardMobileHeader({
    color, isSidebarOpen, setIsSidebarOpen
}: {
    color: RegistryColor
    isSidebarOpen: boolean
    setIsSidebarOpen: (v: boolean) => void
}) {
    return (
        <MobileHeaderContainer>
            <Inline justify="between" fullWidth align="center">
                <Logo size="sm" color={color as any} />
                <Surface variant="glass" padding={2.5} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                    <Button
                        variant="ghost"
                        size="md"
                        isIconOnly
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Icon icon={Menu} color={color as any} size="sm" />
                    </Button>
                </Surface>
            </Inline>
        </MobileHeaderContainer>
    )
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

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
