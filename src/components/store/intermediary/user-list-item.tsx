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
            <div className="flex flex-row w-full relative min-h-[100px]">
                
                {/* Main Content Area: Identity (Top) + Badges (Bottom) on Mobile */}
                <div className="flex-1 flex flex-col justify-center lg:flex-row lg:items-center lg:justify-between p-5 gap-5">
                    {/* Identity Block */}
                    <Inline gap={5} align="center">
                        <BaseAvatar initials={initials} variant={avatarVariant} size="md" />
                        <Stack gap={0}>
                            <Font weight="black" uppercase italic color="white" className="text-sm md:text-base tracking-wider">{name}</Font>
                            <Font variant="sub-tiny" color="zinc-600" className="lowercase truncate max-w-[150px] md:max-w-none">{email}</Font>
                        </Stack>
                    </Inline>

                    {/* Badges Block - Below on Mobile, Side on Desktop */}
                    <div className={cn(
                        "transition-transform duration-500 ease-out",
                        (onInspect || onAction || onDelete) && "lg:group-hover:-translate-x-[160px]"
                    )}>
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

                {/* Actions Sidebar: Vertical on Mobile, Absolute Overlay on Desktop */}
                {(onInspect || onAction || onDelete) && (
                    <div className={cn(
                        "flex flex-col lg:flex-row items-center justify-center bg-zinc-950/40 lg:bg-zinc-950/90 backdrop-blur-xl border-l border-white/10 p-4 lg:px-5 lg:py-0 transition-all duration-500 ease-out",
                        // Layout physics: Relative flow for mobile side-by-side, Absolute for desktop overlay
                        "relative lg:absolute lg:right-0 lg:top-0 lg:h-full lg:translate-x-full lg:group-hover:translate-x-0"
                    )}>
                        <Stack direction="row" className="lg:flex-row flex-col" gap={2.5} align="center">
                            {onInspect && (
                                <ActionButton 
                                    icon={Eye} 
                                    variant="outline-blue" 
                                    onClick={onInspect} 
                                />
                            )}
                            {onAction && (
                                <ActionButton 
                                    icon={currentAction.icon} 
                                    variant={currentAction.outlineVariant} 
                                    onClick={onAction} 
                                />
                            )}
                            {onDelete && (
                                <ActionButton 
                                    icon={Trash2} 
                                    variant="outline-red" 
                                    onClick={onDelete} 
                                />
                            )}
                        </Stack>
                    </div>
                )}
            </div>
        </GlassPanel>
    )
}

function ActionButton({ 
    icon: IconComp, 
    variant, 
    onClick 
}: { 
    icon: LucideIcon, 
    variant: any, 
    onClick?: () => void
}) {
    return (
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
    )
}
