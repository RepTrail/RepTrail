'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { IconBox } from '../base/icon'
import { GlassPanel } from '../base/surface'
import { Zap, User, Info } from 'lucide-react'
import { Inline } from '../base/layout'
import { Badge } from '../base/badge'
import { cn } from '@/lib/utils'

interface LogItemProps {
    action: string
    admin?: string
    target?: string
    details?: string | Record<string, unknown>
    date: string
    variant?: 'blue' | 'red' | 'amber' | 'emerald' | 'orange' | 'zinc'
}

export function LogItem({ 
    action, 
    admin, 
    target, 
    details, 
    date,
    variant = 'zinc'
}: LogItemProps) {
    const detailString = typeof details === 'object' ? JSON.stringify(details) : details

    return (
        <GlassPanel 
            padding={0} 
            className="group relative overflow-hidden transition-all duration-300 hover:border-white/20"
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
                {/* Identity & Meta Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 w-full">
                    {/* Identity Block - STATIC */}
                    <Inline gap={5} align="center">
                        <IconBox icon={Zap} variant={variant as any} size="md" rounded="full" />
                        
                        <Stack gap={1}>
                            <Font weight="black" uppercase italic color="white" className="text-xs md:text-sm">
                                {action.replace(/_/g, ' ')}
                            </Font>
                            <Inline gap={2.5} align="center" className="opacity-40">
                                <User size={10} className="text-zinc-500" />
                                <Font variant="sub-tiny" color="zinc-400">por {admin || 'Sistema'}</Font>
                            </Inline>
                        </Stack>
                    </Inline>

                    {/* Info Block - DYNAMIC MOVEMENT ON DESKTOP */}
                    <div className="transition-transform duration-500 ease-out lg:group-hover:-translate-x-[200px]">
                        <Inline gap={2.5} align="center">
                            {target && (
                                <Badge 
                                    label={target} 
                                    variant="glass" 
                                    color="orange" 
                                    rounded="full" 
                                    size="xs"
                                />
                            )}
                            <Badge 
                                label={date} 
                                variant="glass" 
                                rounded="full" 
                                size="xs"
                            />
                        </Inline>
                    </div>
                </div>

                {/* Details Slide-in Bar - Slides in on Desktop, Always Visible on Mobile */}
                <div className={cn(
                    "flex items-center bg-zinc-950 lg:bg-zinc-950/90 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 px-5 py-3 transition-transform duration-500 ease-out",
                    "relative lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[200px] lg:translate-x-full lg:group-hover:translate-x-0"
                )}>
                    <Inline gap={2.5} align="center" className="w-full">
                        <div className="shrink-0 p-1.5 rounded-full bg-white/5 border border-white/10">
                            <Info size={14} className="text-blue-500" />
                        </div>
                        <Font variant="sub-tiny" color="zinc-400" mono className="truncate flex-1">
                            {detailString}
                        </Font>
                    </Inline>
                </div>
            </div>
        </GlassPanel>
    )
}
