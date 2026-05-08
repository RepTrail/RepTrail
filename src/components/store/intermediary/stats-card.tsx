import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { GlassPanel } from '../base/surface'
import { Box } from '../base/box'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    label: string
    value: string
    description?: string
    icon: LucideIcon
    color?: 'emerald' | 'orange' | 'amber' | 'red' | 'blue'
    className?: string
}

/**
 * StatsCard: A high-fidelity card for displaying metrics and financial data.
 * Ideal for Admin and Affiliate dashboards.
 */
export function StatsCard({
    label,
    value,
    description,
    icon,
    color = 'emerald',
    className
}: StatsCardProps) {
    const colorMap = {
        emerald: 'bg-emerald-500/10 text-emerald-500',
        orange: 'bg-orange-500/10 text-orange-500',
        amber: 'bg-amber-500/10 text-amber-500',
        red: 'bg-red-500/10 text-red-500',
        blue: 'bg-blue-500/10 text-blue-500'
    }

    return (
        <GlassPanel 
            padding={5} 
            className={cn(
                "group hover:bg-white/[0.05] transition-all duration-500",
                className
            )}
        >
            <Stack gap={5}>
                {/* Icon Header */}
                <Box 
                    width="auto" 
                    height="auto" 
                    padding={2.5} 
                    rounded="system" 
                    className={cn(
                        "w-fit transition-transform group-hover:scale-110 duration-500",
                        colorMap[color]
                    )}
                >
                    <Icon icon={icon} size="sm" />
                </Box>

                {/* Content Body */}
                <Stack gap={1}>
                    <Font 
                        variant="sub-tiny" 
                        weight="black" 
                        uppercase 
                        color="zinc-500" 
                        className="tracking-[0.1em]"
                    >
                        {label}
                    </Font>
                    
                    <Font 
                        variant="h1" 
                        weight="black" 
                        italic 
                        className="text-2xl md:text-3xl tracking-tighter"
                    >
                        {value}
                    </Font>

                    {description && (
                        <Font 
                            variant="sub-tiny" 
                            weight="bold" 
                            uppercase 
                            color="zinc-600" 
                            className="tracking-wider mt-1"
                        >
                            {description}
                        </Font>
                    )}
                </Stack>
            </Stack>
        </GlassPanel>
    )
}
