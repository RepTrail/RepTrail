'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Icon } from '../base/icon'
import { useRegistry } from './registry-context'
import { 
    LayoutDashboard, 
    Users2, 
    HeartHandshake, 
    Zap, 
    Users
} from 'lucide-react'

export function RegistryBottomNav() {
    const { activeTab, setActiveTab } = useRegistry()

    const tabs = [
        { id: 'overview', icon: LayoutDashboard, color: 'blue' },
        { id: 'admin', icon: Users2, color: 'red' },
        { id: 'afiliado', icon: HeartHandshake, color: 'amber' },
        { id: 'personal', icon: Zap, color: 'emerald' },
        { id: 'aluno', icon: Users, color: 'orange' },
    ]

    return (
        <Box 
            display="md-hidden" 
            position="fixed" 
            bottom={0} 
            left={0} 
            width="full" 
            bg="background" 
            borderTop="white/5" 
            padding={2.5}
            zIndex={50}
        >
            <Stack direction="row" justify="around" align="center">
                {tabs.map((tab) => (
                    <Box
                        key={tab.id}
                        padding={2.5}
                        rounded="full"
                        onClick={() => setActiveTab(tab.id)}
                        bg={activeTab === tab.id ? `${tab.color}/20` as any : 'transparent'}
                        transition="all"
                    >
                        <Icon 
                            icon={tab.icon} 
                            size="sm" 
                            color={activeTab === tab.id ? tab.color as any : 'zinc-600'} 
                        />
                    </Box>
                ))}
            </Stack>
        </Box>
    )
}
