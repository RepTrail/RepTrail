'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Font } from './font'
import { Icon } from './icon'
import { LucideIcon } from 'lucide-react'
import { useRegistry } from '../advanced/registry-context'

interface BadgeProps {
    label: string
    icon?: LucideIcon
    variant?: 'dot' | 'outline' | 'solid' | 'glass'
    color?: 'emerald' | 'orange' | 'red' | 'blue' | 'amber' | 'zinc' | 'primary'
    size?: 'xs' | 'sm' | 'md'
    rounded?: 'full' | 'system'
    className?: string
}

export function Badge({ 
    label, 
    icon,
    variant = 'outline', 
    color = 'zinc', 
    size = 'md',
    rounded = 'system',
    className
}: BadgeProps) {
    const { primaryColor } = useRegistry()
    const resolvedColor = color === 'primary' ? primaryColor : color

    const colorClasses = {
        emerald: {
            dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            text: 'text-emerald-500',
            glass: 'bg-emerald-500/10 border-emerald-500/30'
        },
        orange: {
            dot: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/30',
            text: 'text-orange-500',
            glass: 'bg-orange-500/10 border-orange-500/30'
        },
        red: {
            dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            text: 'text-red-500',
            glass: 'bg-red-500/10 border-red-500/30'
        },
        blue: {
            dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            text: 'text-blue-500',
            glass: 'bg-blue-500/10 border-blue-500/30'
        },
        amber: {
            dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30',
            text: 'text-amber-500',
            glass: 'bg-amber-500/10 border-amber-500/30'
        },
        zinc: {
            dot: 'bg-zinc-500',
            bg: 'bg-white/5',
            border: 'border-white/10',
            text: 'text-zinc-400',
            glass: 'bg-white/5 border-white/10'
        },
    }
    
    const current = colorClasses[resolvedColor as keyof typeof colorClasses]

    const sizeMapping = {
        xs: {
            padding: 'px-1.5 py-0.5',
            font: 'sub-tiny' as const,
            icon: 'xs' as const
        },
        sm: {
            padding: 'px-2 py-1',
            font: 'sub-tiny' as const,
            icon: 'xs' as const
        },
        md: {
            padding: 'px-2.5 py-1.5',
            font: 'auxiliary' as const,
            icon: 'xs' as const
        }
    }

    const currentSize = sizeMapping[size]

    if (variant === 'dot') {
        return (
            <div className={cn('flex items-center gap-2 px-1', className)}>
                <div className={cn('w-2 h-2 rounded-full', current.dot)} />
                <Font variant="sub-tiny" weight="black" uppercase italic tracking="widest" color="white">{label}</Font>
            </div>
        )
    }

    const radiusClass = rounded === 'full' ? 'rounded-full' : 'rounded-[5px]'

    return (
        <div className={cn(
            'flex items-center justify-center border w-fit gap-2 backdrop-blur-md transition-all',
            currentSize.padding,
            radiusClass,
            variant === 'glass' ? current.glass : cn(current.bg, current.border),
            variant === 'outline' && 'bg-transparent',
            variant === 'solid' && current.bg,
            className
        )}>
            {icon && <Icon icon={icon} size={currentSize.icon} color={resolvedColor as any} />}
            <Font 
                variant={currentSize.font} 
                color={resolvedColor === 'zinc' ? 'zinc-400' : resolvedColor as any} 
                weight="black" 
                italic 
                uppercase 
                nowrap
            >
                {label}
            </Font>
        </div>
    )
}
