'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Inline } from '../base/layout'
import { Font } from '../base/font'
import { BaseAvatar } from '../base/avatar'
import { Badge } from '../base/badge'
import { Button } from '../base/button'
import { GlassPanel } from '../base/surface'
import { Eye, Sparkles, Zap, Trash2, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserListItemProps {
    name: string
    email: string
    registrationDate: string
    role: 'personal' | 'aluno'
    roleLabel: string
    initials: string
    avatarVariant?: 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'zinc'
    onInspect?: () => void
    onAction?: () => void
    onDelete?: () => void
}

export function UserListItem({
    name,
    email,
    registrationDate,
    role,
    roleLabel,
    initials,
    avatarVariant = 'zinc',
    onInspect,
    onAction,
    onDelete
}: UserListItemProps) {
    
    // Action Config based on role
    const actionConfig = {
        aluno: {
            icon: Sparkles,
            label: 'Ativar Auto-Treino Free',
            color: 'emerald' as const,
            outlineVariant: 'outline-emerald' as const
        },
        personal: {
            icon: Zap,
            label: 'Ativar On-Demand',
            color: 'orange' as const,
            outlineVariant: 'outline-orange' as const
        }
    }

    const currentAction = actionConfig[role]

    return (
        <GlassPanel 
            padding={0} 
            className="group relative overflow-hidden transition-all duration-300 hover:border-white/20"
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
                
                {/* Identity & Badges Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 w-full">
                    {/* Left Side: Avatar & Info - COMPLETELY STATIC */}
                    <Inline gap={2.5} align="center">
                        <BaseAvatar initials={initials} variant={avatarVariant} size="md" />
                        <Stack gap={0}>
                            <Font weight="black" uppercase italic color="white">{name}</Font>
                            <Font variant="sub-tiny" color="zinc-600" className="lowercase">{email}</Font>
                        </Stack>
                    </Inline>

                    {/* Right Side: Badges - DYNAMIC MOVEMENT ON DESKTOP */}
                    <div className="transition-transform duration-500 ease-out lg:group-hover:-translate-x-[160px]">
                        <Inline gap={2.5} align="center">
                            <Badge label={registrationDate} variant="glass" rounded="full" size="xs" />
                            <Badge 
                                label={roleLabel} 
                                variant="glass" 
                                color={role === 'personal' ? 'orange' : 'emerald'} 
                                rounded="full" 
                                size="xs"
                            />
                        </Inline>
                    </div>
                </div>

                {/* Actions Bar - Slides in on Desktop, Always Visible below on Mobile */}
                <div className={cn(
                    "flex items-center bg-zinc-950 lg:bg-zinc-950/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 px-5 py-4 lg:py-0 transition-transform duration-500 ease-out",
                    "relative lg:absolute lg:right-0 lg:top-0 lg:h-full lg:translate-x-full lg:group-hover:translate-x-0"
                )}>
                    <Stack direction="row" gap={2.5} align="center" className="w-full justify-center md:justify-end">
                        <ActionButton 
                            icon={Eye} 
                            variant="outline-blue" 
                            onClick={onInspect} 
                            title="Inspecionar"
                        />
                        <ActionButton 
                            icon={currentAction.icon} 
                            variant={currentAction.outlineVariant} 
                            onClick={onAction} 
                            title={currentAction.label}
                        />
                        <ActionButton 
                            icon={Trash2} 
                            variant="outline-red" 
                            onClick={onDelete} 
                            title="Deletar"
                        />
                    </Stack>
                </div>
            </div>
        </GlassPanel>
    )
}

function ActionButton({ 
    icon: IconComp, 
    variant, 
    onClick, 
    title 
}: { 
    icon: LucideIcon, 
    variant: any, 
    onClick?: () => void,
    title: string
}) {
    return (
        <div className="relative group/btn h-full flex items-center">
            <Button 
                variant={variant} 
                size="sm" 
                rounded="full" 
                isIconOnly 
                onClick={onClick}
                className="hover:scale-110 transition-transform active:scale-95"
            >
                <IconComp size={16} />
            </Button>
        </div>
    )
}
