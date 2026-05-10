'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '../base/logo'
import { SidebarItem } from '../intermediary/sidebar-item'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Divider, MobileNavContainer, MobileHeaderContainer, Inline } from '../base/layout'
import { GlassPanel } from '../base/surface'
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
    blue:    'from-blue-500/20',
    red:     'from-red-500/20',
    amber:   'from-amber-500/20',
    emerald: 'from-emerald-500/20',
    orange:  'from-orange-500/20',
    zinc:    'from-zinc-500/20',
}

const orbColorMap: Record<RegistryColor, string> = {
    blue:    'bg-blue-500/10',
    red:     'bg-red-500/10',
    amber:   'bg-amber-500/10',
    emerald: 'bg-emerald-500/10',
    orange:  'bg-orange-500/10',
    zinc:    'bg-zinc-500/10',
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
            {/* Background Grid */}
            <Box className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white_0%,transparent_90%)] opacity-[0.22] pointer-events-none z-0" />

            {/* Background Orbs */}
            <Box className={cn(
                'fixed -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 z-0',
                `bg-gradient-to-br ${lightColorMap[color]} to-transparent`
            )} />
            <Box className={cn(
                'fixed bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[180px] animate-pulse pointer-events-none transition-colors duration-1000 z-0',
                orbColorMap[color]
            )} />

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
            <Box as="main" flex1 fullWidth transition position="relative" className="lg:pl-72 z-10">
                <Box padding={5} className="pt-[100px] lg:pt-5 pb-28 lg:pb-10">
                    <Box className="mb-5">
                        <ImpersonationBar color={color} />
                    </Box>
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
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={cn(
                'fixed right-0 top-0 h-screen w-72 z-[101] transition-transform duration-500',
                'lg:translate-x-0 lg:left-0 lg:right-auto',
                isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
            )}>
                {/* Full-height flex column */}
                <div className="flex flex-col h-full bg-zinc-950/40 backdrop-blur-md border-l lg:border-l-0 lg:border-r border-white/5">

                    {/* Scrollable top section */}
                    <div className="flex flex-col flex-1 overflow-hidden p-5 relative">

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute left-5 top-5 lg:hidden text-white/40 hover:text-white active:scale-90 transition-all"
                        >
                            <X size={20} />
                        </button>

                        {/* Logo — fixed, never shrinks */}
                        <div className="shrink-0 pb-[50px]">
                            <Logo size="md" color={color as any} />
                        </div>

                        {/* Nav — takes remaining space, scrolls */}
                        <nav className="flex-1 w-full overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                        </nav>
                    </div>

                    {/* Divider */}
                    <Divider color="white/5" />

                    {/* Profile — fixed at bottom */}
                    <div className="shrink-0 p-5">
                        <SidebarProfile 
                            user={user} 
                            settingsHref={profileHref} 
                        />
                    </div>
                </div>
            </aside>
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
                <GlassPanel padding={0} rounded="system" className="p-1">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center justify-center w-10 h-10 active:scale-90 transition-transform"
                    >
                        <Icon icon={Menu} color={color as any} size="sm" />
                    </button>
                </GlassPanel>
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
                const variant = `outline-${color}` as any

                const iconElement = (
                    <Icon
                        icon={IconComp ?? Home}
                        size="sm"
                        color={(active ? color : 'white') as any}
                        className={active ? 'opacity-100' : 'opacity-40'}
                    />
                )

                if (link.onClick) {
                    return (
                        <Button
                            key={link.href}
                            variant={active ? variant : 'ghost'}
                            size="md"
                            rounded={active ? 'system' : 'full'}
                            isIconOnly
                            className="transition-transform active:scale-90"
                            onClick={link.onClick}
                        >
                            {iconElement}
                        </Button>
                    )
                }

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "inline-flex items-center justify-center transition-all active:scale-90",
                            "w-10 h-10", // approximate md isIconOnly size
                            active 
                                ? (color === 'orange' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-[5px]' :
                                   color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[5px]' :
                                   color === 'red' ? 'bg-red-500/10 text-red-500 border border-red-500/20 rounded-[5px]' :
                                   color === 'amber' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-[5px]' :
                                   'bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-[5px]')
                                : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white rounded-full"
                        )}
                    >
                        {iconElement}
                    </Link>
                )
            })}
        </MobileNavContainer>
    )
}
