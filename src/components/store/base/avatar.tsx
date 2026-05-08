import React from 'react'
import { Font } from './font'
import { cn } from '@/lib/utils'

interface BaseAvatarProps {
    initials: string
    variant?: 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'zinc'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    src?: string
    className?: string
}

export function BaseAvatar({
    initials,
    variant = 'zinc',
    size = 'md',
    className
}: BaseAvatarProps) {
    const sizeClasses = {
        sm: 'h-8 w-8 text-[8px]',
        md: 'h-12 w-12 text-[12px]',
        lg: 'h-16 w-16 text-[14px]',
        xl: 'h-20 w-20 text-[16px]'
    }

    const variantClasses = {
        zinc: 'bg-zinc-900 border-zinc-800 text-zinc-500',
        orange: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
        emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
        red: 'bg-red-500/10 border-red-500/30 text-red-500',
        blue: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
        amber: 'bg-amber-500/10 border-amber-500/30 text-amber-500'
    }

    return (
        <div
            className={cn(
                "rounded-full border flex items-center justify-center shrink-0 overflow-hidden",
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
        >
            <Font 
                weight="black" 
                color={variant === 'zinc' ? 'zinc-500' : variant as any} 
                variant={size === 'sm' ? 'sub-tiny' : 'body'} 
                align="center"
            >
                {initials}
            </Font>
        </div>
    )
}
