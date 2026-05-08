'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { useRegistry } from './registry-context'
import { 
    LayoutDashboard, 
    Users2, 
    HeartHandshake, 
    Zap, 
    Users,
    Settings,
    Trophy
} from 'lucide-react'
import { SidebarLink } from '../base/sidebar-link'
import { SidebarProfile } from '../intermediary/sidebar-profile'
import { Logo } from '../base/logo'

export function RegistrySidebar() {
    const { activeTab, setActiveTab, primaryColor } = useRegistry()

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'blue' },
        { id: 'admin', label: 'Admin', icon: Users2, color: 'red' },
        { id: 'afiliado', label: 'Afiliado', icon: HeartHandshake, color: 'amber' },
        { id: 'personal', label: 'Personal', icon: Zap, color: 'emerald' },
        { id: 'aluno', label: 'Aluno', icon: Users, color: 'orange' },
    ]

    return (
        <Box 
            as="aside" 
            display="hidden" 
            mdDisplay="block" 
            width="72" 
            height="screen" 
            position="fixed" 
            left={0} 
            top={0} 
            bg="background" 
            borderRight="white/5"
            zIndex={40}
        >
            <Stack height="full" gap={0}>
                {/* Brand Header */}
                <Box padding={5} borderBottom="white/5" height="20" display="flex" align="center">
                    <Logo color={primaryColor} size="sm" />
                </Box>

                {/* Navigation Menu */}
                <Box flex1 padding={5} overflow="auto">
                    <Stack gap={10}>
                        <Stack gap={2.5}>
                            <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase tracking="widest" paddingLeft={5}>
                                Menu Principal
                            </Font>
                            <Stack gap={1.5}>
                                {menuItems.map((item) => (
                                    <SidebarLink
                                        key={item.id}
                                        icon={item.icon}
                                        label={item.label}
                                        active={activeTab === item.id}
                                        color={item.color as any}
                                        onClick={() => setActiveTab(item.id)}
                                    />
                                ))}
                            </Stack>
                        </Stack>

                        <Stack gap={2.5}>
                            <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase tracking="widest" paddingLeft={5}>
                                Utilitários
                            </Font>
                            <Stack gap={1.5}>
                                <SidebarLink icon={Trophy} label="Rankings" />
                                <SidebarLink icon={Settings} label="Configurações" />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>

                {/* Profile Footer */}
                <Box borderTop="white/5" padding={5}>
                    <SidebarProfile 
                        name="Marcos RepTrail" 
                        role="Developer Admin" 
                        avatar="https://github.com/shadcn.png" 
                    />
                </Box>
            </Stack>
        </Box>
    )
}
