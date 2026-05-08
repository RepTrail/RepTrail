import React from 'react'
import { cn } from '@/lib/utils'
import { Font } from './font'
import { Stack } from './stack'

interface BadgeProps {
    label: string
    variant?: 'dot' | 'outline' | 'solid'
    color?: 'emerald' | 'orange' | 'red' | 'blue' | 'amber' | 'zinc'
    size?: 'sm' | 'md'
}

export function Badge({
    label,
    variant = 'outline',
    color = 'zinc',
    size = 'md'
}: BadgeProps) {
    
    const colorClasses = {
        emerald: { 
            dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]', 
            bg: 'bg-emerald-500/20', 
            border: 'border-emerald-500/30',
            text: 'text-emerald-500'
        },
        orange: { 
            dot: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]', 
            bg: 'bg-orange-500/20', 
            border: 'border-orange-500/30',
            text: 'text-orange-500'
        },
        red: { 
            dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]', 
            bg: 'bg-red-500/20', 
            border: 'border-red-500/30',
            text: 'text-red-500'
        },
        blue: { 
            dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]', 
            bg: 'bg-blue-500/20', 
            border: 'border-blue-500/30',
            text: 'text-blue-500'
        },
        amber: { 
            dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]', 
            bg: 'bg-amber-500/20', 
            border: 'border-amber-500/30',
            text: 'text-amber-500'
        },
        zinc: { 
            dot: 'bg-zinc-500', 
            bg: 'bg-white/5', 
            border: 'border-white/10',
            text: 'text-zinc-400'
        },
    }

    const current = colorClasses[color]

    if (variant === 'dot') {
        return (
            <Stack direction="row" align="center" gap={2.5}>
                <div className={cn('w-2 h-2 rounded-full', current.dot)} />
                <Font variant="auxiliary" weight="bold" color="white" uppercase tracking="wide">{label}</Font>
            </Stack>
        )
    }

    if (variant === 'solid') {
        return (
            <div className={cn(
                'h-6 px-2.5 flex items-center justify-center rounded-[5px] w-fit',
                color === 'zinc' ? 'bg-zinc-500' : current.dot.split(' ')[0] // Get bg color without shadow
            )}>
                <Font variant="sub-tiny" color="black" weight="black" uppercase italic nowrap>{label}</Font>
            </div>
        )
    }

    // Default: Outline
    return (
        <div className={cn(
            'h-6 px-2.5 flex items-center justify-center rounded-[5px] border w-fit',
            current.bg,
            current.border
        )}>
            <Font variant="sub-tiny" color={color === 'zinc' ? 'zinc-400' : color as any} weight="black" uppercase italic nowrap>{label}</Font>
        </div>
    )
}
