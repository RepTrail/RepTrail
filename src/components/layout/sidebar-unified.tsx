'use client'

import * as React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cva, type VariantProps } from "class-variance-authority"
import { LogOut, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Box } from "@/components/store/base/box"
import { Stack } from "@/components/store/base/stack"
import { Font } from "@/components/store/base/font"
import { Surface, GlassPanel } from "@/components/store/base/surface"
import { STORE_TOKENS } from "@/components/store/constants/tokens"
import { signOutAction } from '@/actions/auth-actions'
import { SmartLink } from "@/components/shared/smart-link"
import { PREFETCH_REGISTRY } from "@/lib/prefetch-registry"

const sidebarLinkVariants = cva(
  "flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 group border-2 text-[10px] font-black uppercase tracking-[0.2em] italic",
  {
    variants: {
      variant: {
        emerald: "text-zinc-500 hover:bg-zinc-800 hover:text-white border-transparent hover:border-zinc-700 data-[active=true]:bg-emerald-500/10 data-[active=true]:border-emerald-500/30 data-[active=true]:text-emerald-400",
        orange: "text-zinc-500 hover:bg-zinc-800 hover:text-white border-transparent hover:border-zinc-700 data-[active=true]:bg-orange-500/10 data-[active=true]:border-orange-500/30 data-[active=true]:text-orange-400",
        amber: "text-zinc-500 hover:bg-zinc-800 hover:text-white border-transparent hover:border-zinc-700 data-[active=true]:bg-amber-500/10 data-[active=true]:border-amber-500/30 data-[active=true]:text-amber-400",
        zinc: "text-zinc-500 hover:bg-zinc-800 hover:text-white border-transparent hover:border-zinc-700 data-[active=true]:bg-zinc-800 data-[active=true]:border-zinc-700 data-[active=true]:text-white",
        red: "text-zinc-500 hover:bg-zinc-800 hover:text-white border-transparent hover:border-zinc-700 data-[active=true]:bg-red-500/10 data-[active=true]:border-red-500/30 data-[active=true]:text-red-500",
      }
    },
    defaultVariants: {
      variant: "zinc"
    }
  }
)

const sidebarIconVariants = cva(
  "transition-all duration-300 group-hover:scale-110 group-data-[active=true]:scale-110",
  {
    variants: {
      variant: {
        emerald: "",
        orange: "",
        amber: "",
        zinc: "",
        red: "",
      }
    },
    defaultVariants: {
      variant: "zinc"
    }
  }
)

export interface SidebarLink {
  href?: string
  label: string
  icon: React.ReactNode
  exact?: boolean
  hidden?: boolean
  onClick?: () => void
  isActive?: boolean
}

export interface UnifiedSidebarProps extends VariantProps<typeof sidebarLinkVariants> {
  links: SidebarLink[]
  user: {
    id: string
    name?: string | null
    email?: string | null
    avatar_url?: string | null
  }
  brandColor?: 'emerald' | 'orange' | 'amber' | 'zinc' | 'red'
  logoColor?: "emerald" | "amber" | "orange" | "white" | "red"
  tagline?: string
  extraLinks?: {
    title: string
    links: SidebarLink[]
  }
  showSettings?: boolean
}

export function UnifiedSidebar({
  links,
  user,
  brandColor = 'zinc',
  logoColor = 'white',
  tagline,
  extraLinks,
  showSettings = true
}: UnifiedSidebarProps) {
  const pathname = usePathname()

  const isLinkActive = (link: SidebarLink) => {
    if (link.isActive !== undefined) return link.isActive
    if (!link.href) return false
    return link.exact 
      ? pathname === link.href 
      : pathname === link.href || pathname.startsWith(link.href + '/')
  }

  const renderLink = (link: SidebarLink) => {
    const active = isLinkActive(link)
    const className = cn("w-full text-left", sidebarLinkVariants({ variant: brandColor }))
    
    const prefetchConfigs = link.href ? (PREFETCH_REGISTRY[link.href]?.(user.id) || []) : []

    const content = (
      <>
        <div className={cn(sidebarIconVariants({ variant: brandColor }))}>
          {link.icon}
        </div>
        <span>{link.label}</span>
      </>
    )

    if (link.onClick) {
      return (
        <button
          key={link.label}
          type="button"
          onClick={link.onClick}
          data-active={active}
          className={className}
        >
          {content}
        </button>
      )
    }

    const tourId = link.label === "Importar PDF" ? "tour-import-pdf" : 
                   link.label === "Alunos" ? "tour-sidebar-students" : 
                   undefined

    return (
      <SmartLink
        key={link.label}
        id={tourId}
        href={link.href || '#'}
        prefetch={true}
        prefetchConfigs={prefetchConfigs}
        data-active={active}
        className={className}
      >
        {content}
      </SmartLink>
    )
  }

  return (
    <Box
      as="aside"
      display={{ base: 'none', md: 'flex' }}
      width="sidebar-wide"
      height="screen"
      position="sticky"
      top={0}
      zIndex={20}
      shrink={0}
      overflow="hidden"
    >
      <GlassPanel
        fullWidth
        fullHeight
        variant="glass"
        border="none"
        rounded="none"
        display="flex"
        direction="col"
        padding={STORE_TOKENS.PADDING.CONTAINER}
      >
        {/* Right border for desktop static */}
        <Surface 
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

        {/* Brand Logo */}
        <Stack shrink={0} gap={STORE_TOKENS.SPACING.ELEMENT}>
          <Link href="/">
            <Logo size="md" color={logoColor as any} />
          </Link>
          {tagline && (
              <Font 
                  variant="sub-tiny" 
                  weight="black" 
                  uppercase 
                  italic 
                  tracking="widest"
                  color={brandColor === 'zinc' ? 'DIM' : brandColor as any}
              >
                {tagline}
              </Font>
          )}
        </Stack>

        {/* Main Navigation */}
        <Box as="nav" flex1 fullWidth overflow="auto" noScrollbar>
          <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
            {links.filter(l => !l.hidden).map(renderLink)}

            {extraLinks && (
              <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                   <Font variant="tiny" weight="black" uppercase tracking="widest" color="DIM">
                     {extraLinks.title}
                   </Font>
                </Box>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {extraLinks.links.filter(l => !l.hidden).map(renderLink)}
                </Stack>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Bottom Profile Area */}
        <Stack gap={STORE_TOKENS.SPACING.SECTION_MOBILE} shrink={0}>
          <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} padding={STORE_TOKENS.PADDING.ELEMENT}>
            <Box 
                position="relative" 
                width="10" 
                height="10" 
                shrink={0}
                display="flex" 
                align="center" 
                justify="center" 
                overflow="hidden"
            >
               <Surface 
                  pin="inset" 
                  variant="glass" 
                  bg={brandColor === 'zinc' ? STORE_TOKENS.COLORS.SURFACE : brandColor as any}
                  bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                  rounded="full"
                  border="standard"
               >
                  <></>
               </Surface>
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.name || 'User'}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <Font weight="bold" color="PRIMARY">
                    {(user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                </Font>
              )}
            </Box>
            <Box overflow="hidden">
              <Font weight="bold" color="PRIMARY" truncate>{user.name || 'Usuário'}</Font>
              <Font variant="tiny" color="DIM" truncate>{user.email}</Font>
            </Box>
          </Stack>

          <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
              {showSettings && (
                  <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
                      className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 group text-zinc-500 hover:bg-zinc-800 hover:text-white border-2 border-transparent hover:border-zinc-700 w-full italic"
                  >
                      <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <Font variant="tiny" weight="black" uppercase tracking="widest">Configurações</Font>
                  </button>
              )}

              <form action={signOutAction} className="w-full">
                  <Button
                      variant="outline"
                      className="w-full bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 flex items-center gap-2 transition-all font-black uppercase italic tracking-wider py-6 rounded-xl shadow-lg border-2 active:scale-95 group"
                  >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Sair
                  </Button>
              </form>
          </Stack>
        </Stack>
      </GlassPanel>
    </Box>
  )
}
