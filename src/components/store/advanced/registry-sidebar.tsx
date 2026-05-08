import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Logo } from '../base/logo'
import { SidebarItem } from '../intermediary/sidebar-item'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Zap, Activity, Shield, Users, Dumbbell, Trophy } from 'lucide-react'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { cn } from '@/lib/utils'

export function RegistrySidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const { primaryColor } = useRegistry()
  const sections = [
    { id: 'branding', label: 'Branding', icon: Zap },
    { id: 'colors', label: 'Colors & Identity', icon: Activity },
    { id: 'admin', label: 'Admin Identity', icon: Shield },
    { id: 'typography', label: 'Typography', icon: Users },
    { id: 'components', label: 'Real Components', icon: Dumbbell },
    { id: 'layout', label: 'Layout & Spacing', icon: Trophy },
  ]

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-72 z-50 hidden lg:flex flex-row gap-0"
      )}
    >
      <div className="flex-1 bg-zinc-900 p-5 flex flex-col h-full border-r border-white/5">
        {/* Brand Logo Area + Navigation Area (Gap 50px) */}
        <Stack gap={12.5} flex1 className="overflow-hidden">
          <div className="shrink-0">
            <Logo size="md" color={primaryColor as any} />
          </div>

          <nav className="flex-1 overflow-auto scrollbar-hide">
            <Stack gap={2.5}>
              {sections.map((section, idx) => (
                <SidebarItem
                  key={section.id}
                  label={section.label}
                  icon={section.icon}
                  active={idx === 0}
                  variant={primaryColor as any}
                  onClick={() => scrollToSection(section.id)}
                />
              ))}
            </Stack>
          </nav>
        </Stack>

        {/* Bottom Profile Area (Gap 20px) */}
        <Stack gap={5}>
          {/* Divider */}
          <div className="w-full h-px bg-white/10" />
          <SidebarProfile onOpenSettings={onOpenSettings} />
        </Stack>
      </div>

      {/* Physical Border Right / Aesthetic separator */}
      <div className="bg-gradient-to-b from-white/[0.05] to-transparent w-px h-full" />
    </aside>
  )
}
