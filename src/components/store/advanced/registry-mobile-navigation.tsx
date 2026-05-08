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
    Menu,
    X
} from 'lucide-react'

export function RegistryMobileNavigation() {
    const [isOpen, setIsOpen] = React.useState(false)
    const { activeTab, setActiveTab, primaryColor } = useRegistry()

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'blue' },
        { id: 'admin', label: 'Admin', icon: Users2, color: 'red' },
        { id: 'afiliado', label: 'Afiliado', icon: HeartHandshake, color: 'amber' },
        { id: 'personal', label: 'Personal', icon: Zap, color: 'emerald' },
        { id: 'aluno', label: 'Aluno', icon: Users, color: 'orange' },
    ]

    return (
        <Box display="md-hidden" position="fixed" top={0} left={0} width="full" zIndex={50}>
            {/* Header Mobile */}
            <Box bg="background" borderBottom="white/5" padding={5} display="flex" align="center" justify="between">
                <Stack direction="row" align="center" gap={2.5}>
                    <Box bg={primaryColor} width="8" height="8" rounded="sm" display="flex" align="center" justify="center">
                        <Icon icon={LayoutDashboard} color="black" size="xs" />
                    </Box>
                    <Font variant="label-caps" weight="black">RepTrail V2</Font>
                </Stack>
                <Box onClick={() => setIsOpen(!isOpen)} cursor="pointer">
                    <Icon icon={isOpen ? X : Menu} color="white" size="sm" />
                </Box>
            </Box>

            {/* Menu Overlay */}
            {isOpen && (
                <Box 
                    position="fixed" 
                    top="16" 
                    left={0} 
                    width="full" 
                    height="screen" 
                    bg="background" 
                    padding={5}
                    animateIn="fade"
                >
                    <Stack gap={2.5}>
                        {tabs.map((tab) => (
                            <Box
                                key={tab.id}
                                padding={5}
                                rounded="system"
                                bg={activeTab === tab.id ? `${tab.color}/10` as any : 'white/5'}
                                border={activeTab === tab.id ? tab.color as any : 'transparent'}
                                onClick={() => {
                                    setActiveTab(tab.id)
                                    setIsOpen(false)
                                }}
                            >
                                <Stack direction="row" align="center" gap={5}>
                                    <Icon icon={tab.icon} color={activeTab === tab.id ? tab.color as any : 'zinc-600'} size="sm" />
                                    <Font 
                                        variant="body" 
                                        weight="black" 
                                        color={activeTab === tab.id ? 'white' : 'zinc-600'}
                                        uppercase
                                        italic
                                    >
                                        {tab.label}
                                    </Font>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    )
}
