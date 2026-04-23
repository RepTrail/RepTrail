'use client'

import * as React from "react"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cva, type VariantProps } from "class-variance-authority"
import { LogOut, User, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { signOutAction } from '@/actions/auth-actions'
import { SmartLink } from "@/components/shared/smart-link"

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
  "transition-all duration-300 group-hover:scale-110",
  {
    variants: {
      variant: {
        emerald: "group-data-[active=true]:text-emerald-500 group-data-[active=true]:scale-110 group-hover:text-emerald-400",
        orange: "group-data-[active=true]:text-orange-500 group-data-[active=true]:scale-110 group-hover:text-orange-400",
        amber: "group-data-[active=true]:text-amber-500 group-data-[active=true]:scale-110 group-hover:text-amber-400",
        zinc: "group-data-[active=true]:text-white group-data-[active=true]:scale-110 group-hover:text-white",
        red: "group-data-[active=true]:text-red-500 group-data-[active=true]:scale-110 group-hover:text-red-500",
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

import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getAssignedWorkouts } from '@/actions/workout-actions'
import { getAssignedDiets } from '@/actions/diet-actions'
import { getAssignedCardios } from '@/actions/cardio-actions'

import { PREFETCH_REGISTRY } from "@/lib/prefetch-registry"

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
  const queryClient = useQueryClient()

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
    
    // Use registry for prefetching
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

    return (
      <SmartLink
        key={link.label}
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
    <aside className="hidden md:flex w-72 h-screen fixed top-0 left-0 bg-zinc-900 border-r border-zinc-800 p-6 flex-col shadow-2xl z-20 overflow-hidden">
      {/* Brand Logo */}
      <div className="flex-shrink-0 mb-10">
        <Link href="/">
          <Logo size="md" color={logoColor as any} />
        </Link>
        {tagline && (
          <div className="mt-4 mb-3">
            <span className={cn(
                "text-[10px] font-black uppercase tracking-widest flex items-center gap-2 italic",
                brandColor === 'emerald' ? 'text-emerald-500' : 
                brandColor === 'orange' ? 'text-orange-500' : 
                brandColor === 'amber' ? 'text-amber-500' : 
                brandColor === 'red' ? 'text-red-500' : 'text-zinc-500'
            )}>
              {tagline}
            </span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent custom-scrollbar">
        {links.filter(l => !l.hidden).map(renderLink)}

        {extraLinks && (
          <div className="border-t border-zinc-800 my-4 pt-4">
            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-2">{extraLinks.title}</div>
            {extraLinks.links.filter(l => !l.hidden).map(renderLink)}
          </div>
        )}
      </nav>

      {/* Bottom Profile Area */}
      <div className="border-t border-zinc-800 pt-6 mt-6 flex-shrink-0 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <div className={cn(
              "relative w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold border overflow-hidden",
              brandColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              brandColor === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
              brandColor === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              brandColor === 'red' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
              'bg-zinc-800 text-zinc-400 border-zinc-700'
          )}>
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.name || 'User'}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              (user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-zinc-200 truncate">{user.name || 'Usuário'}</p>
            <p className="text-[10px] text-zinc-500 truncate font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
            {showSettings && (
                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 group text-zinc-500 hover:bg-zinc-800 hover:text-white border-2 border-transparent hover:border-zinc-700 w-full italic"
                >
                    <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Configurações</span>
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
        </div>
      </div>
    </aside>
  )
}
