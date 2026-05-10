'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Logo } from '../base/logo'
import { SidebarItem } from '../intermediary/sidebar-item'
import { BottomNavItem } from '../intermediary/bottom-nav-item'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Divider, MobileNavContainer, MobileHeaderContainer, Inline } from '../base/layout'
import { Surface } from '../base/surface'
import { ImpersonationBar } from './impersonation-bar'
import { cn } from '@/lib/utils'
import { RegistryColor } from './registry-context'
import {
    Home, Users, Dumbbell, Utensils, Activity, FlaskConical,
    ShoppingBag, CreditCard, Trophy, User, FileUp, Search,
    UserCheck, Sparkles, TrendingUp, ClipboardList, Syringe,
    DollarSign, BarChart2, BarChart3, HeartHandshake, Shield,
    Menu, X, LucideIcon
} from 'lucide-react'

// ─── Icon Map (Server-safe string → LucideIcon) ───────────────────────────────

const iconMap: Record<string, LucideIcon> = {
    Home, Users, Dumbbell, Utensils, Activity, FlaskConical,
    ShoppingBag, CreditCard, Trophy, User, FileUp, Search,
    UserCheck, Sparkles, TrendingUp, ClipboardList, Syringe,
    DollarSign, BarChart2, BarChart3, HeartHandshake, Shield,
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
}

interface DashboardShellProps {
    children: React.ReactNode
    color: RegistryColor
    links: DashboardNavLink[]
    /** Subset for bottom nav (defaults to first 5 visible links) */
    mobileLinks?: DashboardNavLink[]
    user?: DashboardUser
    profileHref?: string
}

// ─── Color Maps ───────────────────────────────────────────────────────────────

const lightColorMap: Record<RegistryColor, string> = {
    blue: 'from-blue-500/20',
    red: 'from-red-500/20',
    amber: 'from-amber-500/20',
    emerald: 'from-emerald-500/20',
    orange: 'from-orange-500/20',
    zinc: 'from-zinc-500/20',
}

const orbColorMap: Record<RegistryColor, string> = {
    blue: 'bg-blue-500/10',
    red: 'bg-red-500/10',
    amber: 'bg-amber-500/10',
    emerald: 'bg-emerald-500/10',
    orange: 'bg-orange-500/10',
    zinc: 'bg-zinc-500/10',
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export function DashboardShell({ children, color, links, mobileLinks, user, profileHref }: DashboardShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    const visibleLinks = links.filter(l => !l.hidden)
    const bottomLinks = mobileLinks?.filter(l => !l.hidden) ?? visibleLinks.slice(0, 5)

    return (
        <Box
            minHeight="screen"
            bg="zinc"
            bgOpacity={100}
            overflowX="hidden"
            display="flex"
            direction="col"
            position="relative"
        >
            {/* Background Grid - Allowed exception via className for system SVGs */}
            <Box
                position="fixed"
                inset={0}
                className="bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white_0%,transparent_90%)] opacity-[0.22] pointer-events-none z-0"
            />

            {/* Background Orbs - Allowed high-fidelity effects in Advanced organismos */}
            <Box
                position="fixed"
                top="-10%"
                right="-5%"
                width="full"
                height="full"
                rounded="full"
                className={cn(
                    'blur-[150px] pointer-events-none transition-colors duration-1000 z-0',
                    'w-[60%] h-[60%]',
                    `bg-gradient-to-br ${lightColorMap[color]} to-transparent`
                )}
            />
            <Box
                position="fixed"
                bottom="10%"
                left="20%"
                className={cn(
                    'w-[500px] h-[500px] rounded-full blur-[180px] animate-pulse pointer-events-none transition-colors duration-1000 z-0',
                    orbColorMap[color]
                )}
            />

            {/* Desktop Sidebar */}
            <DashboardSidebar
                color={color}
                links={visibleLinks}
                user={user}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                profileHref={profileHref}
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
            <Box
                as="main"
                flex1
                fullWidth
                transition
                position="relative"
                zIndex={10}
                className="lg:pl-72" // Maintaining w-72 parity until Box supports arbitrary precise spacing
            >
                <Box
                    padding={5}
                    paddingTop={{ base: 25, lg: 5 }}
                    paddingBottom={{ base: 25, lg: 12.5 }}
                    gap={12.5}
                >
                    <ImpersonationBar color={color} />
                    {children}
                </Box>
            </Box>
        </Box>
    )
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

function DashboardSidebar({
    color, links, user, isSidebarOpen, setIsSidebarOpen, profileHref
}: {
    color: RegistryColor
    links: DashboardNavLink[]
    user?: DashboardUser
    isSidebarOpen: boolean
    setIsSidebarOpen: (v: boolean) => void
    profileHref?: string
}) {
    const pathname = usePathname()

    const isActive = (link: DashboardNavLink) =>
        link.exact ? pathname === link.href : pathname.startsWith(link.href)

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <Box
                    position="fixed"
                    inset={0}
                    bg="black"
                    bgOpacity={60}
                    backdropBlur="sm"
                    zIndex={100}
                    display={{ base: 'block', lg: 'none' }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Box
                as="aside"
                position="fixed"
                top={0}
                height="screen"
                zIndex={100}
                width="sidebar-wide"
                translateX={{
                    base: isSidebarOpen ? 'none' : 'full',
                    lg: 'none'
                }}
                transition
                className="right-0 lg:left-0 lg:right-auto" // Orchestration classes
            >
                {/* Sidebar Container */}
                <Box
                    fullHeight
                    display="flex"
                    direction="col"
                    bg="zinc"
                    bgOpacity={50}
                    backdropBlur="md"
                >
                    <Box padding={5} position="relative" flex1 display="flex" direction="col" overflow="hidden" gap={12.5}>

                        {/* Mobile Close Button */}
                        <Box display={{ base: 'block', lg: 'none' }} position="absolute" left={20} top={20}>
                            <Button
                                variant="zinc"
                                size="sm"
                                isIconOnly
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <X size={20} />
                            </Button>
                        </Box>

                        {/* Logo */}
                        <Box shrink={0}>
                            <Logo size="md" color={color as any} />
                        </Box>

                        {/* Navigation */}
                        <Box as="nav" flex1 fullWidth overflowY="auto" noScrollbar>
                            <Stack gap={2.5} fullWidth>
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
                    </Box>

                    <Divider color="white/5" />

                    <Box padding={5} shrink={0}>
                        <SidebarProfile
                            user={user}
                            settingsHref={profileHref}
                        />
                    </Box>
                </Box>
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
                <Surface variant="glass" padding={1} rounded="system">
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
